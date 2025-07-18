import React, { useState, useEffect } from 'react';
import './App.css';

/*
  Colors:
    Primary: #1976d2 (blue)
    Accent:  #fbc02d (yellow)
    Secondary: #ffffff (white)
    Theme: light, minimalistic
  Layout:
    - Player info above board
    - Board centered
    - Status message below board
*/

// Inline styles for quick color referencing
const COLORS = {
  primary: '#1976d2',
  accent: '#fbc02d',
  secondary: '#ffffff',
  boardBorder: '#e3e7ed',
  cellBorder: '#dae8f5'
};

// PUBLIC_INTERFACE
function App() {
  // There are 9 squares on the board, which can be 'X', 'O', or null
  const [board, setBoard] = useState(Array(9).fill(null));
  // true if X is next, false if O is next
  const [xIsNext, setXIsNext] = useState(true);
  // null|0|1|2...8 index of the last move for highlighting
  const [lastMove, setLastMove] = useState(null);
  // Winner info: {winner: 'X'|'O', line: [a,b,c]} or null
  const [winnerInfo, setWinnerInfo] = useState(null);
  // true if game ended in a draw
  const [isDraw, setIsDraw] = useState(false);

  // Calculate winner/draw whenever board changes
  useEffect(() => {
    const info = calculateWinner(board);
    setWinnerInfo(info);
    if (!info && board.every(Boolean)) setIsDraw(true);
    else setIsDraw(false);
  }, [board]);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || winnerInfo) return; // Ignore if not empty or if game ended
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
    setLastMove(idx);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinnerInfo(null);
    setIsDraw(false);
    setLastMove(null);
  }

  const currentPlayer = xIsNext ? 'X' : 'O';

  // PUBLIC_INTERFACE
  function statusMessage() {
    if (winnerInfo) {
      return (
        <span>
          <span style={{color: winnerInfo.winner==='X' ? COLORS.primary : COLORS.accent, fontWeight: 600}}>
            Player {winnerInfo.winner}
          </span>{' '}
          wins!
        </span>
      );
    }
    if (isDraw) {
      return <span style={{color: COLORS.primary, fontWeight: 600}}>It's a draw!</span>;
    }
    return (
      <span>
        <span style={{color: currentPlayer==='X' ? COLORS.primary : COLORS.accent, fontWeight: 600}}>
          Player {currentPlayer}
        </span>
        {"'s turn"}
      </span>
    );
  }

  // Returns 'X', 'O', or null for each cell
  function renderSquare(idx) {
    const isWinning =
      winnerInfo && winnerInfo.line.includes(idx);
    const isLast = idx === lastMove;
    let bg = COLORS.secondary;
    let color = COLORS.primary;
    if (board[idx] === 'O') color = COLORS.accent;
    if (isWinning) bg = '#e5f4fd';
    else if (isLast) bg = '#FFF9E3';

    return (
      <button
        key={idx}
        className="ttt-square"
        style={{
          background: bg,
          color,
          borderColor: COLORS.cellBorder,
          fontWeight: isWinning ? 700 : 500,
          outline: isLast ? `2px solid ${COLORS.accent}` : undefined,
          transition: 'background 0.2s, color 0.2s, outline 0.2s'
        }}
        onClick={() => handleClick(idx)}
        aria-label={`Cell ${idx+1}${board[idx] ? ' (occupied by '+board[idx]+')' : ''}`}
        disabled={Boolean(winnerInfo) || Boolean(board[idx])}
      >
        {board[idx]}
      </button>
    );
  }

  return (
    <main
      className="tic-tac-toe-app"
      style={{
        minHeight: '100vh',
        background: COLORS.secondary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <section style={{marginBottom: 28, textAlign: 'center'}}>
        <div className="players-row" style={{display:'flex', gap: 40, justifyContent:'center'}}>
          <div>
            <span style={{color: COLORS.primary, fontWeight:600, fontSize: 18}}>Player X</span>
            { !winnerInfo && currentPlayer==='X' && (
              <span style={{
                marginLeft: 8, color: COLORS.primary, background: '#e3f1fa', borderRadius: 6,
                fontWeight: 500, fontSize: 13, padding: '2px 8px'
              }}>Your turn</span>
            )}
          </div>
          <div>
            <span style={{color: COLORS.accent, fontWeight:600, fontSize: 18}}>Player O</span>
            { !winnerInfo && currentPlayer==='O' && (
              <span style={{
                marginLeft: 8, color: COLORS.accent, background: '#fff3ce', borderRadius: 6,
                fontWeight: 500, fontSize: 13, padding: '2px 8px'
              }}>Your turn</span>
            )}
          </div>
        </div>
      </section>
      <section>
        <div
          className="ttt-board"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 64px)',
            gridTemplateRows: 'repeat(3, 64px)',
            gap: 0,
            border: `2px solid ${COLORS.boardBorder}`,
            borderRadius: 14,
            boxShadow: `0 2px 16px rgba(25, 118, 210, 0.05)`,
            background: COLORS.secondary,
            marginBottom: 22
          }}
        >
          {Array.from({length: 9}).map((_, idx) => renderSquare(idx))}
        </div>
      </section>
      <section style={{marginTop: 8, minHeight: 34, fontSize: 19, textAlign:'center'}}>
        {statusMessage()}
      </section>
      <section style={{marginTop: 20}}>
        <button
          className="ttt-reset-btn"
          onClick={handleReset}
          style={{
            background: COLORS.primary,
            color: COLORS.secondary,
            border: 'none',
            borderRadius: 8,
            padding: '9px 32px',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: `0 2px 8px rgba(25, 118, 210, 0.05)`,
            opacity: 0.92,
            letterSpacing: '0.5px',
            marginRight: 8,
            transition: 'background 0.15s, opacity 0.2s',
            outline: 'none'
          }}
          aria-label="Reset game"
        >
          Reset
        </button>
      </section>
    </main>
  );
}

// PUBLIC_INTERFACE
function calculateWinner(squares) {
  // Returns: {winner: 'X'|'O', line: [i1,i2,i3]} or null
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], line};
    }
  }
  return null;
}

export default App;
