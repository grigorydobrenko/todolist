import {setIsLoggedIn} from "../features/auth/auth-reducer";
import {authAPI, ResultCode} from "../api/todolist-api";
import {handleServerAppError, handleServerNetWorkError} from "../utils/error-utils";
import axios, {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

// thunks

export const initializeApp = createAsyncThunk('app/initialize', async (param, {dispatch, rejectWithValue}) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setIsLoggedIn({value: true}))
        } else {
            handleServerAppError(dispatch, res.data)
            rejectWithValue({})
        }
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            handleServerNetWorkError(dispatch, err)
            rejectWithValue({})
        }
    }
    return
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
