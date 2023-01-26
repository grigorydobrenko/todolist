import React, {useCallback, useEffect} from "react"
import {useActions, useAppSelector} from "../../app/hooks"
import {Grid} from "@mui/material"
import AddItemForm from "../../components/addItemForm/AddItemForm";
import {Todolist} from "./todolist/Todolist";
import {Navigate} from "react-router-dom";
import {ROUTS} from "../../app/App";
import {authSelectors} from "../auth";
import {todolistsActions} from "./index";

export const TodolistsLists: React.FC = () => {
    let todolists = useAppSelector(state => state.todolists)
    let tasks = useAppSelector(state => state.tasks)
    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)

    const {fetchTodolists, createTodolist} = useActions(todolistsActions)

    const addTodolist = useCallback((todolistTitle: string) => {
        createTodolist(todolistTitle)
    }, [])

    useEffect(() => {

        if (!isLoggedIn) {
            return
        }

        fetchTodolists()
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={ROUTS.LOGIN}/>
    }

    return <>
        <Grid container sx={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3} sx={{flexWrap: 'nowrap', overflowX: 'scroll'}}>
            {todolists.map(t => {
                return <Grid item key={t.id}>
                    <div style={{width: '300px', overflow: "hidden"}}>
                        <Todolist
                            key={t.id}
                            id={t.id}
                            entityStatus={t.entityStatus}
                            title={t.title}
                            tasks={tasks[t.id]}
                            filter={t.filter}
                        />
                    </div>
                </Grid>
            })
            }
        </Grid>
    </>
}