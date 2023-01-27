import React from 'react';
import {AppBar, Button, LinearProgress, Toolbar, Typography} from "@mui/material";
import {useActions, useAppSelector} from "../utils/redux-utils";
import {selectStatus} from "./selectors";
import {authActions, authSelectors} from "../features/auth";

export const Header = () => {

    const status = useAppSelector(selectStatus)
    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)

    const {logout} = useActions(authActions)

    const logOutHandler = () => {
        logout()
    }

    return (
        <AppBar position="static">
            <Toolbar variant="dense" className={'toolBar'}>
                <Typography variant="h6" color="inherit" component="div">
                    Todolist
                </Typography>
                {isLoggedIn && <Button color='inherit' onClick={logOutHandler}>Log out</Button>}
            </Toolbar>
            {status === 'loading' && <LinearProgress/>}
        </AppBar>
    )
}

