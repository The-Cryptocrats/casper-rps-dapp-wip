import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SocketState {
	room: string;
	sockets: string[];
	rounds: number;
}

const initialState = {
	room: "",
	sockets: [],
	rounds: 1,
} as SocketState;

export const socketSlice = createSlice({
	name: "socket",
	initialState,
	reducers: {
		setRoom: (state, action: PayloadAction<string>) => {
			state.room = action.payload;
		},

		setSockets: (state, action: PayloadAction<string[]>) => {
			state.sockets = [...action.payload];
		},

		setRounds: (state, action: PayloadAction<number>) => {
			state.rounds = action.payload;
		},

		decrementRounds: (state) => {
			state.rounds -= 1;
		},
	},
});

export const { setRoom, setSockets, setRounds, decrementRounds } =
	socketSlice.actions;

export default socketSlice.reducer;
