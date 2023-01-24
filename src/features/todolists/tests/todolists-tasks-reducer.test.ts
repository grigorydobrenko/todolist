import {tasksReducer, TasksStateType} from "../tasks-reducer"
import {createTodolist, TodoListDomainType, todolistsReducer} from "../todolists-reducer"

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodoListDomainType> = []

    const todolist: TodoListDomainType = {
        id: '1',
        title: 'newTodolistTitle',
        order: 0,
        addedDate: '',
        entityStatus: 'idle',
        filter: 'all'
    }

    const action = createTodolist.fulfilled({todolist}, 'requestId', todolist.title)

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolist.id)
    expect(idFromTodolists).toBe(action.payload.todolist.id)
})
