import { RootState } from '@redux/configure-store';
import { createSlice,PayloadAction } from '@reduxjs/toolkit';

type TokenState = {
    token: string;
}

const initialState: TokenState = {
    token: '',
};

export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        saveToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
    },
});

export const { saveToken } = tokenSlice.actions;
export const tokenSelector = (state: RootState) => state.tokenReducer;

export const tokenReducer = tokenSlice.reducer;
