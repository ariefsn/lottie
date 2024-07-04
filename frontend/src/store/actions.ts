import { localFile } from "@/helper";
import { Context } from ".";

export const onInitializeOvermind = async (ctx: Context) => {
  ctx.effects.gql.initialize({
    endpoint: "/graphql"
  }, {
    // TODO replace protocol to ws
    endpoint: "/graphql"
  })

  ctx.actions.file.getOptions().catch((err) => {
  })

  if (typeof window !== 'undefined') {
    ctx.actions.app.toggleOfflineStatus(localStorage.getItem('offline') === 'true')
  }

  // PING Interval
  setInterval(() => {
    ctx.effects.gql.queries.PING().then(async (res) => {
      const isOffline = ctx.state.app.isOffline
      if (isOffline) {
        ctx.actions.app.toggleOfflineStatus(false)
        await localFile.files.clear()
        if (typeof window !== 'undefined') {
          localStorage.removeItem('offline')
          location.reload()
        }
        return
      }
    }).catch((err) => {
      const isOffline = ctx.state.app.isOffline
      if (!isOffline) {
        ctx.actions.app.toggleOfflineStatus(true)
        if (typeof window !== 'undefined') {
          localStorage.setItem('offline', 'true')
          location.reload()
        }
      }
    })
  }, 1000)
}

export { };
