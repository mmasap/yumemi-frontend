import { ReactNode } from 'react'
import styles from './dialog.module.css'
import { Backdrop } from '../backdrop'

type DialogProps = {
  title: string
  action: ReactNode
  children: ReactNode
}

export const Dialog = ({ children, title, action }: DialogProps) => {
  return (
    <Backdrop>
      <div className={styles.modal}>
        <p className={styles.title}>{title}</p>
        {children}
        <div className={styles.action}>{action}</div>
      </div>
    </Backdrop>
  )
}
