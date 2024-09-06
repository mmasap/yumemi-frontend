import { Meta, StoryObj } from '@storybook/react'

import { Select } from './select'

const meta: Meta<typeof Select> = {
  component: Select,
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: {
    children: 'Select',
  },
}
