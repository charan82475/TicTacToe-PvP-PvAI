import React, { useState, useEffect } from "react";
import "./App.css";

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

const findBestMove = (board) => {
  // 1️⃣ AI Wins If Possible
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] === "O" && board[b] === "O" && board[c] === null) return c;
    if (board[a] === "O" && board[c] === "O" && board[b] === null) return b;
    if (board[b] === "O" && board[c] === "O" && board[a] === null) return a;
  }

  // 2️⃣ AI Blocks Player From Winning
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] === "X" && board[b] === "X" && board[c] === null) return c;
    if (board[a] === "X" && board[c] === "X" && board[b] === null) return b;
    if (board[b] === "X" && board[c] === "X" && board[a] === null) return a;
  }

  // 3️⃣ AI Takes Center If Available
  if (board[4] === null) return 4;

  // 4️⃣ AI Chooses a Corner If Center is Taken
  const corners = [0, 2, 6, 8].filter(i => board[i] === null);
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

  // 5️⃣ If No Good Move, AI Chooses Any Available Spot
  const availableMoves = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
  return availableMoves.length > 0 ? availableMoves[0] : null;
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState("AI"); // "AI" or "PVP"

  useEffect(() => {
    if (!isPlayerTurn && mode === "AI" && !winner) {
      const aiMove = findBestMove(board);
      if (aiMove !== null) {
        const newBoard = [...board];
        newBoard[aiMove] = "O";
        setBoard(newBoard);
        checkWinner(newBoard);
        setIsPlayerTurn(true);
      }
    }
  }, [isPlayerTurn, board, mode, winner]);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isPlayerTurn ? "X" : "O";
    setBoard(newBoard);
    checkWinner(newBoard);
    setIsPlayerTurn(mode === "PVP" ? !isPlayerTurn : false);
  };

  const checkWinner = (newBoard) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        setWinner(newBoard[a]);
        return;
      }
    }
    if (!newBoard.includes(null)) setWinner("Draw");
  };

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="container">
      <h1>Tic Tac Toe</h1>
      <h2>{winner ? (winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`) : `Next Player: ${isPlayerTurn ? "X" : "O"}`}</h2>
      
      <div className="board">
        {board.map((value, index) => (
          <button key={index} className="square" onClick={() => handleClick(index)}>
            {value}
          </button>
        ))}
      </div>

      <div className="controls">
        <button onClick={restartGame} className="restart-btn">Restart Game</button>
        <button onClick={() => setMode(mode === "AI" ? "PVP" : "AI")} className="mode-btn">
          {mode === "AI" ? "Switch to Player vs Player" : "Switch to Player vs AI"}
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;
