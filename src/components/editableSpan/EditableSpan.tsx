import React, {ChangeEvent, useState} from 'react';
import {TextField} from "@mui/material";

export const EditableSpan = React.memo((props: EditableSpanPropsType) => {
    const {value, callBack, disabled} = props

    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(value)

    const ActivateEditMode = () => {
        setEditMode(!editMode)
        callBack(title)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return (
        editMode ?
            <TextField
                onChange={onChangeHandler}
                value={title}
                onBlur={ActivateEditMode}
                autoFocus
                variant="outlined"
                size="small"
            />
            :
            disabled ? <span>{value}</span> : <span onDoubleClick={ActivateEditMode}>{value}</span>
    )
})

type EditableSpanPropsType = {
    value: string
    callBack: (newTitle: string) => void
    disabled: boolean
}

