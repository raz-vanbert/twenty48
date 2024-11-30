// This is my version of the popuiar 2048 game created by Gabriele Cirulli
// See https://en.wikipedia.org/wiki/2048_(video_game) for more information

import Cell from "@/components/Cell";
import { Button } from "@/components/ui/button";
import { CellInterface } from "@/types";
import {
  addFirstTiles,
  createEmptyBoard,
  moveCellsDown,
  moveCellsLeft,
  moveCellsRight,
  moveCellsUp,
  spawnNewTile,
} from "@/utilities";
import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // storing the game state
  const [board, setBoard] = useState<CellInterface[]>([]);
  const [score, setScore] = useState<number>(0);
  const [won, setWon] = useState<boolean>(false);
  const [over, setOver] = useState<boolean>(false);

  const newGame = () => {
    let newBoard = createEmptyBoard();
    newBoard = addFirstTiles(newBoard);
    setBoard(newBoard);
    setWon(false);
    setOver(false);
    setScore(0);
  };

  // moving the tiles to the right
  const moveRight = () => {
    if (won || over) {
      return;
    }
    const newBoard = moveCellsRight(board);
    setBoard(newBoard);
  };

  const moveLeft = () => {
    if (won || over) {
      return;
    }
    const newBoard = moveCellsLeft(board);
    setBoard(newBoard);
  };

  const moveUp = () => {
    if (won || over) {
      return;
    }
    const newBoard = moveCellsUp(board);
    setBoard(newBoard);
  };

  const moveDown = () => {
    if (won || over) {
      return;
    }
    const newBoard = moveCellsDown(board);
    setBoard(newBoard);
  };

  const spawnRandomTile = () => {
    const newBoard = spawnNewTile(board);
    setBoard(newBoard);
  };

  // handling the key press
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
        moveUp();
        spawnRandomTile();
        updateGameStatus();
        break;
      case "ArrowDown":
        moveDown();
        spawnRandomTile();
        updateGameStatus();
        break;
      case "ArrowLeft":
        moveLeft();
        spawnRandomTile();
        updateGameStatus();
        break;
      case "ArrowRight":
        moveRight();
        spawnRandomTile();
        updateGameStatus();
        break;
      case "n":
        newGame();
        break;
    }
  };

  const updateGameStatus = () => {
    // check if the game is over
    const hasEmptyCells = board.some((cell) => cell.value === 0);
    if (!hasEmptyCells) {
      setOver(true);
    } else {
      const has2048 = board.some((cell) => cell.value === 2048);
      if (has2048) {
        setWon(true);
      }
    }
    const score = board.reduce((acc, cell) => acc + cell.value, 0);
    setScore(score);
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
          bg={over ? "red" : "gray.700"}
          borderRadius="8px"
          padding="2"
          boxSizing="content-box"
        >
          {board.map((cell) => (
            <Cell key={cell.id} cell={cell} />
          ))}
        </Box>
      </Stack>
    </>
  );
}

export default App;
