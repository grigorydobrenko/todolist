import React, {useCallback, useEffect} from "react"
import {useAppDispatch, useAppSelector} from "../../app/hooks"
import {createTaskTC, deleteTaskTC, updateTaskTC} from "./tasks-reducer"
import {
    changeTodolistFilterAC,
    changeTodoTitleTC,
    createTodoTC,
    deleteTodoTC,
    FilterType, getTodoTC
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


    const removeTask = useCallback((TodolistId: string, taskID: string) => {
        dispatch(deleteTaskTC(TodolistId, taskID))
    }, [dispatch])


    const changeFilter = useCallback((todolistID: string, filter: FilterType) => {
        dispatch(changeTodolistFilterAC({id: todolistID, filter: filter}))
    }, [dispatch])

    const addTask = useCallback((todolistID: string, newTitle: string) => {
        dispatch(createTaskTC(todolistID, newTitle))
    }, [dispatch])

    const changeTaskStatus = useCallback((todolistID: string, taskId: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(todolistID, taskId, {status}))
    }, [dispatch])

    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(deleteTodoTC(todolistId))
    }, [dispatch])


    const addTodolist = useCallback((todolistTitle: string) => {
        dispatch(createTodoTC(todolistTitle))
    }, [dispatch])

    const changeTaskTitle = useCallback((TodolistId: string, taskId: string, newTitle: string) => {
        dispatch(updateTaskTC(TodolistId, taskId, {title: newTitle}))
    }, [dispatch])


    const changeTodolistTitle = useCallback((TodolistId: string, newTitle: string) => {
        dispatch(changeTodoTitleTC(TodolistId, newTitle))
    }, [dispatch])

    useEffect(() => {

        if (!isLoggedIn) {
            return
        }
        dispatch(getTodoTC())
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
                            removeTodolist={removeTodolist}
                            changeTaskTitle={changeTaskTitle}
                            changeTodolistTitle={changeTodolistTitle}
                        />
                    </Paper>
                </Grid>
            })
            }
        </Grid>
    </>
}