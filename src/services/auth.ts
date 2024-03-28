import { endpointsAPI, urlAPI } from '@constants/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
    RequestChangePass,
    RequestCheck,
    RequestConfirm, 
    RequestLogin, 
    ResponseChangePass,
    ResponseCheck, 
    ResponseLogin } from '@tstypes/api';

export const authAPI = createApi({
    reducerPath: 'authAPI',
    baseQuery: fetchBaseQuery({ baseUrl: urlAPI }),
    endpoints: (build) => ({
        login: build.mutation<ResponseLogin, RequestLogin>({
            query: (body) => ({
                url: endpointsAPI.auth.logIn,
                method: 'POST',
                body,
            }),
        }),
        signup: build.mutation<object, RequestLogin>({
            query: (body) => ({
                url: endpointsAPI.auth.signUp,
                method: 'POST',
                body,
            }),
        }),
        checkEmail: build.mutation<ResponseCheck, RequestCheck>({
            query: (email) => ({
                url: endpointsAPI.auth.checkEmail,
                method: 'POST',
                body: email,
            }),
        }),
        confirmEmail: build.mutation<ResponseCheck, RequestConfirm>({
            query: (body) => ({
                url: endpointsAPI.auth.confirmEmail,
                method: 'POST',
                body,
                credentials: 'include',
            }),
        }),
        changePassord: build.mutation<ResponseChangePass, RequestChangePass>({
            query: (body) => ({
                url: endpointsAPI.auth.changePassword,
                method: 'POST',
                body,
                credentials: 'include',
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useCheckEmailMutation,
    useConfirmEmailMutation,
    useChangePassordMutation,
} = authAPI;
