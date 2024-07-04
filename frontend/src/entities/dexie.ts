import { FileItem } from "@/graphql.generated"
import { IMap } from "./common"

export type FileItemLocal = {
  _id: string
  info: FileItem
  data: IMap
}