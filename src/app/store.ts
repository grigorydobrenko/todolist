import {TaskActionsType, tasksReducer} from '../features/todolists/tasks-reducer'
import {TodolistActionsType, todolistsReducer} from '../features/todolists/todolists-reducer'
import {AnyAction, combineReducers} from 'redux'
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk"
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

// export const _store = createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store


// type AppActionsType = TodosActionsType


type AppEntitiesActionsType = TaskActionsType | TodolistActionsType

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>
// export type AppDispatch = ThunkDispatch<RootState, unknown, AppActionsType>
// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AppActionsType>


export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AppEntitiesActionsType>
