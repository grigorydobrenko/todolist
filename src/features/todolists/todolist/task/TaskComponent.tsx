import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from "@mui/material"
import EditableSpan from "../../../../components/editableSpan/EditableSpan"
import {Delete} from "@mui/icons-material"
import {TaskStatuses, TaskType} from "../../../../api/todolist-api"


type TaskPropsType = {
    changeTaskStatus: (todolistID: string, taskId: string, status: TaskStatuses) => void
    removeTask: (todolistId: string, taskID: string) => void
    changeTaskTitle: (TodolistId: string, taskId: string, newTitle: string) => void
    task: TaskType
    todolistId: string
    disabled: boolean

}
const TaskComponent = React.memo((props: TaskPropsType) => {
    const RemoveTaskHandler = useCallback((taskID: string) => {
        props.removeTask(props.todolistId, taskID)
    }, [props.removeTask, props.task.id])
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        props.changeTaskStatus(props.todolistId, props.task.id, status)
    }, [props.todolistId, props.task.id])
    const ChangeTask = useCallback((taskId: string, newTitle: string) => {
        props.changeTaskTitle(props.todolistId, taskId, newTitle)
    }, [props.changeTaskTitle, props.todolistId])

    return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox onChange={onChangeHandler} checked={props.task.status === TaskStatuses.Completed} color='primary'
                  disabled={props.disabled}/>
        <EditableSpan value={props.task.title} callBack={(newTitle) => ChangeTask(props.task.id, newTitle)}
                      disabled={props.disabled}/>
        <IconButton aria-label="delete" size="small" onClick={() => RemoveTaskHandler(props.task.id)}
                    disabled={props.disabled}>
            <Delete/>
        </IconButton>
    </div>
})

export default TaskComponent;