import axios, {AxiosResponse} from 'axios'
import {LoginPayloadType} from "../features/auth/Login";
import {UpdateTaskType} from "../features/todolists/tasks-reducer";
import {AuthMeResponseType, CommonResponseType, ModelType, ResponseGetTasksType, TaskType, TodolistType} from "./types";


const instance = axios.create({
    withCredentials: true,
    baseURL: `https://social-network.samuraijs.com/api/1.1/`,
    headers: {
        'API-KEY': '1cdd9f77-c60e-4af5-b194-659e4ebd5d41',
    }
})

export const todolistAPI = {
    updateTodolist(todolistId: string, title: string) {
        return instance.put<{ title: string }, AxiosResponse<CommonResponseType>>(`todo-lists/${todolistId}`, {title: title})
    },
    getTodolists() {
        return instance.get<TodolistType[]>(`todo-lists/`)
    },
    createTodolist(title: string) {
        return instance.post<{ title: string }, AxiosResponse<CommonResponseType<{ item: TodolistType }>>>(`todo-lists/`, {title: title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<CommonResponseType>(`todo-lists/${todolistId}`)
    },
    getTasks(todolistId: string) {
        return instance.get<ResponseGetTasksType>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<{ title: string }, AxiosResponse<CommonResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks`, {title: title})
    },
    updateTask(todolistId: string, taskId: string, model: ModelType) {
        return instance.put<UpdateTaskType, AxiosResponse<CommonResponseType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<CommonResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    }
}

export const authAPI = {
    login(data: LoginPayloadType) {
        return instance.post<LoginPayloadType, AxiosResponse<CommonResponseType<{ userId: number }>>>(`auth/login`, data)
    },
    me() {
        return instance.get<CommonResponseType<AuthMeResponseType>>(`auth/me`)
    },
    logout() {
        return instance.delete<CommonResponseType>(`auth/login`)
    }
}

