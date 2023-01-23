import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "./todolists-reducer"
import {ModelType, ResultCode, TaskType, todolistAPI} from "../../api/todolist-api"
import {AppRootState} from "../../app/store"
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import axios, {AxiosError} from "axios";
import {handleServerAppError, handleServerNetWorkError} from "../../utils/error-utils";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTaskAC(state, action: PayloadAction<{ todolistId: string, task: TaskType }>) {
            const tasks = state[action.payload.todolistId]
            tasks.unshift({...action.payload.task, entityStatus: 'idle'})
        },
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) {
                tasks.splice(index, 1)
            }
        },
        updateTaskAC(state, action: PayloadAction<{ taskId: string, task: UpdateTaskType, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = {...tasks[index], ...action.payload.task}
            }
        },
        setTasksAC(state, action: PayloadAction<{ tasks: TaskType[], todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks.map(task => ({...task, entityStatus: 'idle'}))
        },
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
            .addCase(setTodolistsAC, (state, action) => {
                action.payload.todos.forEach(el => state[el.id] = [])
            })
            .addCase(addTodolistAC, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(removeTodolistAC, (state, action) => {
                delete state[action.payload.id]
            })
    }
})

export const tasksReducer = slice.reducer
export const {addTaskAC, removeTaskAC, updateTaskAC, setTasksAC, changeTaskEntityStatusAC} = slice.actions

export const fetchTasksTC = (todoId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.getTasks(todoId)
        dispatch(setTasksAC({tasks: res.data.items, todolistId: todoId}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
        }
    }
}

export const deleteTaskTC = (todoId: string, taskId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTaskEntityStatusAC({todolistId: todoId, taskId: taskId, status: 'loading'}))
    try {
        const res = await todolistAPI.deleteTask(todoId, taskId)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(removeTaskAC({taskId: taskId, todolistId: todoId}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
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

export const createTaskTC = (todoId: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.createTask(todoId, title)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(addTaskAC({todolistId: todoId, task: res.data.data.item}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
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

export const updateTaskTC = (todoId: string, taskId: string, value: UpdateTaskType) => async (dispatch: Dispatch, getState: () => AppRootState) => {
    const task = getState().tasks[todoId].find(t => t.id === taskId)
    if (task) {
        const model: ModelType = {
            ...task,
            ...value
        }
        try {
            dispatch(setAppStatusAC({status: 'loading'}))
            dispatch(changeTaskEntityStatusAC({todolistId: todoId, taskId: taskId, status: 'loading'}))
            const res = await todolistAPI.updateTask(todoId, taskId, model)
            if (res.data.resultCode === ResultCode.OK) {
                const updatedTask = res.data.data.item
                dispatch(updateTaskAC({taskId: taskId, task: updatedTask, todolistId: todoId}))
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
            dispatch(changeTaskEntityStatusAC({todolistId: todoId, taskId: taskId, status: 'idle'}))
        }

    }
}

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


