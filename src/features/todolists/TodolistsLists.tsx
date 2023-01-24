import React, {useCallback, useEffect} from "react"
import {useAppDispatch, useAppSelector} from "../../app/hooks"
import {createTask, deleteTask, updateTask} from "./tasks-reducer"
import {
    changeTodolistFilterAC, changeTodolistTitle,
    createTodolist,

    fetchTodolists,
    FilterType, removeTodolist
} from "./todolists-reducer"
import {TaskStatuses} from "../../api/todolist-api"
import {Grid, Paper} from "@mui/material"
import AddItemForm from "../../components/addItemForm/AddItemForm";
import {Todolist} from "./todolist/Todolist";
import {Navigate} from "react-router-dom";
import {ROUTS} from "../../app/App";

export const TodolistsLists: React.FC = () => {
    let todolists = useAppSelector(state => state.todolists)
    let tasks = useAppSelector(state => state.tasks)
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)


    const removeTask = useCallback((todolistId: string, taskId: string) => {
        dispatch(deleteTask({todolistId, taskId}))
    }, [dispatch])


    const changeFilter = useCallback((todolistId: string, filter: FilterType) => {
        dispatch(changeTodolistFilterAC({id: todolistId, filter: filter}))
    }, [dispatch])

    const addTask = useCallback((todolistId: string, title: string) => {
        dispatch(createTask({todolistId, title}))
    }, [dispatch])

    const changeTaskStatus = useCallback((todolistId: string, taskId: string, status: TaskStatuses) => {
        dispatch(updateTask({todolistId, taskId, value: {status}}))
    }, [dispatch])

    const removeTodolistCallback = useCallback((todolistId: string) => {
        dispatch(removeTodolist(todolistId))
    }, [dispatch])


    const addTodolist = useCallback((todolistTitle: string) => {
        dispatch(createTodolist(todolistTitle))
    }, [dispatch])

    const changeTaskTitle = useCallback((todolistId: string, taskId: string, newTitle: string) => {
        dispatch(updateTask({todolistId, taskId, value: {title: newTitle}}))
    }, [dispatch])


    const changeTodolistTitleCallback = useCallback((todolistId: string, title: string) => {
        dispatch(changeTodolistTitle({todolistId, title}))
    }, [dispatch])

    useEffect(() => {

        if (!isLoggedIn) {
            return
        }
        dispatch(fetchTodolists())
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={ROUTS.LOGIN}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {todolists.map(t => {
                return <Grid item key={t.id}>
                    <Paper style={{padding: '10px'}}>
                        <Todolist
                            key={t.id}
                            id={t.id}
                            entityStatus={t.entityStatus}
                            title={t.title}
                            tasks={tasks[t.id]}
                            removeTask={removeTask}
                            changeFilter={changeFilter}
                            addTask={addTask}
                            changeTaskStatus={changeTaskStatus}
                            filter={t.filter}
                            removeTodolist={removeTodolistCallback}
                            changeTaskTitle={changeTaskTitle}
                            changeTodolistTitle={changeTodolistTitleCallback}
                        />
                    </Paper>
                </Grid>
            })
            }
        </Grid>
    </>
}