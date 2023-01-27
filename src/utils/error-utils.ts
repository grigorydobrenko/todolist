import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {AxiosError} from "axios";
import {CommonResponseType, FieldError} from "../api/types";

export const handleAsyncServerAppError = <D>(data: CommonResponseType<D>, thunkAPI: ThunkAPIType, showError: boolean = true) => {
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

export type ThunkError = { rejectValue: { errors: string[], fieldsErrors?: FieldError[] } }




