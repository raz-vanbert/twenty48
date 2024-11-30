import { BoardInterface, CellInterface } from "@/types";
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

export const flattenBoard = (board: BoardInterface): CellInterface[] => {
  return orderBy(board.flat(), ["row", "column"], ["asc", "asc"]);
};

export const createEmptyBoard = (): CellInterface[] => {
  const newBoard = flattenBoard(
    Array.from({ length: 4 }, (_, row) =>
      Array.from({ length: 4 }, (_, column) => ({
        id: row * 4 + column,
        value: 0,
        row,
        column,
      }))
    )
  );
  return newBoard;
};

export const moveCellsDown = (board: CellInterface[]): CellInterface[] => {
  const result = board.reverse();

  let movesLeft = 3;

  while (movesLeft) {
    result.forEach((cell) => {
      if (cell.row === 3) {
        return;
      }
      const southCell = result.find(
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

  return result;
};

export const moveCellsUp = (board: CellInterface[]): CellInterface[] => {
  const result = [...board];

  let movesLeft = 3;

  while (movesLeft) {
    result.forEach((cell) => {
      if (cell.row === 0) {
        return;
      }
      const northCell = result.find(
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

  return result;
};

export const moveCellsRight = (board: CellInterface[]): CellInterface[] => {
  const result = [...board];

  let movesLeft = 3;

  while (movesLeft) {
    result.forEach((cell) => {
      if (cell.column === 3) {
        return;
      }
      const eastCell = result.find(
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

  return result;
};

export const moveCellsLeft = (board: CellInterface[]): CellInterface[] => {
  const result = [...board];

  let movesLeft = 3;

  while (movesLeft) {
    result.forEach((cell) => {
      if (cell.column === 0) {
        return;
      }
      const westCell = result.find(
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

  return result;
};

// spawning a new tile at a random position
export const spawnNewTile = (board: CellInterface[]): CellInterface[] => {
  const result = [...board];
  const emptyCellIds = result
    .filter((cell) => cell.value === 0)
    .map((cell) => cell.id);
  if (emptyCellIds.length === 0) {
    return board;
  }
  const randomEmptyCellIndex = Math.floor(Math.random() * emptyCellIds.length);

  const randomEmptyCellId = emptyCellIds[randomEmptyCellIndex];

  result.find((cell) => cell.id === randomEmptyCellId)!.value =
    getRandomTileValue();

  return result;
};

export const addFirstTiles = (board: CellInterface[]): CellInterface[] => {
  const result = [...board];
  const firstTile = getRandomTileValue();
  const secondTile = getRandomTileValue();
  const firstTileIndex = Math.floor(Math.random() * 16);
  let secondTileIndex = Math.floor(Math.random() * 16);
  while (secondTileIndex === firstTileIndex) {
    secondTileIndex = Math.floor(Math.random() * 16);
  }
  result[firstTileIndex].value = firstTile;
  result[secondTileIndex].value = secondTile;
  return result;
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
