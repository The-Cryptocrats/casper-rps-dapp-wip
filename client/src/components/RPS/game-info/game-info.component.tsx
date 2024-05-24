import logo from "../../../assets/images/rps/logo-bonus.svg";

import { GameInfoContainer, GameLogo, GameScore } from "./game-info.styles";


import { useAppSelector } from "../../../redux/hooks";

type GameInfoProps = {
	score: number;
	opponentScore: number;
};

const GameInfo = ({ score, opponentScore }: GameInfoProps): JSX.Element => {
	const betAmount = useAppSelector((state) => state.onlinePlayers.betAmount);

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
			</GameScore>
		</GameInfoContainer>
	);
};

export default GameInfo;
