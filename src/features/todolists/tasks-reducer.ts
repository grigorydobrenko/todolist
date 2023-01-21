import {
    addTodolistAC,
    AddTodoListACType,
    removeTodolistAC,
    RemoveTodolistAC,
    setTodolistsAC,
    SetTodoListsType
} from "./todolists-reducer"
import {ModelType, ResultCode, TaskType, todolistAPI} from "../../api/todolist-api"
import {AppRootStateType, AppThunk} from "../../app/store"
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import axios, {AxiosError} from "axios";
import {handleServerAppError, handleServerNetWorkError} from "../../utils/error-utils";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

// const slice = createSlice({
//     name: 'tasks',
//     initialState,
//     reducers: {
//         addTaskAC(state, action: PayloadAction<{ todolistId: string, task: TaskType }>) {
//             const tasks = state[action.payload.todolistId]
//             tasks.unshift({...action.payload.task, entityStatus: 'idle'})
//         },
//         removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
//             const tasks = state[action.payload.todolistId]
//             const index = tasks.findIndex(task => task.id === action.payload.taskId)
//             if (index !== -1) {
//                 tasks.splice(index, 1)
//             }
//         },
//         updateTaskAC(state, action: PayloadAction<{ taskId: string, task: UpdateTaskType, todolistId: string }>) {
//             const tasks = state[action.payload.todolistId]
//             const index = tasks.findIndex(task => task.id === action.payload.taskId)
//             if (index !== -1) {
//                 tasks[index] = {...tasks[index], ...action.payload.task}
//             }
//         },
    //     setTasksAC(state, action: PayloadAction<{ tasks: TaskType[], todolistId: string }>) {
    //
    //         state[action.payload.todolistId] = action.payload.tasks.forEach(task => {...task, entityStatus: 'idle'})
    //
    //     },
    //     changeTaskEntityStatusAC(state, action: PayloadAction<{ todolistId: string, taskId: string, status: RequestStatusType }>) {
    //         const tasks = state[action.payload.todolistId]
    //         const index = tasks.findIndex(task => task.id === action.payload.taskId)
    //         if (index !== -1) {
    //             tasks[index] = {...tasks[index], entityStatus: action.payload.status}
    //         }
    //     },
//     }
// })

// export const tasksReducer = slice.reducer
// export const {addTaskAC, removeTaskAC, updateTaskAC, setTasksAC, changeTaskEntityStatusAC} = slice.actions

// export const tasksReducer = (state = initialState, action: TaskActionsType): TasksStateType => {
//     switch (action.type) {
//         case setTodolistsAC.type:
//             let copyState = {...state}
//             action.payload.todos.forEach(el =>
//                 copyState[el.id] = []
//             )
//             return copyState
//         case 'REMOVE-TASK':
//             return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
//         case "ADD-TASK":
//             return {
//                 ...state,
//                 [action.todolistId]: [{...action.task, entityStatus: 'idle'}, ...state[action.todolistId]]
//             }
//         case "SET-TASKS":
//             return {...state, [action.todoId]: action.tasks.map(t => ({...t, entityStatus: 'idle'}))}
//         case 'UPDATE-TASK':
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].map((el) => el.id === action.taskId ? {...el, ...action.task} : el)
//             }
//         case addTodolistAC.type:
//             return {...state, [action.payload.todolist.id]: []}
//         case removeTodolistAC.type:
//             const newState = {...state}
//             delete newState[action.payload.id]
//             return newState
//         case "SET-TASK-ENTITY-STATUS":
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].map((el) => el.id === action.TaskId ? {
//                     ...el,
//                     entityStatus: action.status
//                 } : el)
//             }
//         default:
//             return state
//     }
// }
//
// export const removeTaskAC = (taskId: string, todolistId: string) => ({type: 'REMOVE-TASK', todolistId, taskId} as const)
// export const addTaskAC = (todolistId: string, task: TaskType) => ({type: 'ADD-TASK', todolistId, task} as const)
// export const updateTaskAC = (taskId: string, task: UpdateTaskType, todolistId: string) => ({
//     type: 'UPDATE-TASK',
//     taskId,
//     task,
//     todolistId
// } as const)
//
// export const setTasksAC = (tasks: TaskType[], todoId: string) => ({type: 'SET-TASKS', tasks, todoId} as const)
// export const changeTaskEntityStatusAC = (todolistId: string, TaskId: string, status: RequestStatusType) => ({
//     type: 'SET-TASK-ENTITY-STATUS',
//     todolistId,
//     TaskId,
//     status
// } as const)

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
    dispatch(changeTaskEntityStatusAC(todoId, taskId, 'loading'))
    try {
        const res = await todolistAPI.deleteTask(todoId, taskId)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(removeTaskAC(taskId, todoId))
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
            dispatch(addTaskAC(todoId, res.data.data.item))
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

export const updateTaskTC = (todoId: string, taskId: string, value: UpdateTaskType) => async (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todoId].find(t => t.id === taskId)
    if (task) {
        const model: ModelType = {
            ...task,
            ...value
        }
        try {
            dispatch(setAppStatusAC({status: 'loading'}))
            dispatch(changeTaskEntityStatusAC(todoId, taskId, 'loading'))
            const res = await todolistAPI.updateTask(todoId, taskId, model)
            if (res.data.resultCode === ResultCode.OK) {
                const updatedTask = res.data.data.item
                dispatch(updateTaskAC(taskId, updatedTask, todoId))
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
            dispatch(changeTaskEntityStatusAC(todoId, taskId, 'idle'))
        }

    }
}

//types
export type TaskActionsType =
    removeTaskACType
    | addTaskACType
    | changeTaskStatusACType
    | AddTodoListACType
    | RemoveTodolistAC
    | SetTodoListsType
    | setTasksACType
    | changeTaskEntityStatusACType

type removeTaskACType = ReturnType<typeof removeTaskAC>
type addTaskACType = ReturnType<typeof addTaskAC>
type changeTaskStatusACType = ReturnType<typeof updateTaskAC>
type setTasksACType = ReturnType<typeof setTasksAC>
type changeTaskEntityStatusACType = ReturnType<typeof changeTaskEntityStatusAC>

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


