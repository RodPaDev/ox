import { useState } from 'react'
import './index.css'
import clsx from 'clsx'

export default function Layout() {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleSidebar = () => {
    setIsExpanded(isExpanded => !isExpanded)
  }

  return (
    <div className='container'>
      <div className='content'>
        <div className='top-bar'></div>
        <div className='main-content'></div>
      </div>
      <div className={clsx('sidebar', isExpanded && 'expanded')}>
        <div className='sidebar-content'></div>
        <div className='sidebar-buttons'>
          <button className='sidebar-button' onClick={toggleSidebar}>
            •••
          </button>
        </div>
      </div>
    </div>
  )
}
