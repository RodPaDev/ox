import { ParentProps } from 'solid-js'

export default function Sidebar(props: ParentProps) {
  return <div class='Layout__Sidebar'>{props.children}</div>
}
