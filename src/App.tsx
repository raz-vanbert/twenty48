// This is my version of the popuiar 2048 game created by Gabriele Cirulli
// I will be using Chakra UI for the styling
// I will be using React for the logic
// I will be using TypeScript for the type checking
// I will be using Vite for the bundling
// I will be using ESLint for the linting
// I will be using Prettier for the formatting
// See https://en.wikipedia.org/wiki/2048_(video_game) for more information

import { Button } from "@/components/ui/button";
import { Box, Center, Stack } from "@chakra-ui/react";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import "./App.css";
interface CellInterface {
  id: number;
  value: number;
  // the position of the cell in the board
  // this is used to determine the animation of the cell when it moves
  // todo: to be implemented later
  row: number;
  column: number;
}

interface RowInterface extends Array<CellInterface> {}
interface BoardInterface extends Array<RowInterface> {}

enum MoveType {
  NONE,
  SWAP,
  MERGE,
}

// swap 2 cells
const swap = (a: CellInterface, b: CellInterface) => {
  // mutating the cells
  // todo: use immutability
  [a.column, b.column] = [b.column, a.column];
  [a.row, b.row] = [b.row, a.row];
};

// merge 2 cells by
const merge = (cellA: CellInterface, cellB: CellInterface) => {
  swap(cellA, cellB);
  cellA.value *= 2;
  cellB.value = 0;
};

// sort cells by their column
const sortCellsByColumn = (cells: RowInterface) => {
  return cells.sort((a, b) => a.column - b.column);
};

// sort cells by their id
const sortCellsById = (cells: RowInterface) => {
  return cells.sort((a, b) => a.id - b.id);
};

const stepRowRight = (
  row: RowInterface
): { newRow: RowInterface; moveMade: MoveType } => {
  let moveMade = MoveType.NONE;

  if (row.reduce((acc, cell) => acc + cell.value, 0) === 0) {
    return { newRow: row, moveMade };
  }
  // create a copy of the row
  const rowCopy = [...row];

  sortCellsByColumn(rowCopy);
  let lastMovableNonZeroCellPosition = rowCopy.length - 2;

  // iterate from right to left to find the last non-zero cell
  for (let i = lastMovableNonZeroCellPosition; i >= 0; i--) {
    if (
      rowCopy[i].value !== 0 &&
      (rowCopy[i + 1].value === 0 || rowCopy[i].value === rowCopy[i + 1].value)
    ) {
      lastMovableNonZeroCellPosition = i;
      break;
    }
  }

  // swap the last non-zero cell with the cell to its right if that cell is zero
  if (
    lastMovableNonZeroCellPosition < rowCopy.length - 1 &&
    rowCopy[lastMovableNonZeroCellPosition + 1].value === 0
  ) {
    swap(
      rowCopy[lastMovableNonZeroCellPosition],
      rowCopy[lastMovableNonZeroCellPosition + 1]
    );
    lastMovableNonZeroCellPosition++;
    moveMade = MoveType.SWAP;
    // if the cell to the right is the same as the last non-zero cell, merge them
  } else if (
    rowCopy[lastMovableNonZeroCellPosition].value ===
    rowCopy[lastMovableNonZeroCellPosition + 1].value
  ) {
    // merge the cells
    merge(
      rowCopy[lastMovableNonZeroCellPosition],
      rowCopy[lastMovableNonZeroCellPosition + 1]
    );
    moveMade = MoveType.MERGE;
    // increment the score
    // todo: just return the score and increment it in the parent function
    // setScore(score + rowCopy[lastMovableNonZeroCellPosition].value);
  } else {
    return { newRow: rowCopy, moveMade };
  }
  sortCellsById(rowCopy);

  return { newRow: rowCopy, moveMade };
};

// we could also reverse the row and call stepRight

const stepRowLeft = (
  row: RowInterface
): { newRow: RowInterface; moveMade: MoveType } => {
  let moveMade = MoveType.NONE;

  if (row.reduce((acc, cell) => acc + cell.value, 0) === 0) {
    return { newRow: row, moveMade };
  }
  // create a copy of the row
  const rowCopy = [...row];

  sortCellsByColumn(rowCopy);
  let firstMovableNonZeroCellPosition = 1;

  // iterate from left to right to find the first non-zero cell
  for (let i = firstMovableNonZeroCellPosition; i < rowCopy.length; i++) {
    if (
      rowCopy[i].value !== 0 &&
      (rowCopy[i - 1].value === 0 || rowCopy[i].value === rowCopy[i - 1].value)
    ) {
      firstMovableNonZeroCellPosition = i;
      break;
    }
  }

  // swap the first non-zero cell with the cell to its left if that cell is zero
  if (
    firstMovableNonZeroCellPosition > 0 &&
    rowCopy[firstMovableNonZeroCellPosition - 1].value === 0
  ) {
    swap(
      rowCopy[firstMovableNonZeroCellPosition],
      rowCopy[firstMovableNonZeroCellPosition - 1]
    );
    firstMovableNonZeroCellPosition--;
    moveMade = MoveType.SWAP;
    // if the cell to the left is the same as the first non-zero cell, merge them
  } else if (
    rowCopy[firstMovableNonZeroCellPosition].value ===
    rowCopy[firstMovableNonZeroCellPosition - 1].value
  ) {
    // merge the cells
    merge(
      rowCopy[firstMovableNonZeroCellPosition],
      rowCopy[firstMovableNonZeroCellPosition - 1]
    );
    moveMade = MoveType.MERGE;
    // increment the score
    // setScore(score + rowCopy[firstMovableNonZeroCellPosition].value);
  } else {
    return { newRow: rowCopy, moveMade };
  }

  sortCellsById(rowCopy);

  return { newRow: rowCopy, moveMade };
};

const stepRight = (
  board: BoardInterface
): {
  newBoard: BoardInterface;
  numberOfMoves: number;
} => {
  const boardCopy = [...board];
  let numberOfMoves = 0;

  boardCopy.forEach((row, index) => {
    const { newRow, moveMade } = stepRowRight(row);
    boardCopy[index] = newRow;
    if (moveMade !== MoveType.NONE) {
      numberOfMoves++;
    }
  });

  return { newBoard: boardCopy, numberOfMoves };
};

const stepLeft = (
  board: BoardInterface
): {
  newBoard: BoardInterface;
  numberOfMoves: number;
} => {
  const boardCopy = [...board];
  let numberOfMoves = 0;

  boardCopy.forEach((row, index) => {
    const { newRow, moveMade } = stepRowLeft(row);
    boardCopy[index] = newRow;
    if (moveMade !== MoveType.NONE) {
      numberOfMoves++;
    }
  });

  return { newBoard: boardCopy, numberOfMoves };
};

// get the background color of the cell based on its value
// the higher the value, the brighter the color
// zero is dark gray
const getCellBgColor = (value: number) => {
  // use the formula to get the color
  const color = Math.log2(value) * 20;
  return `hsl(0, 0%, ${color}%)`;
};

// The game begins with two tiles already in the grid,
// having a value of either 2 or 4,
// and another such tile appears in a random empty space after each turn.
// Tiles with a value of 2 appear 90% of the time,
// and tiles with a value of 4 appear 10% of the time.

const getRandomTileValue = () => {
  return Math.random() < 0.9 ? 2 : 4;
};

// get random number between 0 and 3
const getRandomPosition = () => {
  return Math.floor(Math.random() * 4);
};

const flipMatrixAroundYAxis = (matrix: BoardInterface): BoardInterface => {
  const result = cloneDeep(matrix);

  result.forEach((row) => {
    swap(row[0], row[3]);
    swap(row[1], row[2]);
  });

  return result;
};

// flip the matrix around diagonal starting from the top left
const flipMatrixAroundDiagonal = (matrix: BoardInterface): BoardInterface => {
  const result = cloneDeep(matrix);

  for (let i = 0; i < result.length; i++) {
    for (let j = i; j < result.length; j++) {
      if (i !== j) {
        swap(result[i][j], result[j][i]);
      }
    }
  }

  return result;
};

// swaps the positions of 2 cells on the board

interface CellProps {
  cell: CellInterface;
}
function Cell({ cell }: CellProps) {
  return (
    <Center
      w="68px"
      h="68px"
      bg={getCellBgColor(cell.value)}
      color="black"
      position="absolute"
      border="4px solid gray.700"
      borderRadius="4px"
      transform={`translate(${cell.column * 68}px, ${cell.row * 68}px)`}
      transition={`transform 0.2s`}
    >
      <Box as="span" fontWeight="bold" fontSize="md">
        {cell.value === 0 ? "" : cell.value}
      </Box>
    </Center>
  );
}

function App() {
  // storing the game state
  const [board, setBoard] = useState<BoardInterface>([[]]);
  const [score, setScore] = useState<number>(0);
  const [won, setWon] = useState<boolean>(false);
  const [over, setOver] = useState<boolean>(false);

  // starting the game with one row of 4 tiles
  const newGame = () => {
    // create a new board with 4 empty cells with
    const newBoard = Array.from({ length: 4 }, (_, row) =>
      Array.from({ length: 4 }, (_, column) => ({
        id: row * 4 + column,
        value: 0,
        row,
        column,
      }))
    );
    newBoard[getRandomPosition()][getRandomPosition()].value =
      getRandomTileValue();
    newBoard[getRandomPosition()][getRandomPosition()].value =
      getRandomTileValue();
    setScore(0);
    setBoard(newBoard);
  };

  // moving the tiles to the right
  const moveRight = () => {
    let moveMade = true;

    const boardCopy = cloneDeep(board);
    let result = boardCopy;

    do {
      // recursivelly call stepRight until there are no more moves to be made
      const { newBoard, numberOfMoves } = stepRight(board);
      if (numberOfMoves === 0) {
        moveMade = false;
      } else {
        result = newBoard;
      }
    } while (moveMade);

    // result = result.map((row) => sortCellsByColumn(row));
    setBoard(result);
  };

  // // move the tiles to the left by reversing the rows and calling stepRight
  // const moveLeft = () => {
  //   let moveMade = true;
  //   const boardCopy = cloneDeep(board);

  //   // reverse the column values of the cells in each row
  //   const yMirror = boardCopy.map((row) =>
  //     row.map((cell, index) => ({ ...cell, column: 3 - index }))
  //   );

  //   let result = boardCopy;

  //   do {
  //     const { newBoard, numberOfMoves } = stepRight(yMirror);
  //     if (numberOfMoves === 0) {
  //       moveMade = false;
  //     } else {
  //       result = newBoard;
  //     }
  //   } while (moveMade);

  //   result = result.map((row) =>
  //     row.map((cell) => ({ ...cell, column: 3 - cell.column }))
  //   );

  //   setBoard(result);
  // };

  // moving the tiles to the left
  const moveLeft = () => {
    let moveMade = true;

    const boardCopy = cloneDeep(board);
    let result = boardCopy;

    do {
      // recursivelly call stepLeft until there are no more moves to be made
      const { newBoard, numberOfMoves } = stepLeft(board);
      if (numberOfMoves === 0) {
        moveMade = false;
      } else {
        result = newBoard;
      }
    } while (moveMade);

    // result = result.map((row) => sortCellsByColumn(row));
    setBoard(result);
  };

  // handling the key press
  const handleKeyDown = (event: KeyboardEvent) => {
    if (won || over) return;
    switch (event.key) {
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowLeft":
        moveLeft();
        break;
      case "n":
        newGame();
        break;
    }
  };

  // listening for the key press
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <>
      <Stack>
        <Box>
          <h1>2048</h1>
          <p>Score: {score}</p>
        </Box>

        <Button color="white" onClick={newGame}>
          New Game
        </Button>
        <Box
          h="272px"
          w="272px"
          bg="gray.700"
          borderRadius="8px"
          padding="2"
          boxSizing="content-box"
        >
          {board.map((row) =>
            row.map((cell) => <Cell key={cell.id} cell={cell} />)
          )}
        </Box>
      </Stack>
    </>
  );
}

export default App;
