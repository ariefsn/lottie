import { IAppNotification, TAppTheme } from "@/entities";
import { Context } from "..";

const toggleLoading = ({ state }: Context, isLoading?: boolean) => {
  let newVal = isLoading ?? !state.app.isLoading
  if (state.app.isSpotlightOpened) {
    newVal = false
  }
  state.app.isLoading = newVal
}

const setTheme = ({ state }: Context, theme: TAppTheme) => {
  state.app.theme = theme
}

const pushNotif = ({ state }: Context, notif: IAppNotification) => {
  if (!notif.id) {
    notif.id = Date.now().toString()
  }

  state.app.notifications.push(notif)
}

const clearNotif = ({ state }: Context) => {
  state.app.notifications = []
}

const closeNotif = ({ state }: Context, notifId: string) => {
  const idx = state.app.notifications.findIndex(n => n.id === notifId)

  if (idx >= 0) {
    state.app.notifications.splice(idx, 1)
  }
}

const setIsSpotlightOpened = ({ state }: Context, isOpened: boolean) => {
  state.app.isSpotlightOpened = isOpened
}

const toggleFormRegister = ({ state }: Context, isOpened: boolean) => {
  state.app.isFormRegisterOpened = isOpened
}

const toggleFormUpload = ({ state }: Context, isOpened: boolean) => {
  state.app.isFormUploadOpened = isOpened
}

const toggleOfflineStatus = ({ state }: Context, isOffline: boolean) => {
  state.app.isOffline = isOffline
}

export { clearNotif, closeNotif, pushNotif, setIsSpotlightOpened, setTheme, toggleFormRegister, toggleFormUpload, toggleLoading, toggleOfflineStatus };

