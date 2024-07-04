import { FileItemLocal, IMap } from '@/entities'
import Dexie, { type EntityTable } from 'dexie'

const localFile = new Dexie('lottie') as Dexie & {
  files: EntityTable<FileItemLocal, '_id'>
  settings: EntityTable<IMap, '_id'>
}

localFile.version(1).stores({
  files: '_id, data, info',
  settings: '_id, data'
})

export {
  localFile
}
