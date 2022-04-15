import io from "socket.io-client";

const LOCALHOST_SERVER = "http://localhost:3000";
const socket = io(LOCALHOST_SERVER, {
  reconnection: false,
});

const infoElem = document.getElementById("info");
const resetElem = document.getElementById("reset");
let homesymbol = "";
let guestsymbol = "";
let isTurnActive = false;

// Handling received websocket messages

socket.on("connect", () => {
  infoElem.innerHTML = "Waiting for another player";
  clearBoard();
});

socket.on("start", (data) => {
  clearBoard();
  homesymbol = data;
  homesymbol === "X" ? (guestsymbol = "O") : (guestsymbol = "X");

  infoElem.innerHTML = "game starting, you are " + homesymbol + ", X starts";
  resetElem.disabled = false;
  if (data === "X") isTurnActive = true;
});

socket.on("click", (data) => {
  let square = document.getElementById(data);
  square.value = guestsymbol;
  isTurnActive = true;
});

socket.on("win", (data) => {
  infoElem.innerHTML = "You won!";
  isTurnActive = false;
});

socket.on("lose", (data) => {
  infoElem.innerHTML = "You lost!";
  isTurnActive = false;
});

socket.on("tie", (data) => {
  infoElem.innerHTML = "It's a tie!";
  isTurnActive = false;
});

socket.on("disconnected", (data) => {
  infoElem.innerHTML = "Other player disconnect, find a new game";
  isTurnActive = false;
});

// Defining functions

window.clicked = function clicked(id) {
  let square = document.getElementById(id);
  if (!isTurnActive || square.value) return;
  socket.emit("click", id);
  square.value = homesymbol;
  isTurnActive = false;
};

window.resetGame = function resetGame() {
  socket.emit("reset");
};

window.newGame = function newGame() {
  socket.disconnect();
  socket.connect();
  resetElem.disabled = true;
};

function clearBoard() {
  const board = document.getElementsByClassName("box");
  Array.from(board).forEach((square) => {
    square.value = "";
  });
}
