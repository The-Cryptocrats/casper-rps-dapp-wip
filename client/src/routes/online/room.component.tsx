// import { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../redux/hooks";

// import { io } from "socket.io-client";

// import OnlineGameStart from "./game-start.component";
// import Button from "../../components/RPS/button/button.component";

// import { setSockets, setRoom } from "../../redux/socket/socket.slice";
// import {
// 	setPlayerOneActive,
// 	setIsPlaying,
// } from "../../redux/players/online-players.slice";

// import { FormInput, RoomContainer } from "./room.styles";

// export const socket = io(
// 	process.env.NODE_ENV === "production"
// 		? `${process.env.REACT_APP_SERVER_URL}`
// 		: "http://localhost:4000",
// );

// const Room = (): JSX.Element => {
// 	const { room, sockets } = useAppSelector((state) => state.socket);
// 	const { isPlaying } = useAppSelector((state) => state.onlinePlayers);

// 	const [successMessage, setSuccessMessage] = useState("");
// 	const [createdRoom, setCreatedRoom] = useState(false);

// 	const dispatch = useAppDispatch();

// 	useEffect(() => {
// 		socket.on("connect", () => {
// 			console.log("You connected to ", socket.id);
// 		});

// 		socket.on("updated-users", (users) => {
// 			console.log(users);
// 			dispatch(setSockets(users));
// 		});

// 		socket.on("full", (message) => {
// 			setSuccessMessage(message);
// 		});

// 		sockets.length === 2 && dispatch(setIsPlaying(true));

// 		return () => {
// 			socket.off("connect");
// 			socket.off("updated-users");
// 			socket.off("start");
// 		};
// 	}, [sockets]);

// 	const handleChangeRoom = (e: any) => {
// 		dispatch(setRoom(e.target.value.trim()));
// 	};

// 	const handleCreateRoom = (e: any) => {
// 		e.preventDefault();
// 		dispatch(setPlayerOneActive(true));
// 		room &&
// 			socket.emit("join-room", room) &&
// 			setSuccessMessage(`You created room ${room} & joined`);
// 		setCreatedRoom(true);
// 	};

// 	const handleJoinRoom = (e: any) => {
// 		e.preventDefault();
// 		room && socket.emit("join-room", room);
// 	};

// 	return (
// 		<>
// 			{isPlaying ? (
// 				<OnlineGameStart />
// 			) : (
// 				<RoomContainer>
// 					<form onSubmit={handleCreateRoom}>
// 						<FormInput
// 							type="text"
// 							onChange={handleChangeRoom}
// 							aria-label="join-room"
// 							placeholder="type room code"
// 						/>
// 						<br />
// 						<Button type="submit" btnStyle="primary">
// 							Create Room
// 						</Button>
// 					</form>

// 					{!createdRoom && (
// 						<form onSubmit={handleJoinRoom}>
// 							<FormInput
// 								type="text"
// 								onChange={handleChangeRoom}
// 								aria-label="join-room"
// 								placeholder="type room code"
// 							/>
// 							<br />
// 							<Button type="submit" btnStyle="primary">
// 								Join Room
// 							</Button>
// 						</form>
// 					)}

// 					{<p>{successMessage}</p>}
// 					{successMessage && !successMessage.includes("two players") && (
// 						<p>Wait for an opponent to join</p>
// 					)}
// 				</RoomContainer>
// 			)}
// 		</>
// 	);
// };

// export default Room;

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { io } from "socket.io-client";
import OnlineGameStart from "./game-start.component";
import Button from "../../components/RPS/button/button.component";
import { setSockets, setRoom } from "../../redux/socket/socket.slice";
import {
	setPlayerOneActive,
	setIsPlaying,
	setBetAmount as setReduxBetAmount,
} from "../../redux/players/online-players.slice";
import { FormInput, RoomContainer } from "./room.styles";

export const socket = io(
	process.env.NODE_ENV === "production"
		? `${process.env.REACT_APP_SERVER_URL}`
		: "http://localhost:4000",
);

const Room = (): JSX.Element => {
	const { room, sockets } = useAppSelector((state) => state.socket);
	const { isPlaying } = useAppSelector((state) => state.onlinePlayers);
	const [successMessage, setSuccessMessage] = useState("");
	const [createdRoom, setCreatedRoom] = useState(false);
	const [joinRoom, setJoinRoom] = useState(false);
	const [betAmount, setBetAmount] = useState(0.0001);

	const dispatch = useAppDispatch();

	useEffect(() => {
		socket.on("connect", () => {
			console.log("You connected to ", socket.id);
		});

		socket.on("updated-users", (users) => {
			console.log(users);
			dispatch(setSockets(users));
		});

		socket.on("full", (message) => {
			setSuccessMessage(message);
		});

		sockets.length === 2 && dispatch(setIsPlaying(true));

		return () => {
			socket.off("connect");
			socket.off("updated-users");
			socket.off("start");
		};
	}, [sockets]);

	const handleChangeRoom = (e: any) => {
		dispatch(setRoom(e.target.value.trim()));
	};

	const handleBetAmountChange = (e: any) => {
		const value = Number(e.target.value);
		if (value >= 0.0001) {
			setBetAmount(value);
		}
	};

	const handleCreateRoom = (e: any) => {
		e.preventDefault();
		dispatch(setPlayerOneActive(true));
		dispatch(setReduxBetAmount(betAmount));
		room &&
			socket.emit("join-room", { room, betAmount }) &&
			setSuccessMessage(
				`You created room ${room} with a bet of ${betAmount} & joined`,
			);
		setCreatedRoom(true);
	};

	const handleJoinRoom = (e: any) => {
		e.preventDefault();
		dispatch(setReduxBetAmount(betAmount));
		room && socket.emit("join-room", { room });
	};

	return (
		<>
			{isPlaying ? (
				<OnlineGameStart />
			) : (
				<RoomContainer>
					{!createdRoom && !joinRoom ? (
						<>
							<Button
								type="button"
								btnStyle="primary"
								handler={() => setCreatedRoom(true)}
							>
								Create Room
							</Button>
							<Button
								type="button"
								btnStyle="primary"
								handler={() => setJoinRoom(true)}
							>
								Join Room
							</Button>
						</>
					) : createdRoom ? (
						<form onSubmit={handleCreateRoom}>
							<FormInput
								title="Enter Room Code"
								type="text"
								onChange={handleChangeRoom}
								aria-label="create-room"
								placeholder="Enter room code"
							/>
							<FormInput
								title="Bet Amount"
								type="number"
								value={betAmount}
								onChange={handleBetAmountChange}
								step={0.0001}
								min={0.0001}
								aria-label="bet-amount"
								placeholder="Enter bet amount"
							/>
							<br />
							<Button type="submit" btnStyle="primary">
								Create Room
							</Button>
						</form>
					) : (
						<form onSubmit={handleJoinRoom}>
							<FormInput
								type="text"
								onChange={handleChangeRoom}
								aria-label="join-room"
								placeholder="Type room code"
							/>
							<br />
							<Button type="submit" btnStyle="primary">
								Join Room
							</Button>
						</form>
					)}
					{<p>{successMessage}</p>}
					{successMessage && !successMessage.includes("two players") && (
						<p>Wait for an opponent to join</p>
					)}
				</RoomContainer>
			)}
		</>
	);
};

export default Room;
