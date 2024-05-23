import logo from "../../../assets/images/rps/logo-bonus.svg";

import { GameInfoContainer, GameLogo, GameScore } from "./game-info.styles";

type GameInfoProps = {
	score: number;
	opponentScore: number; // Add opponentScore prop
};

const GameInfo = ({ score, opponentScore }: GameInfoProps): JSX.Element => {
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
					<span>{opponentScore}</span> {/* Display opponentScore */}
				</div>
			</GameScore>
		</GameInfoContainer>
	);
};

export default GameInfo;
