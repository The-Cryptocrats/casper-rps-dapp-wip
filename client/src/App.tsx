import React, { useEffect, useState, lazy, Suspense } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useClickRef, ThemeModeType } from "@make-software/csprclick-ui";
import ClickTopBar from "./components/ClickTopBar";
import { LandingBrief, SignedInBrief } from "./components/GettingStarted";
import Container from "./components/container";
import { AppTheme } from "./theme";
import "./App.scss";
import { Welcome } from "./components/GettingStarted/components";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";

import GameResults from "./routes/online/game-results.component";

const Home = lazy(() => import("./routes/home/home.component"));
const Offline = lazy(() => import("./routes/offline/game-start.component"));
const Online = lazy(() => import("./routes/online/room.component"));
const Spinner = lazy(
	() => import("./components/RPS/spinner/spinner.component"),
);

const GettingStartedContainer = styled.div(({ theme }) =>
	theme.withMedia({
		maxWidth: ["100%", "720px", "960px"],
		padding: "0 12px",
		margin: "0 auto",
	}),
);

const App = () => {
	const clickRef = useClickRef();
	const [themeMode, setThemeMode] = useState<ThemeModeType>(
		ThemeModeType.light,
	);
	const [activeAccount, setActiveAccount] = useState<any>(null);

	useEffect(() => {
		clickRef?.on("csprclick:signed_in", async (evt: any) => {
			setActiveAccount(evt.account);
		});
		clickRef?.on("csprclick:switched_account", async (evt: any) => {
			setActiveAccount(evt.account);
		});
		clickRef?.on("csprclick:signed_out", async (evt: any) => {
			setActiveAccount(null);
		});
		clickRef?.on("csprclick:disconnected", async (evt: any) => {
			setActiveAccount(null);
		});
	}, [clickRef?.on]);

	return (
		<Suspense fallback={<Spinner />}>
			<main className="App">
				<ThemeProvider theme={AppTheme[themeMode]}>
					{/* <Router> */}
					<ClickTopBar
						themeMode={themeMode}
						onThemeSwitch={() =>
							setThemeMode(
								themeMode === ThemeModeType.light
									? ThemeModeType.dark
									: ThemeModeType.light,
							)
						}
					/>
					{!activeAccount ? <Welcome /> : false}
					<Routes>
						<Route
							path="/"
							element={
								!activeAccount ? (
									<Container>
										<GettingStartedContainer id={"getting-started"}>
											<LandingBrief />
										</GettingStartedContainer>
									</Container>
								) : (
									<Navigate to="/game" />
								)
							}
						/>
						<Route
							path="/game"
							element={activeAccount ? <Home /> : <Navigate to="/" />}
						/>
						<Route
							path="/game/online"
							element={activeAccount ? <Online /> : <Navigate to="/" />}
						/>
						<Route
							path="/game/offline"
							element={activeAccount ? <Offline /> : <Navigate to="/" />}
						/>
						<Route path="/game-results" element={<GameResults />} />
					</Routes>
				</ThemeProvider>
			</main>
		</Suspense>
	);
};

export default App;
