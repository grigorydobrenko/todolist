import {ResultCode, todolistAPI, TodolistType} from "../../api/todolist-api"
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import axios, {AxiosError} from "axios";
import {handleServerAppError, handleServerNetWorkError} from "../../utils/error-utils";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodoListDomainType> = []

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) {
                state.splice(index, 1)
            }
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ id: string, newTitle: string }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) {
                state[index].title = action.payload.newTitle
            }
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterType }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) {
                state[index].filter = action.payload.filter
            }
        },
        setTodolistsAC(state, action: PayloadAction<{ todos: TodolistType[] }>) {
            return action.payload.todos.map(todo => ({...todo, filter: 'all', entityStatus: 'idle'}))
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) {
                state[index].entityStatus = action.payload.status
            }
        },
    }
})

export const todolistsReducer = slice.reducer

export const {
    addTodolistAC,
    removeTodolistAC,
    changeTodolistTitleAC,
    changeTodolistFilterAC,
    setTodolistsAC,
    changeTodolistEntityStatusAC
} = slice.actions


export const getTodoTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.getTodolists()
        dispatch(setTodolistsAC({todos: res.data}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
    } catch (e) {

        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
            dispatch(setAppStatusAC({status: 'failed'}))
        }
    }
}

export const deleteTodoTC = (todoId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        dispatch(changeTodolistEntityStatusAC({id: todoId, status: 'loading'}))
        await todolistAPI.deleteTodolist(todoId)
        dispatch(removeTodolistAC({id: todoId}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
    } catch (e) {
        dispatch(changeTodolistEntityStatusAC({id: todoId, status: 'idle'}))
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
        }
    }

}

export const createTodoTC = (title: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(addTodolistAC({todolist: res.data.data.item}))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
        }
    }

}

export const changeTodoTitleTC = (todoId: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todoId, status: 'loading'}))
    try {
        const res = await todolistAPI.updateTodolist(todoId, title)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(changeTodolistTitleAC({id: todoId, newTitle: title}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
        }
    } finally {
        dispatch(changeTodolistEntityStatusAC({id: todoId, status: 'idle'}))
    }

}

//types
export type FilterType = 'all' | 'active' | 'completed'

export type TodoListDomainType = TodolistType & {
    filter: FilterType
    entityStatus: RequestStatusType
}

export type TodolistActionsType =
    AddTodoListACType
    | RemoveTodolistAC
    | SetTodoListsType


export type AddTodoListACType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistAC = ReturnType<typeof removeTodolistAC>
export type SetTodoListsType = ReturnType<typeof setTodolistsAC>


