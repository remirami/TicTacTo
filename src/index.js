import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  let className = "square";
  if (props.isWinningSquare) {
    className += " winning-square";
  }

  return (
    <button className={className} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}
class Board extends React.Component {
  renderSquare(i) {
    let isWinningSquare = false;

    if (this.props.winningSquares) {
      isWinningSquare = this.props.winningSquares.includes(i);
    }
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinningSquare={isWinningSquare}
      />
    );
  }
  render() {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(i * 3 + j));
      }
      rows.push(<div className="board-row">{squares}</div>);
    }
    return <div>{rows}</div>;
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      sortOrder: "ascending",
    };
  }

  handleSortToggle() {
    this.setState((prevState) => ({
      sortOrder:
        prevState.sortOrder === "ascending" ? "descending" : "ascending",
    }));
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    let winner;
    if (!squares.includes(null)) {
      winner = "Draw";
    } else {
      // eslint-disable-next-line no-unused-vars
      winner = calculateWinner(squares);
    }

    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winningSquares: calculateWinner(squares),
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button className="buttons" onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner === "Draw") {
      status = "Draw";
    } else if (winner) {
      status = "Winner: " + (this.state.xIsNext ? "O" : "X");
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    if (this.state.sortOrder === "descending") {
      moves = moves.reverse();
    }
    let winningSquares = winner ? calculateWinner(current.squares) : null;
    if (winner) {
      winningSquares = calculateWinner(current.squares);
    }
    return (
      <div className="center-div">
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              winningSquares={winningSquares}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            <button
              className="buttonToggle"
              onClick={() => this.handleSortToggle()}
            >
              Toggle Sort Order
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  if (!squares.includes(null)) return "Draw";

  return null;
}
