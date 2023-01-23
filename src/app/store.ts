import {tasksReducer} from '../features/todolists/tasks-reducer'
import {todolistsReducer} from '../features/todolists/todolists-reducer'
import {AnyAction, combineReducers} from 'redux'
import thunk, {ThunkDispatch} from "redux-thunk"
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .prepend(thunk)

})

// @ts-ignore
window.store = store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>


