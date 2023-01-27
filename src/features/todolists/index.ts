import {asyncActions as todolistsAsyncActions, slice as todolistsSlice} from './todolists-reducer'
import * as todolistsSelectors from './selectors'

const todolistsActions = {
    ...todolistsAsyncActions,
    ...todolistsSlice.actions
}


export {
    todolistsActions,
    todolistsSelectors
}