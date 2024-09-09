import { ReactNode } from 'react'
import styles from './card.module.css'

type CardProps = {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className = '' }: CardProps) => {
  return <div className={[styles.card, className].join(' ').trim()}>{children}</div>
}
