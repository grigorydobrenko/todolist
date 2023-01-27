import {tasksReducer} from '../features/todolists/tasks-reducer'
import {todolistsReducer} from '../features/todolists/todolists-reducer'
import {combineReducers} from 'redux'
import thunk from "redux-thunk"
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/auth/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";
import {FieldError} from "../api/types";


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

export type RootReducerType = typeof rootReducer

export type AppRootState = ReturnType<RootReducerType>
export type AppDispatch = typeof store.dispatch

// @ts-ignore
window.store = store

export type ThunkError = { rejectValue: { errors: string[], fieldsErrors?: FieldError[] } }


