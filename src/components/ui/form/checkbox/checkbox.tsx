import { ComponentProps, ReactNode, useId } from 'react'
import styles from './checkbox.module.css'

type CheckboxProps = Omit<ComponentProps<'input'>, 'id' | 'className' | 'type'> & {
  children: ReactNode
}

export const Checkbox = ({ children, ...props }: CheckboxProps) => {
  const id = useId()
  return (
    <label className={styles.checkbox} htmlFor={id}>
      <input id={id} type="checkbox" {...props} />
      {children}
    </label>
  )
}
