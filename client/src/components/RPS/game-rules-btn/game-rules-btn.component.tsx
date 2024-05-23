import { MouseEventHandler } from "react";

import Button from "../button/button.component";

import { ButtonContainer } from "./game-rules-btn.styles";

type GameRulesBtnProps = {
	openHandler: MouseEventHandler<HTMLButtonElement>;
};

const GameRulesBtn = ({ openHandler }: GameRulesBtnProps) => {
	return (
		<ButtonContainer>
			<Button type="button" handler={openHandler} btnStyle={"secondary"}>
				rules
			</Button>
		</ButtonContainer>
	);
};

export default GameRulesBtn;
