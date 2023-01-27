import React, {useCallback, useEffect} from "react"
import {Grid} from "@mui/material"
import {AddItemForm, AddItemFormSubmitHelperType} from "../../components/addItemForm/AddItemForm";
import {Todolist} from "./todolist/Todolist";
import {Navigate} from "react-router-dom";
import {ROUTS} from "../../app/App";
import {authSelectors} from "../auth";
import {todolistsActions, todolistsSelectors} from "./index";
import {useActions, useAppDispatch, useAppSelector} from "../../utils/redux-utils";
import {tasksSelectors} from "./todolist/tasks";

export const TodolistsList: React.FC = () => {
    let todolists = useAppSelector(todolistsSelectors.todolists)
    let tasks = useAppSelector(tasksSelectors.tasks)
    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)

    const {fetchTodolists} = useActions(todolistsActions)

    const dispatch = useAppDispatch()

    const addTodolist = useCallback(async (todolistTitle: string, helper: AddItemFormSubmitHelperType) => {
        let thunk = todolistsActions.createTodolist(todolistTitle)

        const resultAction = await dispatch(thunk)

        if (todolistsActions.createTodolist.rejected.match(resultAction)) {
            if (resultAction.payload?.errors?.length) {
                const errorMessage = resultAction.payload?.errors[0]
                helper.setError(errorMessage)
            } else {
                helper.setError('Some error occurred')
            }
        }
        else {
            helper.setNewTitle('')
        }
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