import React from 'react'
import {ComponentMeta, ComponentStory} from '@storybook/react'
import {action} from "@storybook/addon-actions"
import TaskComponent from "./TaskComponent"
import {ReduxStoreProviderDecorator} from "../../../../stories/decorators/ReduxStoreProviderDecorator";
import {TaskPriorities, TaskStatuses} from "../../../../api/types";


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolist/TaskComponent',
    component: TaskComponent,
    decorators: [ReduxStoreProviderDecorator],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    args: {
        changeTaskStatus: action('changeTaskStatus'),
        removeTask: action('removeTask'),
        ChangeTaskTitle: action('ChangeTaskTitle'),
        todolistId: '1111',
        task: {
            id: '1', title: 'js', status: TaskStatuses.Completed,
            description: '',
            priority: TaskPriorities.Low,
            startDate: '',
            deadline: '',
            todoListId: '1111',
            order: 0,
            addedDate: ''
        }

    }
} as ComponentMeta<typeof TaskComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TaskComponent> = (args) => <TaskComponent {...args} />;

export const TaskIsDoneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsDoneStory.args = {};

export const TaskIsNotDoneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsNotDoneStory.args = {
    task: {
        id: '2', title: 'ts', status: TaskStatuses.New, description: '',
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: '1111',
        order: 0,
        addedDate: ''
    }
};

