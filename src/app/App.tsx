import React, {useEffect} from 'react'
import './App.css'
import {AppBar, Button, CircularProgress, Container, LinearProgress, Toolbar, Typography} from "@mui/material"
import {TodolistsList} from "../features/todolists/TodolistsList"
import {CustomizedSnackbars} from "../components/errorSnackbar/ErrorSnackbar";
import {Login} from "../features/auth";
import {Navigate, Route, Routes} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "./hooks";
import {logout} from "../features/auth/auth-reducer";
import {asyncActions} from "./app-reducer";
import {selectIsInitialized, selectStatus} from "./selectors";
import {authSelectors} from "../features/auth";

export enum ROUTS {
    DEFAULT = '/',
    LOGIN = '/login',
    NOT_FOUND = '/404',
}

function App() {

    const status = useAppSelector(selectStatus)
    const dispatch = useAppDispatch()
    const isInitialized = useAppSelector(selectIsInitialized)
    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)

    const logOut = () => {
        dispatch(logout())
    }

    useEffect(() => {
        dispatch(asyncActions.initializeApp())
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className={'App'}>
            <AppBar position="static">
                <Toolbar variant="dense" className={'toolBar'}>
                    <Typography variant="h6" color="inherit" component="div">
                        Todolist
                    </Typography>
                    {isLoggedIn && <Button color='inherit' onClick={logOut}>Log out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path={ROUTS.DEFAULT} element={<TodolistsList/>}></Route>
                    <Route path={ROUTS.LOGIN} element={<Login/>}></Route>
                    <Route path={ROUTS.NOT_FOUND}
                           element={<h1 style={{textAlign: 'center'}}>404: PAGE NOT FOUND</h1>}></Route>
                    <Route path='*' element={<Navigate to={ROUTS.NOT_FOUND}/>}></Route>
                </Routes>
            </Container>
            <CustomizedSnackbars/>
        </div>
    )
}


export default App;
