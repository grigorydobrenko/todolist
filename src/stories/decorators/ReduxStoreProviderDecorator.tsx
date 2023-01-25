import React from 'react'
import {Provider} from "react-redux"
import {combineReducers} from 'redux'
import {v1} from 'uuid'
import {AppRootState, RootReducerType} from '../../app/store'
import {tasksReducer} from '../../features/todolists/tasks-reducer'
import {todolistsReducer} from '../../features/todolists/todolists-reducer'
import {TaskPriorities, TaskStatuses} from "../../api/todolist-api"
import {appReducer} from "../../app/app-reducer";
import {authReducer} from "../../features/auth/auth-reducer";
import thunk from "redux-thunk";
import {configureStore} from "@reduxjs/toolkit";
import {HashRouter} from "react-router-dom";


const rootReducer: RootReducerType = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState: AppRootState = {
    todolists: [
        {
            id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: "idle"
        },
        {
            id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: "idle"
        }
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(), title: 'HTML&CSS',
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                entityStatus: 'idle'

            },
            {
                id: v1(), title: 'JS', status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                entityStatus: 'idle'
            }
        ],
        ['todolistId2']: [
            {
                id: v1(), title: 'Milk', status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: '',
                entityStatus: 'idle'
            },
            {
                id: v1(), title: 'React Book', status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: '',
                entityStatus: 'idle'
            }
        ]
    },
    app: {
        status: 'loading',
        error: null,
        isInitialized: false
    },
    auth: {isLoggedIn: false}

}

export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})


export const ReduxStoreProviderDecorator = (storyFn: () => JSX.Element) => {
    return <Provider store={storyBookStore}>
        {storyFn()}
    </Provider>

}
export const HashRouterDecorator = (storyFn: () => JSX.Element) => {
    return <HashRouter>
        {storyFn()}
    </HashRouter>
}