import { endpointsAPI, urlAPI } from '@constants/api';
import { store } from '@redux/configure-store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type TrainingList = {
    name: string;
    key: string;
};

export type TariffList = {
    _id: string;
    name: string;
    periods: [
        {
            text: string;
            cost: number;
            days: number;
        },
    ];
};

export const catalogsAPI = createApi({
    reducerPath: 'catalogsAPI',
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
        getTrainingList: build.query<TrainingList[], void>({
            query: () => ({
                url: endpointsAPI.catalogs.training,
            }),
        }),
        getTariffList: build.query<TariffList[], void>({
            query: () => ({
                url: endpointsAPI.catalogs.tariff,
            }),
        }),
    }),
});

export const { useGetTrainingListQuery, useGetTariffListQuery } = catalogsAPI;
