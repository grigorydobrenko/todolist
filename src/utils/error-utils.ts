import {Dispatch} from "redux";
import {ResponseType} from "../api/todolist-api";
import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {AxiosError} from "axios";

export const handleServerAppError = <D>(dispatch: Dispatch, data: ResponseType<D>, showError: boolean = true) => {
    if (showError) {
        dispatch(setAppErrorAC({error: data.messages.length ? data.messages[0] : 'some error'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetWorkError = (dispatch: Dispatch, error: { message: string }, showError: boolean = true) => {
    if (showError) {
        dispatch(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleAsyncServerAppError = <D>(data: ResponseType<D>, thunkAPI: ThunkAPIType, showError: boolean = true) => {
    if (showError) {
        thunkAPI.dispatch(setAppErrorAC({error: data.messages.length ? data.messages[0] : 'some error'}))
    }
    thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))
    return thunkAPI.rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors})
}

export const handleAsyncServerNetworkError = (error: AxiosError, thunkAPI: ThunkAPIType, showError: boolean = true) => {
    if (showError) {
        thunkAPI.dispatch(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
    }
    thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))
    return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
}

type ThunkAPIType = {
    dispatch: (action: any) => any
    rejectWithValue: Function
}





