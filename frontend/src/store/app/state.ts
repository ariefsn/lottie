import { IAppNotification, TAppTheme } from "@/entities"
import { derived } from "overmind"

export type AppState = {
  isLoading: boolean
  theme: TAppTheme
  isDarkMode: boolean
  notifications: IAppNotification[]
  isSpotlightOpened: boolean
  isFormRegisterOpened: boolean
  isFormUploadOpened: boolean
  isOffline: boolean
}

export const state: AppState = {
  isLoading: true,
  theme: 'light',
  isDarkMode: derived((state: AppState) => state.theme === 'dark'),
  notifications: [],
  isSpotlightOpened: false,
  isFormRegisterOpened: false,
  isFormUploadOpened: false,
  isOffline: false
}
