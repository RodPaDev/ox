import { ParentProps, createSignal } from 'solid-js'

import TopBar from './TopBar'
import LayoutContent from './Content'
import Sidebar from './Sidebar'
import SidebarInspector from './Sidebar/SidebarInspector'
import SidebarIcons from './Sidebar/SidebarIcons'
import './index.scss'

export default function Layout(props: ParentProps) {
  const [isExpanded, setIsExpanded] = createSignal(false)

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded())
  }

  return (
    <div class='Layout'>
      <div class='Layout__Wrapper'>
        <TopBar />
        <LayoutContent>{props.children}</LayoutContent>
      </div>
      <Sidebar>
        <SidebarInspector />
        <SidebarIcons />
      </Sidebar>
    </div>
  )
}
