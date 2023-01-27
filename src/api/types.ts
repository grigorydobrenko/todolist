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

export type CommonResponseType<D = {}> = {
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