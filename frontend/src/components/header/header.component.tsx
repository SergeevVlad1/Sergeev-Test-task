import { NavLink } from "react-router-dom"
import styles from './header.component.module.scss'

export const Menu = () => {
    return (
        <header className={styles['header_wrapper']}>
            <div className={styles['header_container']}>
                <div className={styles['header_brand']}>
                    <span className={styles['header_icon']}>⚡</span>
                    <span className={styles['header_title']}>TaskFlow</span>
                    <span className={styles['header_badge']}>PRO</span>
                </div>
                <nav className={styles['header_nav']}>
                    <NavLink 
                        to='/tasks' 
                        className={({ isActive }) => 
                            `${styles['nav_link']} ${isActive ? styles['active'] : ''}`
                        }
                    >
                        Tasks
                    </NavLink>
                    <NavLink 
                        to='/users' 
                        className={({ isActive }) => 
                            `${styles['nav_link']} ${isActive ? styles['active'] : ''}`
                        }
                    >
                        Users
                    </NavLink>
                    <NavLink 
                        to='/labels' 
                        className={({ isActive }) => 
                            `${styles['nav_link']} ${isActive ? styles['active'] : ''}`
                        }
                    >
                        Labels
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}