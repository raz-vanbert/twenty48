// This is my version of the popuiar 2048 game created by Gabriele Cirulli
// I will be using Chakra UI for the styling
// I will be using React for the logic
// I will be using TypeScript for the type checking
// I will be using Vite for the bundling
// I will be using ESLint for the linting
// I will be using Prettier for the formatting
// See https://en.wikipedia.org/wiki/2048_(video_game) for more information

import { Button } from "@/components/ui/button";
import { Box, Center, HStack, Stack } from "@chakra-ui/react";
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

interface BoardInterface {
  cells: CellInterface[];
}

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
  // [a.row, b.row] = [b.row, a.row];
};

// merge 2 cells by
const merge = (cellA: CellInterface, cellB: CellInterface) => {
  swap(cellA, cellB);
  cellA.value *= 2;
  cellB.value = 0;
};

// sort cells by their column
const sortCellsByColumn = (cells: CellInterface[]) => {
  return cells.sort((a, b) => a.column - b.column);
};

// sort cells by their id
const sortCellsById = (cells: CellInterface[]) => {
  return cells.sort((a, b) => a.id - b.id);
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

// const getRandomEmptyCell = (board: CellInterface[]) => {
//   const emptyCells = board.filter(cell => cell.value === 0);
//   return emptyCells[Math.floor(Math.random() * emptyCells.length)];
// }

interface CellProps {
  cell: CellInterface;
}
function Cell({ cell }: CellProps) {
  return (
    <Center
      w="60px"
      h="60px"
      bg={getCellBgColor(cell.value)}
      color="black"
      position="absolute"
      transform={`translate(${cell.column * 60}px, ${cell.row * 60}px)`}
      transition={`transform 0.2s`}
    >
      <Box as="span" fontWeight="bold" fontSize="md">
        {cell.value}
      </Box>
    </Center>
  );
}

function App() {
  // storing the game state
  const [board, setBoard] = useState<CellInterface[]>([]);
  const [score, setScore] = useState<number>(0);
  const [won, setWon] = useState<boolean>(false);
  const [over, setOver] = useState<boolean>(false);

  // starting the game with one row of 4 tiles
  const newGame = () => {
    // create a new board with 4 empty cells with
    const newBoard = Array.from({ length: 4 }, (_v, i) => ({
      id: i,
      value: 0,
      row: 0,
      column: i,
    }));
    newBoard[getRandomPosition()].value = getRandomTileValue();
    newBoard[getRandomPosition()].value = getRandomTileValue();
    setBoard(newBoard);
  };

  const stepRight = (): MoveType => {
    let moveMade = MoveType.NONE;
    const row = [...board];
    sortCellsByColumn(row);
    let lastMovableNonZeroCellPosition = row.length - 2;
    // 2 0 4 2
    {
      // iterate from right to left to find the last non-zero cell
      for (let i = lastMovableNonZeroCellPosition; i >= 0; i--) {
        if (
          row[i].value !== 0 &&
          (row[i + 1].value === 0 || row[i].value === row[i + 1].value)
        ) {
          lastMovableNonZeroCellPosition = i;
          break;
        }
      }

      // swap the last non-zero cell with the cell to its right if that cell is zero
      if (
        lastMovableNonZeroCellPosition < row.length - 1 &&
        row[lastMovableNonZeroCellPosition + 1].value === 0
      ) {
        console.log("swap");
        swap(
          row[lastMovableNonZeroCellPosition],
          row[lastMovableNonZeroCellPosition + 1]
        );
        lastMovableNonZeroCellPosition++;
        moveMade = MoveType.SWAP;
        // if the cell to the right is the same as the last non-zero cell, merge them
      } else if (
        row[lastMovableNonZeroCellPosition].value ===
        row[lastMovableNonZeroCellPosition + 1].value
      ) {
        console.log("merge");
        // merge the cells
        merge(
          row[lastMovableNonZeroCellPosition],
          row[lastMovableNonZeroCellPosition + 1]
        );
        moveMade = MoveType.MERGE;
      } else {
        console.log("no more moves to be made");
        return moveMade;
      }

      sortCellsById(row);
      setBoard(row);
      return moveMade;
    }
  };

  const stepLeft = () => {};

  // moving the tiles to the right
  const moveRight = () => {
    // recursivelly call stepRight until there are no more moves to be made
    let move;
    do {
      move = stepRight();
    } while (move !== MoveType.NONE);
  };

  // moving the tiles to the left
  const moveLeft = () => {
    const newBoard = [...board];
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
        <HStack>
          <Button color="white" onClick={stepLeft}>
            Step Left
          </Button>
          <Button color="white" onClick={stepRight}>
            Step Right
          </Button>
        </HStack>
        <Button color="white" onClick={newGame}>
          New Game
        </Button>
        <Box h="60px" w="240px">
          {board.map((cell: CellInterface) => (
            <Cell key={cell.id} cell={cell} />
          ))}
        </Box>
      </Stack>
    </>
  );
}

export default App;
