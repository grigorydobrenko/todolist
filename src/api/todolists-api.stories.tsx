import React, {useState} from 'react'
import {ModelType, todolistAPI} from './todolist-api'

export default {
    title: 'API'
}


export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    const onClickHandler = () => {
        todolistAPI.getTodolists().then(res => {
            setState(res.data)
        })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <button onClick={onClickHandler}>Get Todolists</button>
        </div>
    </div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState('')

    const onClickHandler = () => {
        todolistAPI.createTodolist(title).then(res => {
            setState(res.data)
        })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input type="text" value={title} onChange={(event) => setTitle(event.currentTarget.value)}
                   placeholder="todolist title"/>
            <button onClick={onClickHandler}>Create Todolist</button>
        </div>
    </div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState('')

    const onClickHandler = () => {
        todolistAPI.deleteTodolist(todolistId).then(res => {
            setState(res.data)
        })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input type="text" value={todolistId} onChange={(event) => setTodolistId(event.currentTarget.value)}
                   placeholder="todolist ID"/>
            <button onClick={onClickHandler}>Delete Todolist</button>
        </div>
    </div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState('')
    const [todolistId, setTodolistId] = useState('')


    const onClickHandler = () => {
        todolistAPI.updateTodolist(todolistId, title).then(res => {
            setState(res.data)
        })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input type="text" value={title} onChange={(event) => setTitle(event.currentTarget.value)}
                   placeholder="todolist title"/>
            <input type="text" value={todolistId} onChange={(event) => setTodolistId(event.currentTarget.value)}
                   placeholder="todolist ID"/>
            <button onClick={onClickHandler}>Update Todolist</button>
        </div>
    </div>
}
export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState('')
    const onClickHandler = () => {
        todolistAPI.getTasks(todolistId).then(res => {
            setState(res.data)
        })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input type="text" value={todolistId} onChange={(event) => setTodolistId(event.currentTarget.value)}
                   placeholder="todolist ID"/>
            <button onClick={onClickHandler}>Get Tasks</button>
        </div>
    </div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState('')
    const [title, setTitle] = useState('')
    const onClickHandler = () => {
        todolistAPI.createTask(todolistId, title).then(res => {
            setState(res.data)
        })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input type="text" value={title} onChange={(event) => setTitle(event.currentTarget.value)}
                   placeholder="task title"/>
            <input type="text" value={todolistId} onChange={(event) => setTodolistId(event.currentTarget.value)}
                   placeholder="todolist ID"/>
            <button onClick={onClickHandler}>Create Task</button>
        </div>
    </div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState('')
    const [taskId, setTaskId] = useState('')
    const [title, setTitle] = useState('')


    const model: ModelType = {
        title,
        description: '',
        status: 0,
        priority: 1,
        startDate: '',
        deadline: '',
    }

    const onClickHandler = () => {
        todolistAPI.updateTask(todolistId, taskId, model).then(res => {
            setState(res.data)
        })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input type="text" value={title} onChange={(event) => setTitle(event.currentTarget.value)}
                   placeholder="task title"/>
            <input type="text" value={todolistId} onChange={(event) => setTodolistId(event.currentTarget.value)}
                   placeholder="todolist ID"/>
            <input type="text" value={taskId} onChange={(event) => setTaskId(event.currentTarget.value)}
                   placeholder="task ID"/>
            <button onClick={onClickHandler}>Update Task</button>
        </div>

    </div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState('')
    const [taskId, setTaskId] = useState('')
    const onClickHandler = () => {
        todolistAPI.deleteTask(todolistId, taskId).then(res => {
            setState(res.data)
        })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input type="text" value={taskId} onChange={(event) => setTaskId(event.currentTarget.value)}
                   placeholder="task ID"/>
            <input type="text" value={todolistId} onChange={(event) => setTodolistId(event.currentTarget.value)}
                   placeholder="todolist ID"/>
            <button onClick={onClickHandler}>Delete Task</button>
        </div>
    </div>
}

