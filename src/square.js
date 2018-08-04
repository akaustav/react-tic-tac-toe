import React from 'react';

export default function Square(props) {
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
