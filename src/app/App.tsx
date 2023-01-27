import React, {useEffect} from 'react'
import './App.css'
import {CircularProgress, Container} from "@mui/material"
import {TodolistsList} from "../features/todolists/TodolistsList"
import {CustomizedSnackbars} from "../components/errorSnackbar/ErrorSnackbar";
import {Login} from "../features/auth";
import {Navigate, Route, Routes} from "react-router-dom";
import {selectIsInitialized} from "./selectors";
import {useActions} from "../utils/redux-utils";
import {appActions} from "./index";
import {Header} from "./AppBar";
import {PageNotFound} from "../components/PageNotFound";
import {useSelector} from "react-redux";


export enum ROUTS {
    DEFAULT = '/',
    LOGIN = '/login',
    NOT_FOUND = '/404',
}

function App() {

    const isInitialized = useSelector(selectIsInitialized)

    const {initializeApp} = useActions(appActions)

    useEffect(() => {
        initializeApp()
    }, [])

    if (!isInitialized) {
        return <div
            className={'preloader'}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className={'App'}>
            <Header/>
            <Container fixed>
                <Routes>
                    <Route path={ROUTS.DEFAULT} element={<TodolistsList/>}/>
                    <Route path={ROUTS.LOGIN} element={<Login/>}/>
                    <Route path={ROUTS.NOT_FOUND} element={<PageNotFound/>}/>
                    <Route path='*' element={<Navigate to={ROUTS.NOT_FOUND}/>}/>
                </Routes>
            </Container>
            <CustomizedSnackbars/>
        </div>
    )
}

export default App;


