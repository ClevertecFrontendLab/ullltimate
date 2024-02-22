import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IValuesSignupForm } from "@tstypes/types";

interface UserState {
    user: {
        email: string,
        password: string
    }
}

const initialState: UserState = {
    user: {
        email: "",
        password: "",
    },
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        increment: (state, action: PayloadAction<IValuesSignupForm>) => {
            state.user = action.payload
        }
    },
})

export const { increment } = userSlice.actions

export default userSlice.reducer;