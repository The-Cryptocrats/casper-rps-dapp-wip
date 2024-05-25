import logo from "../../../assets/images/rps/logo-bonus.svg";

import { GameInfoContainer, GameLogo, GameScore } from "./game-info.styles";

import { useAppSelector } from "../../../redux/hooks";

type GameInfoProps = {
	score: number;
	opponentScore: number;
};

const GameInfo = ({ score, opponentScore }: GameInfoProps): JSX.Element => {
	const betAmount = useAppSelector((state) => state.onlinePlayers.betAmount);
	const rounds = useAppSelector((state) => state.socket.rounds); // Get rounds from Redux

	return (
		<GameInfoContainer>
			<GameLogo to="#">
				<img src={logo} alt="" />
			</GameLogo>

			<GameScore>
				<div>
					<span>Your Score</span>
					<span>{score}</span>
				</div>
				<div>
					<span>Opponent Score</span>
					<span>{opponentScore}</span>
				</div>
				<div>
					<span>Bet</span>
					<span>{betAmount}</span>
				</div>
				<div>
					<span>Rounds Left</span>
					<span>{rounds}</span>
				</div>
			</GameScore>
		</GameInfoContainer>
	);
};

export default GameInfo;
