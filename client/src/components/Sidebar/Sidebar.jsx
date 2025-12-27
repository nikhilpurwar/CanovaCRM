import { Link } from 'react-router-dom'
import './sidebar.css'
import { useState } from 'react'

const Sidebar = () => {
    const [selected, setSelected] = useState("dashboard")

    let menuItems = [
        { id: "dashboard", label: "Dashboard", title: "Dashboard" },
        { id: "leads", label: "Leads", title: "Leads" },
        { id: "employees", label: "Employees", title: "Employees" },
        { id: "settings", label: "Settings", title: "Settings" },
    ]

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
        </div>
    )
}

export default Sidebar