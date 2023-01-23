import {
    addTodolistAC, changeTodolistFilterAC,
    changeTodolistTitleAC,
    FilterType, removeTodolistAC,
    TodoListDomainType,
    todolistsReducer
} from '../todolists-reducer'
import {v1} from 'uuid'

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
    const endState = todolistsReducer(startState, removeTodolistAC({id: todolistId1}))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    const newTodolistTitle = 'new Todo'

    const newTodolist = {
        id: '1',
        title: newTodolistTitle,
        order: 0,
        addedDate: ''
    }

    const action = addTodolistAC({todolist: newTodolist})

    const endState = todolistsReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodolistTitle)
})


test('correct todolist should change its name', () => {
    const newTodolistTitle = 'New Todolist'

    const endState = todolistsReducer(startState, changeTodolistTitleAC({id: todolistId2, newTitle: newTodolistTitle}))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})


test('correct filter of todolist should be changed', () => {
    const newFilter: FilterType = 'completed'

    const endState = todolistsReducer(startState, changeTodolistFilterAC({id: todolistId1, filter: newFilter}))

    expect(endState[0].filter).toBe(newFilter)
    expect(endState[1].filter).toBe('all')
})



