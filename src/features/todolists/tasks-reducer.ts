import {createTodolist, fetchTodolists, removeTodolist} from "./todolists-reducer"
import {ModelType, ResultCode, TaskType, todolistAPI} from "../../api/todolist-api"
import {AppRootState} from "../../app/store"
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import axios, {AxiosError} from "axios";
import {handleServerAppError, handleServerNetWorkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";



// thunks

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.getTasks(todolistId)
        const tasks = res.data.items
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return {tasks, todolistId}
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(thunkAPI.dispatch, err)
        }
    }
})

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    thunkAPI.dispatch(changeTaskEntityStatusAC({todolistId: param.todolistId, taskId: param.taskId, status: 'loading'}))
    try {
        const res = await todolistAPI.deleteTask(param.todolistId, param.taskId)
        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {taskId: param.taskId, todolistId: param.todolistId}
        } else {
            handleServerAppError(thunkAPI.dispatch, res.data)
        }
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(thunkAPI.dispatch, err)
        }
    }
})

export const createTask = createAsyncThunk('tasks/addTask', async (param: { todolistId: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.createTask(param.todolistId, param.title)
        if (res.data.resultCode === ResultCode.OK) {

            dispatch(setAppStatusAC({status: 'succeeded'}))
            return res.data.data.item
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

export const updateTask = createAsyncThunk('tasks/updateTask', async (param: { todolistId: string, taskId: string, value: UpdateTaskType }, {
    dispatch,
    rejectWithValue,
    getState
}) => {

    const state = getState() as AppRootState

    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
    if (task) {
        const model: ModelType = {
            ...task,
            ...param.value
        }
        try {
            dispatch(setAppStatusAC({status: 'loading'}))
            dispatch(changeTaskEntityStatusAC({todolistId: param.todolistId, taskId: param.taskId, status: 'loading'}))
            const res = await todolistAPI.updateTask(param.todolistId, param.taskId, model)
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(setAppStatusAC({status: 'succeeded'}))
                return param
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
            dispatch(changeTaskEntityStatusAC({todolistId: param.todolistId, taskId: param.taskId, status: 'idle'}))

        }
    } else {
        return rejectWithValue('task not found in state')
    }
})

// slice

const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        changeTaskEntityStatusAC(state, action: PayloadAction<{ todolistId: string, taskId: string, status: RequestStatusType }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = {...tasks[index], entityStatus: action.payload.status}
            }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                action.payload.todos.forEach(el => state[el.id] = [])
            })
            .addCase(createTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                if (action.payload) {
                    state[action.payload.todolistId] = action.payload.tasks.map(task => ({
                        ...task,
                        entityStatus: 'idle'
                    }))
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const tasks = state[action.payload!.todolistId]
                const index = tasks.findIndex(task => task.id === action.payload!.taskId)
                if (index !== -1) {
                    tasks.splice(index, 1)
                }
            })
            .addCase(createTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId]
                tasks.unshift({...action.payload, entityStatus: 'idle'})
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(task => task.id === action.payload.taskId)
                if (index !== -1) {
                    tasks[index] = {...tasks[index], ...action.payload.value}
                }
            })
    }
})

export const tasksReducer = slice.reducer
export const {changeTaskEntityStatusAC} = slice.actions


//types

export type UpdateTaskType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}

export type TasksStateType = {
    [id: string]: TaskDomainType[]
}

export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}


