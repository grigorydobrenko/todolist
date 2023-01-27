import {todolistAPI} from "../../../../api/todolist-api"
import {RequestStatusType, setAppStatusAC} from "../../../../app/app-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {handleAsyncServerAppError, handleAsyncServerNetworkError, ThunkError,} from "../../../../utils/error-utils";
import {AppRootState} from "../../../../app/store";
import {todolistsActions} from "../../index";
import {ModelType, ResultCode, TaskType} from "../../../../api/types";

// thunks


export const fetchTasks = createAsyncThunk<{ tasks: TaskType[], todolistId: string }, string, ThunkError>('tasks/fetchTasks', async (todolistId, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.getTasks(todolistId)
        const tasks = res.data.items
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return {tasks, todolistId}
    } catch (error) {
        return handleAsyncServerNetworkError(error as AxiosError, thunkAPI)
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
            return handleAsyncServerAppError(res.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error as AxiosError, thunkAPI)
    }
})

export const createTask = createAsyncThunk<TaskType, { title: string, todolistId: string }, ThunkError>
('tasks/addTask', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.createTask(param.todolistId, param.title)
        if (res.data.resultCode === ResultCode.OK) {

            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return res.data.data.item
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI, false)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error as AxiosError, thunkAPI, false)
    }
})

export const updateTask = createAsyncThunk('tasks/updateTask', async (param: { todolistId: string, taskId: string, value: UpdateTaskType }, thunkAPI) => {

    const {
        dispatch,
        rejectWithValue,
        getState
    } = thunkAPI

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
                return handleAsyncServerAppError(res.data, thunkAPI)
            }
        } catch (error) {
            return handleAsyncServerNetworkError(error as AxiosError, thunkAPI)
        } finally {
            dispatch(changeTaskEntityStatusAC({todolistId: param.todolistId, taskId: param.taskId, status: 'idle'}))
        }
    } else {
        return rejectWithValue('tasks not found in state')
    }
})

export const asyncActions = {
    fetchTasks,
    deleteTask,
    createTask,
    updateTask
}

// slice

export const slice = createSlice({
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
            .addCase(todolistsActions.fetchTodolists.fulfilled, (state, action) => {
                action.payload.todos.forEach(el => state[el.id] = [])
            })
            .addCase(todolistsActions.createTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsActions.removeTodolist.fulfilled, (state, action) => {
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


