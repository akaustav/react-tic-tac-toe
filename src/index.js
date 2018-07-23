import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const className = [
    'square',
    props.isWinner ? 'winner' : null
  ].join(' ').trim();

  return (
    <button
      className={className}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winner = this.props.winner;
    let isWinner = false;

    if (winner) {
      isWinner = winner.line.indexOf(i) !== -1;
    }

    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        isWinner={isWinner}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderBoard() {
    const board = [];

    // Outer loop to create Board Row
    for (let r = 0; r < 3; ++r) {
      const boardRow = [];

      // Inner loop to create Square
      for (let c = 0; c < 3; ++c) {
        const n = (3 * r) + c;
        boardRow.push(this.renderSquare(n));
      }

      board.push(
        <div
          key={r}
          className="board-row"
        >
          {boardRow}
        </div>
      );
    }

    return board;
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: [
            null, null, null,
            null, null, null,
            null, null, null
          ],
          location: null,
          winner: null
        }
      ],
      stepNumber: 0,
      next: 'X',
      movesAsc: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let winner = calculateWinner(squares);

    if (
      winner === null &&
      squares[i] === null
    ) {
      squares[i] = this.state.next;
      winner = calculateWinner(squares);

      this.setState({
        history: history.concat([{
          squares: squares,
          location: i,
          winner: winner
        }]),
        stepNumber: history.length,
        next: (this.state.next === 'X') ? 'O' : 'X'
      });
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      next: (step % 2) ? 'O' : 'X'
    });
  }

  reverseMoves() {
    const movesAsc = this.state.movesAsc;
    this.setState({
      movesAsc: !movesAsc
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((step, move) => {
      const loc = step.location;
      const col = loc % 3;
      const row = Math.floor(loc / 3);

      const desc = move ?
        `Go to move # ${move} at (col=${col}, row=${row})` :
        `Go to game start`;

      const selectedMove = (move === this.state.stepNumber) ?
        'active':
        null;

      return (
        <li key={move}>
          <button
            className={selectedMove}
            onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    const direction = this.state.movesAsc;
    if (!direction) {
      moves.reverse();
    }

    let status;
    if (current.winner) {
      status = `Winner: ` + current.winner.player;
    } else if (current.squares.indexOf(null) === -1) {
      status = 'Match Draw!';
    } else {
      status = `Next player: ${this.state.next}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={current.winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            onClick={() => this.reverseMoves()}>
            Reverse Moves
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  let winner = null;

  const lines = [
    // Horizontals
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Verticals
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonals
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      winner = {
        player: squares[a],
        line: lines[i]
      };
      break;
    }
  }

  return winner;
}
