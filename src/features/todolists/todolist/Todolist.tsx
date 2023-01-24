import React, {useCallback, useEffect} from "react"
import AddItemForm from "../../../components/addItemForm/AddItemForm"
import EditableSpan from "../../../components/editableSpan/EditableSpan"
import {Button, IconButton} from "@mui/material"
import {Delete} from "@mui/icons-material"
import TaskComponent from "./task/TaskComponent"
import {TaskStatuses} from "../../../api/todolist-api"
import {FilterType} from "../todolists-reducer";
import {fetchTasks, TaskDomainType} from "../tasks-reducer";
import {useAppDispatch} from "../../../app/hooks";
import {RequestStatusType} from "../../../app/app-reducer";

type PropsType = {
    id: string
    title: string
    tasks: TaskDomainType[]
    removeTask: (todolistId: string, taskID: string) => void
    changeFilter: (todolistID: string, filter: FilterType) => void
    addTask: (todolistID: string, newTitle: string) => void
    changeTaskStatus: (todolistID: string, taskId: string, status: TaskStatuses) => void
    removeTodolist: (todolistId: string) => void
    changeTaskTitle: (TodolistId: string, taskId: string, newTitle: string) => void
    changeTodolistTitle: (TodolistId: string, newTitle: string) => void
    filter: FilterType,
    entityStatus: RequestStatusType
}


export const Todolist: React.FC<PropsType> = React.memo((
    {
        id,
        title,
        tasks,
        removeTask,
        changeFilter,
        addTask,
        changeTaskStatus,
        removeTodolist,
        changeTaskTitle,
        changeTodolistTitle,
        filter,
        entityStatus
    }
) => {

    const dispatch = useAppDispatch()

    const onAllClickHandler = useCallback(() => {
        changeFilter(id, 'all')
    }, [changeFilter, id])

    const onActiveClickHandler = useCallback(() => {
        changeFilter(id, 'active')
    }, [changeFilter, id])

    const onCompleteClickHandler = useCallback(() => {
        changeFilter(id, 'completed')
    }, [changeFilter, id])


    const addNewTask = useCallback((title: string) => {
        addTask(id, title)
    }, [addTask, id])


    const onClickTitleHandler = () => {
        removeTodolist(id)
    }

    const ChangeTodolist = useCallback((newTitle: string) => {
        changeTodolistTitle(id, newTitle)
    }, [changeTodolistTitle, id])

    const allClassName = filter === 'all' ? "outlined" : "text"
    const activeClassName = filter === 'active' ? "outlined" : "text"
    const completedClassName = filter === 'completed' ? "outlined" : "text"

    let tasksForTodolist = tasks

    if (filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    useEffect(() => {
        dispatch(fetchTasks(id))
    }, [])

    return (
        <div className="App">
            <div>
                <h3>
                    <EditableSpan value={title} callBack={ChangeTodolist} disabled={entityStatus === 'loading'}/>
                    <IconButton aria-label="delete" size="small" onClick={onClickTitleHandler}
                                disabled={entityStatus === 'loading'}>
                        <Delete/>
                    </IconButton>
                </h3>
                <AddItemForm addItem={addNewTask} disabled={entityStatus === 'loading'}/>

                {!tasksForTodolist.length && <span>No tasks</span>}
                {tasksForTodolist.map(t =>
                    <TaskComponent
                        key={t.id}
                        changeTaskStatus={changeTaskStatus}
                        removeTask={removeTask}
                        changeTaskTitle={changeTaskTitle}
                        task={t}
                        todolistId={id}
                        disabled={t.entityStatus === 'loading' || entityStatus === 'loading'}
                    />
                )}
                <div>
                    <Button onClick={onAllClickHandler} variant={allClassName} color='warning'>All</Button>
                    <Button onClick={onActiveClickHandler} variant={activeClassName} color='error'>Active</Button>
                    <Button onClick={onCompleteClickHandler} variant={completedClassName}
                            color='secondary'>Completed</Button>
                </div>
            </div>
        </div>
    )
})