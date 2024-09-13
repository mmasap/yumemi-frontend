import { Meta, StoryObj } from '@storybook/react'
import { Button } from '../button'
import { Dialog } from './dialog'

const meta: Meta<typeof Dialog> = {
  component: Dialog,
}

export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  args: {
    title: 'Title',
    children: 'This is a dialog',
    action: <Button>OK</Button>,
  },
}
