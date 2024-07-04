import { FileItemLocal } from "@/entities";
import { FileItem, FileSearchInput } from "@/graphql.generated";
import { localFile, sleep } from "@/helper";
import { Context } from "..";

export const setSearchParams = async ({ state }: Context, vals: FileSearchInput) => {
  state.file.searchPayload = { ...vals }
}
export const resetSearchParams = async ({ state }: Context) => {
  state.file.searchPayload = {
    limit: 10,
    skip: 0
  }
}

export const gets = async ({ state, effects }: Context) => {
  if (state.app.isOffline) {
    const locales = await localFile.files
      .filter((item: FileItemLocal) => {
        item.info.name.includes(state.file.searchPayload.name ?? "")

        let nameFilter = true
        if (state.file.searchPayload.name) {
          nameFilter = item.info.name.toLowerCase().includes(state.file.searchPayload.name.toLowerCase())
        }

        let tagsFilter = true
        if ((state.file.searchPayload.tags?.length ?? 0) > 0) {
          tagsFilter = state.file.searchPayload.tags?.some((c) => item.info.tags.includes(c)) ?? true
        }

        let versionFilter = true
        if (state.file.searchPayload.version) {
          versionFilter = item.info.version === state.file.searchPayload.version
        }

        let framerateFilter = true
        if (state.file.searchPayload.framerate) {
          framerateFilter = item.info.framerate === state.file.searchPayload.framerate
        }

        let colorsFilter = true
        if ((state.file.searchPayload.colors?.length ?? 0) > 0) {
          colorsFilter = state.file.searchPayload.colors?.some((c) => item.info.colors.includes(c)) ?? true
        }

        return nameFilter && tagsFilter && versionFilter && framerateFilter && colorsFilter
      })
      .offset(state.file.searchPayload.skip ?? 0)
      .limit(state.file.searchPayload.limit ?? 10)
      .toArray()

    const count = await localFile.files
      .filter((item: FileItemLocal) => {
        item.info.name.includes(state.file.searchPayload.name ?? "")

        let nameFilter = true
        if (state.file.searchPayload.name) {
          nameFilter = item.info.name.toLowerCase().includes(state.file.searchPayload.name.toLowerCase())
        }

        let tagsFilter = true
        if ((state.file.searchPayload.tags?.length ?? 0) > 0) {
          tagsFilter = state.file.searchPayload.tags?.some((c) => item.info.tags.includes(c)) ?? true
        }

        let versionFilter = true
        if (state.file.searchPayload.version) {
          versionFilter = item.info.version === state.file.searchPayload.version
        }

        let framerateFilter = true
        if (state.file.searchPayload.framerate) {
          framerateFilter = item.info.framerate === state.file.searchPayload.framerate
        }

        let colorsFilter = true
        if ((state.file.searchPayload.colors?.length ?? 0) > 0) {
          colorsFilter = state.file.searchPayload.colors?.some((c) => item.info.colors.includes(c)) ?? true
        }

        return nameFilter && tagsFilter && versionFilter && framerateFilter && colorsFilter
      }).count()

    state.file.items = locales
    state.file.total = count

    return
  }

  const res = await effects.gql.queries.FILE_GETS({
    input: state.file.searchPayload
  })

  const items = res.fileSearch.items as FileItem[]
  state.file.total = res.fileSearch.total

  if (items.length > 0) {
    const promises: Promise<FileItemLocal>[] = []
    items.forEach((item) => {
      const pr = async (): Promise<FileItemLocal> => {
        return fetch('/files/' + item._id + '.json')
          .then(res => res.json())
          .then(data => ({
            _id: item._id,
            info: item,
            data: data
          }))
      }
      promises.push(pr())
    })
    await sleep(1000)
    const res = await Promise.all(promises)
    res.forEach((item) => {
      localFile.files.add(item)
    })
    state.file.items = [...res]
  } else {
    state.file.items = []
  }
}

export const getOptions = async ({ state, effects }: Context) => {
  const res = await effects.gql.queries.FILE_OPTIONS({})

  state.file.options = res.fileOptions
}