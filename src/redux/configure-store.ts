import { createReduxHistoryContext } from 'redux-first-history';
import { combineReducers,configureStore } from '@reduxjs/toolkit';
import { authAPI } from '@services/auth';
import { catalogsAPI } from '@services/catalogs';
import { feedbackAPI } from '@services/feedbacks';
import { tariffAPI } from '@services/tariff';
import { trainingAPI } from '@services/trainings';
import { userAPI } from '@services/user';
import { createBrowserHistory } from 'history';

import { screenSizeReducer } from './reducers/resize-slice';
import {tokenReducer} from './reducers/token-slice';
import {trainingReducer}from './reducers/training-slice';
import { userFullReducer } from './reducers/user-full-slice';
import {userReducer} from './reducers/user-slice';

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
    history: createBrowserHistory(),
});

export const store = configureStore({
    reducer: combineReducers({
        router: routerReducer,
        [authAPI.reducerPath]: authAPI.reducer,
        userReducer,
        [feedbackAPI.reducerPath]: feedbackAPI.reducer,
        tokenReducer,
        [trainingAPI.reducerPath]: trainingAPI.reducer,
        [catalogsAPI.reducerPath]: catalogsAPI.reducer,
        trainingReducer,
        screenSizeReducer,
        [userAPI.reducerPath]: userAPI.reducer,
        userFullReducer,
        [tariffAPI.reducerPath] : tariffAPI.reducer,
    }),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            routerMiddleware,
            authAPI.middleware,
            feedbackAPI.middleware,
            trainingAPI.middleware,
            catalogsAPI.middleware,
            userAPI.middleware,
            tariffAPI.middleware,
        ),
});

export const history = createReduxHistory(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
