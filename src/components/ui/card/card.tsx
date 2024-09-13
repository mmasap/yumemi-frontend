import styles from './card.module.css'

type CardProps = React.HTMLAttributes<HTMLDivElement>

export const Card = ({ className = '', ...props }: CardProps) => {
  return <div className={[styles.card, className].join(' ').trim()} {...props} />
}
