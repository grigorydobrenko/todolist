import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import {ActionCreatorsMapObject, bindActionCreators} from "redux";
import {useMemo} from "react";
import {AppDispatch, AppRootState} from "../app/store";

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T) {
    const dispatch = useDispatch()
    return useMemo(
        () => {
            return bindActionCreators(actions, dispatch)
        }, [])
}