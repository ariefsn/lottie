import { TOpr } from "./common"

export type TAppTheme = 'light' | 'dark'

export interface IAppConfig {
  theme: TAppTheme
  loading: boolean
}

export interface IPathFilter {
  opr: TOpr
  path: string
}

export type TAppNotificationType = 'success' | 'error' | 'info' | 'warning'

export interface IAppNotification {
  id?: string
  title: string | React.ReactNode
  icon?: React.ReactNode
  message: string
  type?: TAppNotificationType
  onClose?: () => void
}

export interface INavLinkItem {
  label: string
  link?: string
  children?: INavLinkItem[]
}
