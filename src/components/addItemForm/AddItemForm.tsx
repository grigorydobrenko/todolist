import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import {IconButton, TextField} from "@mui/material";
import {AddBox} from "@mui/icons-material";


export const AddItemForm = memo((props: AddItemFormPropsType) => {
    const {addItem} = props

    const [newTitle, setNewTitle] = useState('')
    const [error, setError] = useState<string | null>(null)


    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addNewItem()
        }
        if (error) {
            setError(null)
        }
    }

    const addItemHandler = () => {
        addNewItem()
    }

    const addNewItem = async () => {
        const trimmedTitle = newTitle.trim()

        if (trimmedTitle) {
            addItem(newTitle, {setError, setNewTitle})
        } else {
            setError('Title is required')
        }
    }

    return (
        <div>
            <TextField
                onChange={onChangeHandler}
                value={newTitle}
                onKeyDown={onKeyDownHandler}
                error={!!error}
                label='Title'
                helperText={error}
                variant="outlined"
                disabled={props.disabled}
                size="small"/>
            <IconButton color="primary" onClick={addItemHandler} disabled={props.disabled} sx={{marginLeft: '10px'}}>
                <AddBox/>
            </IconButton>
        </div>
    )
})

type AddItemFormPropsType = {
    addItem: (title: string, helper: AddItemFormSubmitHelperType) => void
    disabled?: boolean
}

export type AddItemFormSubmitHelperType = { setError: (error: string) => void, setNewTitle: (title: string) => void }