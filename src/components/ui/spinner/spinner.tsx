import { CgSpinner } from 'react-icons/cg'
import { ComponentProps } from 'react'
import styles from './spinner.module.css'

type SpinnerProps = Omit<ComponentProps<typeof CgSpinner>, 'color'> & {
  variant?: 'primary'
}

export const Spinner = ({
  size = '1rem',
  variant = 'primary',
  className = '',
  ...props
}: SpinnerProps) => {
  const style = getComputedStyle(document.body)

  return (
    <CgSpinner
      color={style.getPropertyValue(`--color-${variant}`)}
      className={[styles.spinner, className].join(' ').trim()}
      size={size}
      {...props}
    />
  )
}
