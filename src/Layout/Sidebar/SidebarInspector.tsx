import { ParentProps } from 'solid-js'

export default function SidebarInspector(props: ParentProps) {
  return <div class='Layout__Sidebar__Inspector'>{props.children}</div>
}
