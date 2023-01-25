import React, {useCallback, useEffect} from "react"
import AddItemForm from "../../../components/addItemForm/AddItemForm"
import EditableSpan from "../../../components/editableSpan/EditableSpan"
import {Button, IconButton} from "@mui/material"
import {Delete} from "@mui/icons-material"
import TaskComponent from "./task/TaskComponent"
import {TaskStatuses} from "../../../api/todolist-api"
import {FilterType} from "../todolists-reducer";
import {TaskDomainType} from "../tasks-reducer";
import {useActions} from "../../../app/hooks";
import {RequestStatusType} from "../../../app/app-reducer";
import {tasksActions, todolistsActions} from "../index";


export const Todolist: React.FC<PropsType> = React.memo((
    {
        id,
        title,
        tasks,
        filter,
        entityStatus
    }
) => {

    const {fetchTasks, updateTask, deleteTask, createTask} = useActions(tasksActions)
    const {removeTodolist, changeTodolistTitle, changeTodolistFilterAC} = useActions(todolistsActions)

    const removeTask = useCallback((todolistId: string, taskId: string) => {
        deleteTask({todolistId, taskId})
    }, [])


    const changeTaskStatus = useCallback((todolistId: string, taskId: string, status: TaskStatuses) => {
        updateTask({todolistId, taskId, value: {status}})
    }, [])

    const changeTaskTitle = useCallback((todolistId: string, taskId: string, newTitle: string) => {
        updateTask({todolistId, taskId, value: {title: newTitle}})
    }, [])

    const onAllClickHandler = useCallback(() => {
        changeTodolistFilterAC({id: id, filter: 'all'})
    }, [id])

    const onActiveClickHandler = useCallback(() => {
        changeTodolistFilterAC({id: id, filter: 'active'})
    }, [id])

    const onCompleteClickHandler = useCallback(() => {
        changeTodolistFilterAC({id: id, filter: 'completed'})
    }, [id])


    const addNewTask = useCallback((title: string) => {
        createTask({todolistId: id, title})
    }, [id])

    const onClickRemoveHandler = () => {
        removeTodolist(id)
    }

    const ChangeTodolist = useCallback((title: string) => {
        changeTodolistTitle({todolistId: id, title})
    }, [id])

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
        fetchTasks(id)
    }, [])

    return (
        <div className="App">
            <div>
                <h3>
                    <EditableSpan value={title} callBack={ChangeTodolist} disabled={entityStatus === 'loading'}/>
                    <IconButton aria-label="delete" size="small" onClick={onClickRemoveHandler}
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

type PropsType = {
    id: string
    title: string
    tasks: TaskDomainType[]
    filter: FilterType,
    entityStatus: RequestStatusType
}