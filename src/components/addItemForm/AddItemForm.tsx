import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import {IconButton, TextField} from "@mui/material";
import {AddBox} from "@mui/icons-material";

type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}


const AddItemForm = memo((props: AddItemFormPropsType) => {
    const {addItem} = props

    const [newTitle, setNewTitle] = useState<string>('')
    const [error, setError] = useState<boolean>(false)


    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addNewItem()
        }
        if (error) {
            setError(false)
        }
    }


    const addItemHandler = () => {
        addNewItem()
    }

    const addNewItem = () => {
        const trimmedTitle = newTitle.trim()

        if (trimmedTitle) {
            addItem(newTitle)
            setNewTitle('')
            setError(false)
        } else {
            setError(true)
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
                helperText={error && 'Title is required'}
                variant="outlined"
                disabled={props.disabled}
                size="small"/>
            <IconButton color="primary" onClick={addItemHandler} disabled={props.disabled}>
                <AddBox/>
            </IconButton>
        </div>
    );
})

export default AddItemForm;