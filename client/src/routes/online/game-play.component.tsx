import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import icons from "../../data";
import { socket } from "./room.component";

import Icon from "../../components/RPS/icon/icon.component";
import Button from "../../components/RPS/button/button.component";

import {
	increment,
	decrement,
	setResultOut,
	setWinnerText,
	setDidWin,
} from "../../redux/score/online-score.slice";
import { setGamePlay } from "../../redux/players/online-players.slice";
import {
	setOpponentPickedMessage,
	setOpponentRestartedMessage,
} from "../../redux/status/opponent-status.slice";

import { GameResultContainer } from "../../styles/game-result.styles";

import {
	GamePlayContainer,
	PlayerContainer,
	PlayerIdentity,
	SecondPlayer,
} from "../../styles/game-play.styles";

import {
	setScore,
	setOpponentScore,
} from "../../redux/score/online-score.slice";

const OnlineGamePlay = (): JSX.Element => {
	const { playerOneActive, playerChoice, opponent } = useAppSelector(
		(state) => state.onlinePlayers,
	);
	const { resultOut, winnerText, didWin } = useAppSelector(
		(state) => state.onlineScorer,
	);

	const dispatch = useAppDispatch();

	const [firstPlayerData] = icons.filter(({ title }) => title === playerChoice);
	const image = firstPlayerData?.image;

	const [secondPlayerData] = icons.filter(({ title }) => title === opponent);
	const opponentImage = secondPlayerData?.image;

	useEffect(() => {
		socket.on("scores", (newScores) => {
			const myScore = playerOneActive ? newScores[0] : newScores[1];
			const opponentScore = playerOneActive ? newScores[1] : newScores[0];

			dispatch(setScore(myScore));
			dispatch(setOpponentScore(opponentScore));
		});

		socket.on("result", (data) => {
			dispatch(setResultOut(true));
			const { winner } = data;
			console.log("WinnerData:", data);

			if (winner === "player1" && playerOneActive) {
				dispatch(setWinnerText("you win"));
				dispatch(increment());
				dispatch(setDidWin(true));
			} else if (winner === "player2" && !playerOneActive) {
				dispatch(setWinnerText("you win"));
				dispatch(increment());
				dispatch(setDidWin(true));
			} else if (winner === "draw") {
				dispatch(setWinnerText("draw"));
			} else {
				dispatch(setWinnerText("you lose"));
				dispatch(decrement());
			}
		});

		dispatch(setOpponentRestartedMessage(""));

		socket.on("restart-message", (message) => {
			dispatch(setOpponentRestartedMessage(message));
		});

		return () => {
			socket.off("scores");
			socket.off("result");
			socket.off("restart-message");
		};
	}, [resultOut, playerOneActive]);
	const startNewGame = () => {
		dispatch(setGamePlay(false));
		dispatch(setDidWin(false));
		dispatch(setResultOut(false));
		socket.emit("restart");
		dispatch(setOpponentPickedMessage(""));
	};

	return (
		<GamePlayContainer>
			<PlayerContainer spaceBetween={resultOut}>
				<Icon
					key={11}
					title={playerChoice}
					image={image}
					won={didWin}
					customSize={true}
				/>

				{!resultOut ? (
					<SecondPlayer className="empty" large={true}></SecondPlayer>
				) : (
					<Icon
						key={22}
						title={opponent}
						image={opponentImage}
						customSize={true}
					/>
				)}
			</PlayerContainer>

			<PlayerIdentity>
				<p>you picked</p>
				<p>an opposer picked</p>
			</PlayerIdentity>

			{resultOut && (
				<GameResultContainer>
					<p>{winnerText}</p>

					<Button
						type={"button"}
						btnStyle={"play again"}
						handler={startNewGame}
					>
						Play Again
					</Button>
				</GameResultContainer>
			)}
		</GamePlayContainer>
	);
};

export default OnlineGamePlay;
