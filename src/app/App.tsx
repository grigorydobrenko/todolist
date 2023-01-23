import React, {useEffect} from 'react'
import './App.css'
import {AppBar, Button, CircularProgress, Container, LinearProgress, Toolbar, Typography} from "@mui/material"
import {TodolistsLists} from "../features/todolists/TodolistsLists"
import {initializeAppTC} from "./app-reducer";
import {CustomizedSnackbars} from "../components/errorSnackbar/ErrorSnackbar";
import {Login} from "../features/login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "./hooks";
import {logoutTC} from "../features/login/auth-reducer";

export enum ROUTS {
    DEFAULT = '/',
    LOGIN = '/login',
    NOT_FOUND = '/404',
}


function App() {

    const status = useAppSelector(state => state.app.status)
    const dispatch = useAppDispatch()
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    const logOut = () => {
        dispatch(logoutTC())
    }

    useEffect(() => {

        dispatch(initializeAppTC())
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
                    {isLoggedIn && <Button color='inherit'  onClick={logOut}>Log out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path={ROUTS.DEFAULT} element={<TodolistsLists/>}></Route>
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
