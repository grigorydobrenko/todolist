import {Dispatch} from "redux";
import {ResponseType} from "../api/todolist-api";
import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";

export const handleServerAppError = <D>(dispatch: Dispatch, data: ResponseType<D>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'some error'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetWorkError = (dispatch: Dispatch, error: { message: string }) => {
    dispatch(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
    dispatch(setAppStatusAC({status: 'failed'}))
}



