import { Outlet } from "react-router-dom";

import Button from "../../components/RPS/button/button.component";

import {
	ChoiceContainer,
	PlayOnlineLink,
	PlayOfflineLink,
} from "./home.styles";

const Home = (): JSX.Element => {
	return (
		<ChoiceContainer>
			<PlayOnlineLink to="/game/online">
				<Button type="button" btnStyle="play online">
					play online
				</Button>
			</PlayOnlineLink>

			<PlayOfflineLink to="/game/offline">
				<Button type="button" btnStyle="play with computer">
					play with computer
				</Button>
			</PlayOfflineLink>

			<Outlet />
		</ChoiceContainer>
	);
};

export default Home;
