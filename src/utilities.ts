import { BoardInterface, CellInterface, MoveType, RowInterface } from "@/types";
import { orderBy } from "lodash";

// swap 2 cells
export const swap = (a: CellInterface, b: CellInterface) => {
  // mutating the cells
  // todo: use immutability
  [a.column, b.column] = [b.column, a.column];
  [a.row, b.row] = [b.row, a.row];
};

// merge 2 cells by
export const merge = (cellA: CellInterface, cellB: CellInterface) => {
  swap(cellA, cellB);
  cellA.value *= 2;
  cellB.value = 0;
};

// sort cells by their column
export const sortCellsByColumn = (cells: RowInterface) => {
  return cells.sort((a, b) => a.column - b.column);
};

// sort cells by their id
export const sortCellsById = (cells: RowInterface) => {
  return cells.sort((a, b) => a.id - b.id);
};

export const stepRowRight = (
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

export const stepRight = (
  board: BoardInterface
): {
  newBoard: BoardInterface;
  numberOfMoves: number;
} => {
  const boardRows = [...board];
  let numberOfMoves = 0;

  boardRows.forEach((row) => {
    const { newRow, moveMade } = stepRowRight(row);
    row = newRow;
    if (moveMade !== MoveType.NONE) {
      numberOfMoves++;
    }
  });

  return { newBoard: boardRows, numberOfMoves };
};

export const stepRowLeft = (
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

export const stepLeft = (
  board: BoardInterface
): {
  newBoard: BoardInterface;
  numberOfMoves: number;
} => {
  const boardRows = [...board];
  let numberOfMoves = 0;

  boardRows.forEach((row) => {
    const { newRow, moveMade } = stepRowLeft(row);
    row = newRow;
    if (moveMade !== MoveType.NONE) {
      numberOfMoves++;
    }
  });

  return { newBoard: boardRows, numberOfMoves };
};

export const flattenBoard = (board: BoardInterface): CellInterface[] => {
  return orderBy(board.flat(), ["row", "column"], ["asc", "asc"]);
};

export const unflattenBoard = (flatBoard: CellInterface[]): BoardInterface => {
  const result: BoardInterface = [[], [], [], []];
  for (let i = 0; i < 4; i++) {
    result[i] = flatBoard
      .filter((cell) => cell.row === i)
      .sort((a, b) => a.id - b.id);
  }
  return result;
};

export const moveCellsDown = (board: BoardInterface): BoardInterface => {
  const flatBoard = flattenBoard(board).reverse();

  let movesLeft = 3;

  while (movesLeft) {
    flatBoard.forEach((cell) => {
      if (cell.row === 3) {
        return;
      }
      const southCell = flatBoard.find(
        (c) => c.row === cell.row + 1 && c.column === cell.column
      );
      if (southCell?.value === 0) {
        swap(cell, southCell);
      } else if (southCell?.value === cell.value) {
        merge(cell, southCell);
      }
    });
    movesLeft--;
  }

  const result = unflattenBoard(flatBoard);

  return result;
};

export const moveCellsUp = (board: BoardInterface): BoardInterface => {
  const flatBoard = flattenBoard(board);

  let movesLeft = 3;

  while (movesLeft) {
    flatBoard.forEach((cell) => {
      if (cell.row === 0) {
        return;
      }
      const northCell = flatBoard.find(
        (c) => c.row === cell.row - 1 && c.column === cell.column
      );
      if (northCell?.value === 0) {
        swap(cell, northCell);
      } else if (northCell?.value === cell.value) {
        merge(cell, northCell);
      }
    });
    movesLeft--;
  }

  const result = unflattenBoard(flatBoard);

  return result;
};

export const moveCellsRight = (board: BoardInterface): BoardInterface => {
  const flatBoard = flattenBoard(board);

  let movesLeft = 3;

  while (movesLeft) {
    flatBoard.forEach((cell) => {
      if (cell.column === 3) {
        return;
      }
      const eastCell = flatBoard.find(
        (c) => c.row === cell.row && c.column === cell.column + 1
      );
      if (eastCell?.value === 0) {
        swap(cell, eastCell);
      } else if (eastCell?.value === cell.value) {
        merge(cell, eastCell);
      }
    });
    movesLeft--;
  }

  const result = unflattenBoard(flatBoard);

  return result;
};

export const moveCellsLeft = (board: BoardInterface): BoardInterface => {
  const flatBoard = flattenBoard(board);

  let movesLeft = 3;

  while (movesLeft) {
    flatBoard.forEach((cell) => {
      if (cell.column === 0) {
        return;
      }
      const westCell = flatBoard.find(
        (c) => c.row === cell.row && c.column === cell.column - 1
      );
      if (westCell?.value === 0) {
        swap(cell, westCell);
      } else if (westCell?.value === cell.value) {
        merge(cell, westCell);
      }
    });
    movesLeft--;
  }

  const result = unflattenBoard(flatBoard);

  return result;
};

// spawning a new tile at a random position
export const spawnNewTile = (board: BoardInterface): BoardInterface => {
  const flatBoard = flattenBoard(board);
  const emptyCellIds = flatBoard
    .filter((cell) => cell.value === 0)
    .map((cell) => cell.id);
  if (emptyCellIds.length === 0) {
    return board;
  }
  const randomEmptyCellIndex = Math.floor(Math.random() * emptyCellIds.length);

  const randomEmptyCellId = emptyCellIds[randomEmptyCellIndex];

  flatBoard.find((cell) => cell.id === randomEmptyCellId)!.value =
    getRandomTileValue();

  const newBoard = unflattenBoard(flatBoard);

  return newBoard;
};

// get the background color of the cell based on its value
// the higher the value, the brighter the color
// zero is dark gray
export const getCellBgColor = (value: number) => {
  // use the formula to get the color
  const color = Math.log2(value) * 20;
  return `hsl(0, 0%, ${color}%)`;
};

// The game begins with two tiles already in the grid,
// having a value of either 2 or 4,
// and another such tile appears in a random empty space after each turn.
// Tiles with a value of 2 appear 90% of the time,
// and tiles with a value of 4 appear 10% of the time.
export const getRandomTileValue = () => {
  return Math.random() < 0.9 ? 2 : 4;
};

// get random number between 0 and 3
export const getRandomPosition = () => {
  return Math.floor(Math.random() * 4);
};

export const flipMatrixAroundYAxis = (
  matrix: BoardInterface
): BoardInterface => {
  const result = [...matrix];

  result.forEach((row) => {
    swap(row[0], row[3]);
    swap(row[1], row[2]);
  });

  return result;
};

// flip the matrix around diagonal starting from the top left
export const flipMatrixAroundDiagonal = (
  matrix: BoardInterface
): BoardInterface => {
  const result = [...matrix];

  for (let i = 0; i < result.length; i++) {
    for (let j = i; j < result.length; j++) {
      if (i !== j) {
        swap(result[i][j], result[j][i]);
      }
    }
  }

  return result;
};
