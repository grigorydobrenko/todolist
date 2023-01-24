import {createTask, deleteTask, tasksReducer, TasksStateType, updateTask} from '../tasks-reducer'
import {createTodolist, removeTodolist} from "../todolists-reducer"
import {TaskPriorities, TaskStatuses} from "../../../api/todolist-api"


let startState: TasksStateType

beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1', title: 'CSS', status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                entityStatus: "idle"
            },
            {
                id: '2', title: 'JS', status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                entityStatus: "idle"
            },
            {
                id: '3', title: 'React', status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                entityStatus: "idle"
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread', status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: '',
                entityStatus: "idle"
            },
            {
                id: '2', title: 'milk', status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: '',
                entityStatus: "idle"
            },
            {
                id: '3', title: 'tea', status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: '',
                entityStatus: "idle"
            }
        ]
    }
})


test('correct task should be deleted from correct array', () => {

    const param = {todolistId: 'todolistId2', taskId: '2'}

    const action = deleteTask.fulfilled(param, 'requestId', param)
    const endState = tasksReducer(startState, action)
    expect(endState).toEqual({
        'todolistId1': [
            {
                id: '1', title: 'CSS', status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                entityStatus: "idle"

            },
            {
                id: '2', title: 'JS', status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                entityStatus: "idle"
            },
            {
                id: '3', title: 'React', status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                entityStatus: "idle"
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread', status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: '',
                entityStatus: "idle"
            },
            {
                id: '3', title: 'tea', status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: '',
                entityStatus: "idle"
            }
        ]
    })
})

test('correct task should be added to correct array', () => {

    const task = {
        id: 'id',
        title: 'Angular',
        status: TaskStatuses.New,
        todoListId: 'todolistId1',
        startDate: '',
        addedDate: '',
        deadline: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
    }

    const action = createTask.fulfilled(task, 'requestId', {todolistId: task.todoListId, title: task.title})

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(4)
    expect(endState['todolistId2'].length).toBe(3)
    expect(endState['todolistId1'][0].id).toBeDefined()
    expect(endState['todolistId1'][0].title).toBe('Angular')
    expect(endState['todolistId1'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {
    const updateModel = {todolistId: 'todolistId2', taskId: '2', value: {status: TaskStatuses.New}}

    const action = updateTask.fulfilled(updateModel, 'requestId', updateModel)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
})

test('task title should be changed', () => {
    const updateModel = {taskId: '1', todolistId: 'todolistId2', value: {title: 'salt'}}

    const action = updateTask.fulfilled(updateModel, 'requestId', updateModel)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][0].title).toBe('salt')
    expect(endState['todolistId1'][0].title).toBe('CSS')
})


test('new array should be added when new todolist is added', () => {

    let todolist = {
        id: '1',
        title: 'newTodolistTitle',
        order: 0,
        addedDate: ''
    };

    const action = createTodolist.fulfilled({todolist}, 'requestId', todolist.title)

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')

    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {
    const action = removeTodolist.fulfilled({id: 'todolistId2'}, 'requestId', 'todolistId2')
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})






