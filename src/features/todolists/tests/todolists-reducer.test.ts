import {
    changeTodolistFilterAC, FilterType,
    TodoListDomainType,
    todolistsReducer
} from '../todolists-reducer'
import {v1} from 'uuid'
import {changeTodolistTitle, createTodolist, removeTodolist} from "../todolist-actions";

let todolistId1: string
let todolistId2: string
let startState: Array<TodoListDomainType>


beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()

    startState = [
        {
            id: todolistId1, title: 'What to learn', filter: 'all',
            addedDate: '',
            order: 0, entityStatus: 'idle'
        },
        {
            id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '',
            order: 0, entityStatus: 'idle'
        }
    ]
})

test('correct todolist should be removed', () => {
    const action = removeTodolist.fulfilled({id: todolistId1}, 'requestId', todolistId1)

    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    const newTodolistTitle = 'new Todo'

    const todolist = {
        id: '1',
        title: newTodolistTitle,
        order: 0,
        addedDate: ''
    }

    const action = createTodolist.fulfilled({todolist}, 'requestId', todolist.title)

    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodolistTitle)
})


test('correct todolist should change its name', () => {
    const newTodolistTitle = 'New Todolist'

    const payload = {id: todolistId2, title: newTodolistTitle}

    const endState = todolistsReducer(startState, changeTodolistTitle.fulfilled(payload, 'requestId', {
        todolistId: todolistId2,
        title: newTodolistTitle
    }))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})


test('correct filter of todolist should be changed', () => {
    const newFilter: FilterType = 'completed'

    const endState = todolistsReducer(startState, changeTodolistFilterAC({id: todolistId1, filter: newFilter}))

    expect(endState[0].filter).toBe(newFilter)
    expect(endState[1].filter).toBe('all')
})



