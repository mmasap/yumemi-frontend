import { Meta, StoryObj } from '@storybook/react'

import { Backdrop } from './backdrop'

const meta: Meta<typeof Backdrop> = {
  component: Backdrop,
}

export default meta
type Story = StoryObj<typeof Backdrop>

export const Default: Story = {
  args: {},
}
