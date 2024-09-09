import { ReactNode } from 'react'
import styles from './app-layout.module.css'

type AppLayoutProps = {
  children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className={styles['app-layout']}>
      <header>都道府県グラフ</header>
      <main>{children}</main>
    </div>
  )
}
