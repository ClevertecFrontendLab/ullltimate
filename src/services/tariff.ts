import { endpointsAPI, urlAPI } from '@constants/api';
import { store } from '@redux/configure-store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const tariffAPI = createApi({
    reducerPath: 'tariffAPI',
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
        buyTariff: build.mutation({
            query: (body) => ({
                url: endpointsAPI.tariff,
                method: 'POST',
                body,
            })
        })
    }),
});

export const { useBuyTariffMutation } = tariffAPI;