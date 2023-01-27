import React from 'react'
import {ComponentMeta, ComponentStory} from '@storybook/react'
import App from "./App"
import {HashRouterDecorator, ReduxStoreProviderDecorator} from "../stories/decorators/ReduxStoreProviderDecorator"

export default {
    title: 'Todolist/App',
    component: App,
    decorators: [ReduxStoreProviderDecorator, HashRouterDecorator]

} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <App/>;

export const AppWithReduxStory = Template.bind({});


