import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import GameInfo from "../../components/RPS/game-info/game-info.component";
import OnlineGameBody from "./game-body.component";
import GameRulesImage from "../../components/RPS/game-rules/game-rules.component";
import GameRulesBtn from "../../components/RPS/game-rules-btn/game-rules-btn.component";

import { setShowRules } from "../../redux/rules/rules.slice";
import { setRounds, decrementRounds } from "../../redux/socket/socket.slice"; // Import setRounds action
import { socket } from "./room.component";

import GameStatus from "./game-status.component";

const OnlineGameStart = (): JSX.Element => {
	const { score, opponentScore } = useAppSelector(
		(state) => state.onlineScorer,
	);
	const dispatch = useAppDispatch();

	useEffect(() => {
		socket.on("rounds-update", (newRounds: number) => {
			dispatch(setRounds(newRounds));
		});
		socket.on("restart", () => {
			dispatch(decrementRounds());
		});

		return () => {
			socket.off("rounds-update");
			socket.off("restart");
		};
	}, [dispatch]);

	const { showRules } = useAppSelector((state) => state.rules);

	const rulesHandler = () => dispatch(setShowRules(!showRules));

	const navigate = useNavigate();
	const [gameResults, setGameResults] = useState(null);

	useEffect(() => {
		socket.on("game-over", (results) => {
			setGameResults(results);
			navigate("/game-results", { state: results });
		});

		return () => {
			socket.off("game-over");
		};
	}, [navigate]);

	return (
		<div className="Game Game__Container">
			<GameInfo score={score} opponentScore={opponentScore} />
			<OnlineGameBody />
			<GameStatus />
			{showRules ? (
				<GameRulesImage closeHandler={rulesHandler} />
			) : (
				<GameRulesBtn openHandler={rulesHandler} />
			)}
		</div>
	);
};

export default OnlineGameStart;
