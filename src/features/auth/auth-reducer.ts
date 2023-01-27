import {setAppStatusAC} from "../../app/app-reducer";
import {LoginPayloadType} from "./Login";
import {authAPI} from "../../api/todolist-api";
import {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ResultCode} from "../../api/types";
import {handleAsyncServerAppError, handleAsyncServerNetworkError, ThunkError} from "../../utils/error-utils";


// thunks

export const login = createAsyncThunk<undefined, LoginPayloadType, ThunkError>('auth/auth', async (data: LoginPayloadType, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === ResultCode.OK) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error as AxiosError, thunkAPI)
    }
})

export const logout = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error as AxiosError, thunkAPI)
    }
})

export const asyncActions = {
    login,
    logout
}

// slice

export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false as boolean
    },
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder.addCase(login.fulfilled, (state) => {
            state.isLoggedIn = true
        })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = false
            })
    }
})

export const authReducer = slice.reducer

export const {setIsLoggedIn} = slice.actions





