import { RootState } from '@redux/configure-store';
import { createSlice,PayloadAction } from '@reduxjs/toolkit';

export type Tariff = {
    tariffId: string;
    expired: string;
}

export type UserFull = {
    email: string;
    firstName?: string;
    lastName?: string;
    birthday?: string | Date;
    imgSrc?: string;
    readyForJointTraining?: boolean;
    sendNotification?: boolean;
    tariff?: Tariff;
}

const initialState: UserFull = {
    email: '',
    firstName: '',
    lastName: '',
    birthday: '',
    imgSrc: '',
    readyForJointTraining: false,
    sendNotification: false,
    tariff: {
        tariffId: '',
        expired: '',
    }
};

export const userFullSlice = createSlice({
    name: 'userFull',
    initialState,
    reducers: {
        saveEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        saveFirstName: (state, action: PayloadAction<string>) => {
            state.firstName = action.payload;
        },
        saveLastName: (state, action: PayloadAction<string>) => {
            state.lastName = action.payload;
        },
        saveBirthday: (state, action: PayloadAction<string>) => {
            state.birthday = action.payload;
        },
        saveImage: (state, action: PayloadAction<string>) => {
            state.imgSrc = action.payload;
        },
        saveJoinTrainings: (state, action: PayloadAction<boolean>) => {
            state.readyForJointTraining = action.payload;
        },
        savesendNotification: (state, action: PayloadAction<boolean>) => {
            state.sendNotification = action.payload;
        },
        saveTariff: (state, action: PayloadAction<Tariff>) => {
            state.tariff = action.payload;
        },
        resetUser: () => initialState,
    },
});

export const { saveEmail, saveFirstName, saveLastName, saveBirthday, saveImage, saveJoinTrainings, savesendNotification, saveTariff, resetUser } = userFullSlice.actions;
export const userFullSelector = (state: RootState) => state.userFullReducer

export const userFullReducer = userFullSlice.reducer;
