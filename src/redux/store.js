import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist'
import { configureStore, combineReducers } from '@reduxjs/toolkit'

import userSlice from './User/userSlice';
import certificateSlice from './User/certificateSlice';

const rootReducer = combineReducers({
    user: userSlice,
    certificate: certificateSlice,
})

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})


export const persistor = persistStore(store);