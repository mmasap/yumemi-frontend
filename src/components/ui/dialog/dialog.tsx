import { ReactNode } from 'react'
import { Backdrop } from '../backdrop'
import styles from './dialog.module.css'

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
