import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './sidebar.css'
import { useState } from 'react'
import { logout } from '../../redux/slices/authSlice'

const Sidebar = () => {
    const [selected, setSelected] = useState("dashboard")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth)

    let menuItems = [
        { id: "dashboard", label: "Dashboard", title: "Dashboard" },
        { id: "leads", label: "Leads", title: "Leads" },
        { id: "employees", label: "Employees", title: "Employees" },
        { id: "settings", label: "Settings", title: "Settings" },
    ]

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            dispatch(logout())
            navigate('/login')
        }
    }

    return (
        <div className='sidebar'>
            <div className='header'>
                Canova<span>CRM</span>
            </div>
            <aside>
                <ul className='menuItems'>
                    {menuItems.map((items) => (
                        <li 
                            key={items.id} 
                            className={selected === items.id ? 'item-active' : 'item'}
                        >
                            <Link
                                onClick={() => setSelected(items.id)}
                                to={ items.id === "dashboard" ? '/' : `/${items.id}`}
                                title={items.title}
                            >
                                {items.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
            <div className='sidebarFooter'>
                {user && (
                    <div className='userInfo'>
                        <div className='avatar'>
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                        <div className='userDetails'>
                            <p className='userName'>{user.firstName} {user.lastName}</p>
                            <p className='userEmail'>{user.email}</p>
                        </div>
                    </div>
                )}
                <button onClick={handleLogout} className='logoutBtn'>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Sidebar