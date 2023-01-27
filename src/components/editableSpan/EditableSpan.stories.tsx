import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {EditableSpan} from "./EditableSpan";

export default {
    title: 'Todolist/EditableSpan',
    component: EditableSpan,
    args: {
        value: 'editableSpan',

    },
    argTypes: {
        value: {
            defaultValue: 'val',
            description: 'valDesc'
        },
        callBack: {
            description: 'edit val'
        }
    }

} as ComponentMeta<typeof EditableSpan>;

const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args} />;

export const EditableSpanTaskTitleStory = Template.bind({});
EditableSpanTaskTitleStory.args = {
    callBack: action('ChangeTask')
};

export const EditableSpanTLTitleStory = Template.bind({});
EditableSpanTLTitleStory.args = {
    callBack: action('ChangeTodolist')
};


