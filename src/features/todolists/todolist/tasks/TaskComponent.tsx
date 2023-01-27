import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from "@mui/material"
import {EditableSpan} from "../../../../components/editableSpan/EditableSpan"
import {Delete} from "@mui/icons-material"
import {TaskStatuses, TaskType} from "../../../../api/types";
import {useActions} from "../../../../utils/redux-utils";
import {tasksActions} from "./";


const TaskComponent = React.memo((props: TaskPropsType) => {

    const {updateTask, deleteTask} = useActions(tasksActions)

    const RemoveTaskHandler = useCallback((taskId: string) => {
        deleteTask({todolistId: props.todolistId, taskId: taskId})
    }, [props.todolistId, props.task.id])

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New

        updateTask({todolistId: props.todolistId, taskId: props.task.id, value: {status}})
    }, [props.todolistId, props.task.id])

    const ChangeTask = useCallback((taskId: string, newTitle: string) => {
        updateTask({todolistId: props.todolistId, taskId: props.task.id, value: {title: newTitle}})
    }, [props.todolistId, props.task.id])

    return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''} style={{position: 'relative'}}>
        <Checkbox onChange={onChangeHandler} checked={props.task.status === TaskStatuses.Completed} color='primary'
                  disabled={props.disabled}/>
        <EditableSpan value={props.task.title} callBack={(newTitle) => ChangeTask(props.task.id, newTitle)}
                      disabled={props.disabled}/>
        <IconButton aria-label="delete" size="small" onClick={() => RemoveTaskHandler(props.task.id)}
                    disabled={props.disabled} sx={{ position: 'absolute', top: '2px', right: '2px'}}>
            <Delete fontSize={'small'}/>
        </IconButton>
    </div>
})

export default TaskComponent;

type TaskPropsType = {
    task: TaskType
    todolistId: string
    disabled: boolean
}