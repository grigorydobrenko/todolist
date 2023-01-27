import {todolistAPI} from "../../api/todolist-api"
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {handleAsyncServerAppError, handleAsyncServerNetworkError, ThunkError} from "../../utils/error-utils";
import {ResultCode, TodolistType} from "../../api/types";


// thunks

export const fetchTodolists = createAsyncThunk<{ todos: TodolistType[] }, undefined, ThunkError>('todolists/fetchTodolists', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.getTodolists()
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todos: res.data}
    } catch (error) {
        return handleAsyncServerNetworkError(error as AxiosError, thunkAPI)
    }
})

export const removeTodolist = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, thunkAPI) => {
    const {dispatch} = thunkAPI
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
        await todolistAPI.deleteTodolist(todolistId)
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {id: todolistId}
    } catch (error) {
        dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'idle'}))
        return handleAsyncServerNetworkError(error as AxiosError, thunkAPI)
    }
})

export const createTodolist = createAsyncThunk<{ todolist: TodolistType }, string, ThunkError>
('todolists/createTodolist', async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === ResultCode.OK) {
            return {todolist: res.data.data.item}
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI, false)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error as AxiosError, thunkAPI, false)
    }
})

export const changeTodolistTitle = createAsyncThunk('todolists/changeTodolistTitle', async (param: { todolistId: string, title: string }, thunkAPI) => {
    const {dispatch} = thunkAPI
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: param.todolistId, status: 'loading'}))
    try {
        const res = await todolistAPI.updateTodolist(param.todolistId, param.title)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {id: param.todolistId, title: param.title}
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error as AxiosError, thunkAPI, false)
    } finally {
        dispatch(changeTodolistEntityStatusAC({id: param.todolistId, status: 'idle'}))
    }
})

export const asyncActions = {
    fetchTodolists,
    removeTodolist,
    createTodolist,
    changeTodolistTitle
}

// slice

export const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodoListDomainType[],
    reducers: {
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterType }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) {
                state[index].filter = action.payload.filter
            }
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) {
                state[index].entityStatus = action.payload.status
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodolists.fulfilled, (state, action) => {
            return action.payload.todos.map(todo => ({...todo, filter: 'all', entityStatus: 'idle'}))
        })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.id)
                if (index !== -1) {
                    state.splice(index, 1)
                }
            })
            .addCase(createTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.id)
                if (index !== -1) {
                    state[index].title = action.payload.title
                }
            })
    }
})

export const todolistsReducer = slice.reducer

export const {
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC
} = slice.actions


//types
export type FilterType = 'all' | 'active' | 'completed'

export type TodoListDomainType = TodolistType & {
    filter: FilterType
    entityStatus: RequestStatusType
}






