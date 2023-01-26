import React, {useCallback, useEffect} from "react"
import AddItemForm from "../../../components/addItemForm/AddItemForm"
import EditableSpan from "../../../components/editableSpan/EditableSpan"
import {Button, IconButton, Paper} from "@mui/material"
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

    const {fetchTasks, createTask} = useActions(tasksActions)
    const {removeTodolist, changeTodolistTitle, changeTodolistFilterAC} = useActions(todolistsActions)

    const addNewTask = useCallback((title: string) => {
        createTask({todolistId: id, title})
    }, [id])

    const onClickRemoveHandler = () => {
        removeTodolist(id)
    }

    const ChangeTodolist = useCallback((title: string) => {
        changeTodolistTitle({todolistId: id, title})
    }, [id])

    let tasksForTodolist = tasks

    if (filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    const onButtonFilterHandler = useCallback((filter: FilterType) => {
        changeTodolistFilterAC({id: id, filter: filter})
    }, [id])

    useEffect(() => {
        fetchTasks(id)
    }, [])


    const renderFilterButton = (buttonFilter: FilterType,
                                color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
                                text: string) => {
        return <Button
            variant={filter === buttonFilter ? 'outlined' : 'text'}
            onClick={() => onButtonFilterHandler(buttonFilter)}
            color={color}>
            {text}
        </Button>
    }

    return (
        <Paper sx={{padding: '10px', paddingTop: '20px', position: 'relative'}}>
            <IconButton aria-label="delete" size="small" onClick={onClickRemoveHandler}
                        disabled={entityStatus === 'loading'}
                        sx={{position: 'absolute', right: '5px', top: '5px'}}
            >
                <Delete/>
            </IconButton>
            <h3>
                <EditableSpan value={title} callBack={ChangeTodolist} disabled={entityStatus === 'loading'}/>
            </h3>
            <AddItemForm addItem={addNewTask} disabled={entityStatus === 'loading'}/>

            {!tasksForTodolist.length && <div style={{padding: '10px', color: 'grey'}}>No tasks</div>}
            {tasksForTodolist.map(t =>
                <TaskComponent
                    key={t.id}
                    task={t}
                    todolistId={id}
                    disabled={t.entityStatus === 'loading' || entityStatus === 'loading'}
                />
            )}
            <div style={{paddingTop: '10px'}}>
                {renderFilterButton('all', 'warning', 'All')}
                {renderFilterButton('active', 'error', 'Active')}
                {renderFilterButton('completed', 'secondary', 'Completed')}
            </div>
        </Paper>
    )
})

type PropsType = {
    id: string
    title: string
    tasks: TaskDomainType[]
    filter: FilterType,
    entityStatus: RequestStatusType
}