import React from 'react';
import Square from './square';

export default class Board extends React.Component {
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
