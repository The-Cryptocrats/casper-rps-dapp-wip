import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OnlinePlayersState {
	isPlaying: boolean;
	playerOneActive: boolean;
	playerChoice: string;
	gamePlay: boolean;
	opponent: string;
	betAmount: number;
}

const initialState: OnlinePlayersState = {
	isPlaying: false,
	playerOneActive: false,
	playerChoice: "",
	gamePlay: false,
	opponent: "",
	betAmount: 0,
};

const onlinePlayersSlice = createSlice({
	name: "players",
	initialState,
	reducers: {
		setIsPlaying: (state, action: PayloadAction<boolean>) => {
			state.isPlaying = action.payload;
		},
		setPlayerOneActive: (state, action: PayloadAction<boolean>) => {
			state.playerOneActive = action.payload;
		},
		setPlayerChoice: (state, action: PayloadAction<string>) => {
			state.playerChoice = action.payload;
		},
		setGamePlay: (state, action: PayloadAction<boolean>) => {
			state.gamePlay = action.payload;
		},
		setOpponent: (state, action: PayloadAction<string>) => {
			state.opponent = action.payload;
		},
		setBetAmount: (state, action: PayloadAction<number>) => {
			state.betAmount = action.payload;
		},
	},
});

export const {
	setIsPlaying,
	setPlayerOneActive,
	setPlayerChoice,
	setGamePlay,
	setOpponent,
	setBetAmount,
} = onlinePlayersSlice.actions;

export default onlinePlayersSlice.reducer;
