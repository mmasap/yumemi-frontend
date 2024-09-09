import { ReactNode } from 'react'
import styles from './center.module.css'

type CenterProps = {
  children: ReactNode
}

export const Center = ({ children }: CenterProps) => {
  return <div className={styles.center}>{children}</div>
}
