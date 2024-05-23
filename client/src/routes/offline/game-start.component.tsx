import GameInfo from "../../components/RPS/game-info/game-info.component";
import GameBody from "./game-body.component";
import GameRulesImage from "../../components/RPS/game-rules/game-rules.component";
import GameRulesBtn from "../../components/RPS/game-rules-btn/game-rules-btn.component";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setShowRules } from "../../redux/rules/rules.slice";

const OfflineGameStart = (): JSX.Element => {
	const { score } = useAppSelector((state) => state.scorer);
	const { showRules } = useAppSelector((state) => state.rules);
	const dispatch = useAppDispatch();

	const rulesHandler = () => dispatch(setShowRules(!showRules));

	return (
		<div className="Game Game__Container">
			<GameInfo score={score} opponentScore={0} />{" "}
			{/* Pass opponentScore as 0 */}
			<GameBody />
			{showRules ? (
				<GameRulesImage closeHandler={rulesHandler} />
			) : (
				<GameRulesBtn openHandler={rulesHandler} />
			)}
		</div>
	);
};

export default OfflineGameStart;
