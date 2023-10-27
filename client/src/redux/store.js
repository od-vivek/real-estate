import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import userReducer from './user/UserSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Combine your reducers
const rootReducer = combineReducers({
    user: userReducer,
});

// Configure the persistence options
const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};

// Create a persistent reducer
const persistentReducer = persistReducer(persistConfig, rootReducer);

// Create and configure the Redux store
export const store = configureStore({
    reducer: persistentReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: false, // Disable serializable state check
    }),
});

// Create a persistor for controlling state persistence
export const persistor = persistStore(store);
