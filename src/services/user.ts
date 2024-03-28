import { endpointsAPI, urlAPI } from '@constants/api';
import { store } from '@redux/configure-store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type User = {
    email: string;
    firstName: string;
    lastName: string;
    birthday: string;
    imgSrc: string;
    readyForJointTraining: boolean;
    sendNotification: boolean;
    tariff: {
        tariffId: string;
        expired: string;
    };
};

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: urlAPI,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token') || store.getState().tokenReducer.token;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    endpoints: (build) => ({
        getUser: build.query<User, void>({
            query: () => ({
                url: endpointsAPI.user.me,
            }),
        }),
        updateUser: build.mutation({
            query: (body) => ({
                url: endpointsAPI.user.user,
                method: 'PUT',
                body,
            })
        })
    }),
});

export const { useGetUserQuery, useLazyGetUserQuery, useUpdateUserMutation } = userAPI;
