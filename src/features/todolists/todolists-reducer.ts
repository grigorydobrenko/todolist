import {ResultCode, todolistAPI, TodolistType} from "../../api/todolist-api"
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import axios, {AxiosError} from "axios";
import {handleServerAppError, handleServerNetWorkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

// thunks

export const fetchTodolists = createAsyncThunk('todolists/fetchTodolists', async (param, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.getTodolists()
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todos: res.data}
    } catch (e) {

        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
            dispatch(setAppStatusAC({status: 'failed'}))
            return rejectWithValue(null)
        }
        return rejectWithValue(null)
    }
})

export const removeTodolist = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
        await todolistAPI.deleteTodolist(todolistId)
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {id: todolistId}
    } catch (e) {
        dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'idle'}))
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
            return rejectWithValue(null)
        }
        return rejectWithValue(null)
    }
})

export const createTodolist = createAsyncThunk('todolists/createTodolist', async (title: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === ResultCode.OK) {
            return {todolist: res.data.data.item}
        } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
        }
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
            return rejectWithValue(null)
        }
        return rejectWithValue(null)
    }
})

export const changeTodolistTitle = createAsyncThunk('todolists/changeTodolistTitle', async (param: { todolistId: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: param.todolistId, status: 'loading'}))
    try {
        const res = await todolistAPI.updateTodolist(param.todolistId, param.title)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {id: param.todolistId, title: param.title}
        } else {
            handleServerAppError(dispatch, res.data)
            return rejectWithValue(null)
        }
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
            return rejectWithValue(null)
        }
        return rejectWithValue(null)
    } finally {
        dispatch(changeTodolistEntityStatusAC({id: param.todolistId, status: 'idle'}))
    }
})


// slice

const slice = createSlice({
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






