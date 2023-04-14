export interface Notification {
    content: string,
    timeout?: number,
    location?: Anchor,
    color?: string,
    btnColor?: string,
    btnIcon?: string,
    visible?: boolean
}

// Taken from https://github.com/vuetifyjs/vuetify/blob/9871b8c63ae3e3cb73a97cc7f609472856700a07/packages/vuetify/src/util/anchor.ts#L7-L13
const block = ['top', 'bottom'] as const
const inline = ['start', 'end', 'left', 'right'] as const
type Tblock = typeof block[number]
type Tinline = typeof inline[number]
export type Anchor =
  | Tblock
  | Tinline
  | 'center'
  | 'center center'
  | `${Tblock} ${Tinline | 'center'}`
  | `${Tinline} ${Tblock | 'center'}`