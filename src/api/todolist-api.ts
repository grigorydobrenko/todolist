import axios, {AxiosResponse} from 'axios'
import {LoginPayloadType} from "../features/auth/Login";
import {UpdateTaskType} from "../features/todolists/tasks-reducer";


const instance = axios.create({
    withCredentials: true,
    baseURL: `https://social-network.samuraijs.com/api/1.1/`,
    headers: {
        'API-KEY': '1cdd9f77-c60e-4af5-b194-659e4ebd5d41',
    }
})

//api
export const todolistAPI = {
    updateTodolist(todolistId: string, title: string) {
        return instance.put<{ title: string }, AxiosResponse<ResponseType>>(`todo-lists/${todolistId}`, {title: title})
    },
    getTodolists() {
        return instance.get<TodolistType[]>(`todo-lists/`)
    },
    createTodolist(title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TodolistType }>>>(`todo-lists/`, {title: title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    getTasks(todolistId: string) {
        return instance.get<ResponseGetTasksType>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks`, {title: title})
    },
    updateTask(todolistId: string, taskId: string, model: ModelType) {
        return instance.put<UpdateTaskType, AxiosResponse<ResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    }
}

export const authAPI = {
    login(data: LoginPayloadType) {
        return instance.post<LoginPayloadType, AxiosResponse<ResponseType<{ userId: number }>>>(`auth/login`, data)
    },
    me() {
        return instance.get<ResponseType<AuthMeResponseType>>(`auth/me`)
    },
    logout() {
        return instance.delete<ResponseType>(`auth/login`)
    }
}

//types

export type AuthMeResponseType = {
    id: number,
    email: string,
    login: string
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type ResponseGetTasksType = {
    items: TaskType[]
    totalCount: number
    error: string
}
export type ModelType = {
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}
export type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}

export type FieldError = { field: string, error: string }

export type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors?: FieldError[]
    data: D
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    High = 2,
    Urgently = 3,
    Later = 4
}

export enum ResultCode {
    OK = 0,
    ERROR = 1,
    CAPTCHA = 10
}

