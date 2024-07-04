import { Context } from ".."

export const api = {
  gets: (ctx: Context) => {
    return ctx.state.file.items
  }
}