import {asyncActions as tasksAsyncActions, slice as tasksSlice} from './tasks-reducer'
import * as tasksSelectors from './selectors'


const tasksActions = {
    ...tasksAsyncActions,
    ...tasksSlice.actions
}

export {
    tasksActions,
    tasksSelectors
}