import { RootState } from '@redux/configure-store';
import { createSlice,PayloadAction } from '@reduxjs/toolkit';

type ScreenSizeState = {
    screenSize: number;
}

const initialState: ScreenSizeState = {
    screenSize: 0,
};

export const screenSizeSlice = createSlice({
    name: 'screenSize',
    initialState,
    reducers: {
        saveSceenSize: (state, action: PayloadAction<number>) => {
            state.screenSize = action.payload;
        },
    },
});

export const { saveSceenSize } = screenSizeSlice.actions;
export const screenSizeSelector = (state: RootState) => state.screenSizeReducer;

export const screenSizeReducer = screenSizeSlice.reducer;