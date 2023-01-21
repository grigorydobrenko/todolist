import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import EditableSpan from "./EditableSpan";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolist/EditableSpan',
    component: EditableSpan,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    args: {
        value: 'editableSpan',


    },
    argTypes: {
        value: {
            defaultValue: 'val',
            description: 'fsfef'
        },
        callBack: {
            description: 'edit val'
        }
    }

} as ComponentMeta<typeof EditableSpan>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args} />;

export const EditableSpanTaskTitleStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
EditableSpanTaskTitleStory.args = {
    callBack: action('ChangeTask')
};

export const EditableSpanTLTitleStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
EditableSpanTLTitleStory.args = {
    callBack: action('ChangeTodolist')
};


