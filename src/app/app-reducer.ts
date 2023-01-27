import {setIsLoggedIn} from "../features/auth/auth-reducer";
import {authAPI} from "../api/todolist-api";
import {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ResultCode} from "../api/types";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "../utils/error-utils";

// thunks

export const initializeApp = createAsyncThunk('app/initialize', async (param, thunkAPI) => {

    try {
        const res = await authAPI.me()
        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(setIsLoggedIn({value: true}))
            return
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error as AxiosError, thunkAPI)
    }
})

export const asyncActions = {
    initializeApp
}

// slice

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as null | string,
        isInitialized: false as boolean
    },
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error
        }
    },
    extraReducers: (builder) => {
        builder.addCase(initializeApp.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})

export const appReducer = slice.reducer
export const {setAppStatusAC, setAppErrorAC} = slice.actions

// types

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
