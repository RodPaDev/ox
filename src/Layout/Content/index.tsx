import { ParentProps } from 'solid-js'

export default function LayoutContent(props: ParentProps) {
  return <div class='Layout__Content'>{props.children}</div>
}
