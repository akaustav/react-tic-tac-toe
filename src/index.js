import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
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
          location: null
        }
      ],
      stepNumber: 0,
      next: 'X'
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (
      calculateWinner(squares) === null &&
      squares[i] === null
    ) {
      squares[i] = this.state.next;
      this.setState({
        history: history.concat([{
          squares: squares,
          location: i
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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

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

    let status;
    if (winner) {
      status = `Winner: ` + winner;
    } else {
      status = `Next player: ${this.state.next}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
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

  for(let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      winner = squares[a];
      break;
    }
  }

  return winner;
}
