import { ReactNode } from 'react'
import styles from './backdrop.module.css'

type BackdropProps = {
  children: ReactNode
}

export const Backdrop = ({ children }: BackdropProps) => {
  return <div className={styles.backdrop}>{children}</div>
}
