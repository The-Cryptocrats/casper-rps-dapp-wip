const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

let choices = { p1Choice: null, p2Choice: null };
let betAmounts = {};
let scores = {};

io.on("connection", (socket) => {
	socket.on("join-room", ({ room, betAmount = 0 }) => {
		socket.join(room);

		if (!betAmounts[room]) {
			betAmounts[room] = [];
			scores[room] = [0, 0];
		}

		if (betAmounts[room].length < 2 && (betAmounts[room].length === 0 || betAmounts[room][0] === betAmount)) {
			betAmounts[room].push(betAmount);
		} else {
			io.to(socket.id).emit("bet-mismatch", `The bet amount for room ${room} is ${betAmounts[room][0]}. Please join with the same bet amount.`);
			socket.leave(room);
			return;
		}

		if (betAmounts[room].length > 2) {
			io.to(socket.id).emit(
				"full",
				`Sorry! two players are already in this room. game is on`,
			);
			socket.leave(room);
		}

		const roomSockets = io.sockets.adapter.rooms.get(room);
		const users = roomSockets ? [...roomSockets.keys()] : [];

		io.to(room).emit("updated-users", users);
		io.to(room).emit("scores", scores[room]);

		socket.on("game-play", () => {
			socket.broadcast.to(room).emit("status", "Opponent picked! Your turn.");
		});

		socket.on("restart", () => {
			socket.broadcast
				.to(room)
				.emit("restart-message", "Opponent wants to play again");
		});

		socket.on("disconnect", () => {
			socket.broadcast.to(room).emit("disconnected", "Opponent left the game");
		});

		socket.on("forfeit", () => {
			socket.broadcast
				.to(room)
				.emit(
					"opponent-forfeited",
					`Opponent forfeited the game. You win ${betAmounts[room].reduce(
						(a, b) => a + b,
						0,
					)} units.`,
				);
			betAmounts[room] = [];
		});

		socket.on("p1Choice", (data) => {
			const { choice, room } = data;
			choices["p1Choice"] = choice;
			io.to(room).emit("p1Choice", { choice });
			choices.p2Choice !== null && declareWinner(room);
		});

		socket.on("p2Choice", (data) => {
			const { choice, room } = data;
			choices["p2Choice"] = choice;
			io.to(room).emit("p2Choice", { choice });
			choices.p1Choice !== null && declareWinner(room);
		});
	});
});

const declareWinner = (room) => {
	const player1 = choices["p1Choice"];
	const player2 = choices["p2Choice"];
	let winner = "";

	if (player1 === "scissors") {
		if (player2 === "scissors") winner = "draw";
		else if (player2 === "paper" || player2 === "lizard") {
			winner = "player1";
			scores[room][0]++;
		} else {
			winner = "player2";
			scores[room][1]++;
		}
	} else if (player1 === "paper") {
		if (player2 === "paper") winner = "draw";
		else if (player2 === "rock" || player2 === "spock") {
			winner = "player1";
			scores[room][0]++;
		} else {
			winner = "player2";
			scores[room][1]++;
		}
	} else if (player1 === "rock") {
		if (player2 === "rock") winner = "draw";
		else if (player2 === "lizard" || player2 === "scissors") {
			winner = "player1";
			scores[room][0]++;
		} else {
			winner = "player2";
			scores[room][1]++;
		}
	} else if (player1 === "lizard") {
		if (player2 === "lizard") winner = "draw";
		else if (player2 === "spock" || player2 === "paper") {
			winner = "player1";
			scores[room][0]++;
		} else {
			winner = "player2";
			scores[room][1]++;
		}
	} else if (player1 === "spock") {
		if (player2 === "spock") winner = "draw";
		else if (player2 === "scissors" || player2 === "rock") {
			winner = "player1";
			scores[room][0]++;
		} else {
			winner = "player2";
			scores[room][1]++;
		}
	} else winner = "draw";

	io.to(room).emit("result", { winner: winner });
	io.to(room).emit("scores", scores[room]); // Emit updated scores to the room

	choices = { p1Choice: null, p2Choice: null };
	betAmounts[room] = [];
};

server.listen(4000, () => {
	console.log(`Server running on Port 4000`);
});
