import { endpointsAPI, urlAPI } from '@constants/api';
import { store } from '@redux/configure-store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Feedbacks } from '@tstypes/feedbacks';

export const feedbackAPI = createApi({
    reducerPath: 'feedbackAPI',
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
    tagTypes: ['Feedback'],
    endpoints: (build) => ({
        getFeedbacks: build.query<Feedbacks[], void>({
            query: () => ({
                url: endpointsAPI.feedback,
            }),
            providesTags: () => ['Feedback'],
        }),
        createReview: build.mutation({
            query: (body) => ({
                url: endpointsAPI.feedback,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Feedback'],
        }),
    }),
});

export const { 
    useLazyGetFeedbacksQuery, 
    useGetFeedbacksQuery, 
    useCreateReviewMutation 
} = feedbackAPI;
