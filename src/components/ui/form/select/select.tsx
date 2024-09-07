import { ComponentProps, ReactNode } from 'react'
import styles from './select.module.css'

type Option = {
  label: ReactNode
  value: string | number | string[]
}

type SelectProps = Omit<ComponentProps<'select'>, 'className'> & {
  options: Option[]
}

export const Select = ({ options, ...props }: SelectProps) => {
  return (
    <select className={styles.select} {...props}>
      {options.map(({ label, value }) => (
        <option key={label?.toString()} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
}
