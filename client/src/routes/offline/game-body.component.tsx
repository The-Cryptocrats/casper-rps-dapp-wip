import { useAppSelector, useAppDispatch } from "../../redux/hooks";

import icons from "../../data";

import GamePlay from "./game-play.component";
import Icon from "../../components/RPS/icon/icon.component";

import { GameBodyContainer } from "../../styles/game-body.styles";

import {
	setFirstPlayerChose,
	setFirstPlayerTitle,
	setCompChose,
	setIsNewGameStart,
} from "../../redux/players/players.slice";

const GameBody = (): JSX.Element => {
	const { firstPlayerChose, isNewGameStart } = useAppSelector(
		(state) => state.players,
	);
	const dispatch = useAppDispatch();

	const iconClickHandler = (e: any) => {
		dispatch(setFirstPlayerChose(true));
		dispatch(setFirstPlayerTitle(e.target.closest("#icon-wrapper").value));
		dispatch(setIsNewGameStart(!isNewGameStart));
		dispatch(setCompChose(false));
	};

	return firstPlayerChose && isNewGameStart ? (
		<GamePlay />
	) : (
		<GameBodyContainer>
			{icons.map(({ id, title, image }) => (
				<Icon
					key={id}
					iconId={id}
					title={title}
					image={image}
					handler={iconClickHandler}
				/>
			))}
		</GameBodyContainer>
	);
};

export default GameBody;
