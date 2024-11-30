export interface CellInterface {
  id: number;
  value: number;
  // the position of the cell in the board
  // this is used to determine the animation of the cell when it moves
  // todo: to be implemented later
  row: number;
  column: number;
}

export interface RowInterface extends Array<CellInterface> {}
export interface BoardInterface extends Array<RowInterface> {}

export enum MoveType {
  NONE,
  SWAP,
  MERGE,
}
