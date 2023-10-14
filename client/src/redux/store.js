import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/UserSlice';
import { persistReducer, persistStore } from 'redux-persist'; // Import named exports from redux-persist
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({ user: userReducer });

const persistConfig = { key: 'root', storage, version: 1 };

const persistentReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistentReducer,
    middleware: (getDefaultMiddleware) => {
        // Add your middleware here, if needed
        return getDefaultMiddleware({
            serializableCheck: false,
        });
    },
});

export const persistor = persistStore(store);
