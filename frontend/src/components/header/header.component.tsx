import { Link } from "react-router-dom"
import styles from './header.component.module.scss'
export const Menu = () => {
    return (
        <div className={styles['header_wrapper']}>
            <Link to='/tasks'>Tasks</Link>
            <Link to='/users'>Users</Link>
            <Link to='/labels'>Labels</Link>
        </div>
    )
}