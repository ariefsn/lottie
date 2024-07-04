import { DIRS, FILE_EXTENSIONS, getLottieMetadata } from '@helper'
import { TMap, TPayload, TUpload } from "@types"
import { lottie } from '@validator'
import fs from 'fs'
import { MercuriusContext } from "mercurius"
import { ObjectId } from 'mongodb'
import path from 'path'
import stream from 'stream'
import util from 'util'
import { FileCreateInput, FileItem, FileOptionsResult, FileSearchInput, FileSearchResult, User, UserInput } from "./generated"

const pipeline = util.promisify(stream.pipeline)

if (!fs.existsSync(DIRS.UPLOADS)) {
  fs.mkdirSync(DIRS.UPLOADS)
}

export default {
  Query: {
    ping: async (_: any, payload: TPayload<FileSearchInput>, { pubsub }: MercuriusContext) => {
      pubsub.publish({
        topic: 'PING',
        payload: {
          ping: new Date()
        }
      })
      return 'pong'
    },
    fileSearch: async (_: any, payload: TPayload<FileSearchInput>, context: MercuriusContext): Promise<FileSearchResult> => {
      const client = context.mongo()
      await client.connect()

      const input = payload.input

      const $match: TMap = {}
      if (input.name) {
        $match['name'] = { $regex: `.*${input.name.toLowerCase()}.*`, $options: 'i' }
      }

      if (input.version) {
        $match['version'] = { $eq: input.version }
      }

      if ((input.tags?.length ?? 0) > 0) {
        $match['tags'] = { $in: input.tags }
      }

      if ((input.colors?.length ?? 0) > 0) {
        $match['colors'] = { $in: input.colors }
      }

      if (input.framerate) {
        $match['framerate'] = { $eq: input.framerate }
      }

      const pipelines = [
        { $match },
        { $skip: input.skip },
        { $limit: input.limit },
        {
          $lookup: {
            "from": "users",
            "localField": "createdBy",
            "foreignField": "_id",
            "as": "createdBy"
          }
        }, {
          $unwind: {
            "path": "$createdBy"
          }
        }
      ]

      const [cursor, count] = await Promise.all(
        [
          client.db().collection('files').aggregate(pipelines),
          client.db().collection('files').countDocuments($match),
        ]
      )

      const items: FileItem[] = []
      for await (const doc of cursor) {
        items.push(doc as FileItem)
      }

      client.close()

      return {
        total: count,
        items
      }
    },
    fileOptions: async (_: any, payload: TPayload, context: MercuriusContext): Promise<FileOptionsResult> => {
      const client = context.mongo()
      await client.connect()

      const pipelines = {
        "versions": [{
          $project: {
            "version": 1
          },
        }, {
          $group: {
            "_id": "$version",
            "version": {
              "$first": "$version"
            }
          }
        }, {
          $sort: {
            "version": 1
          }
        }],
        "tags": [{
          $project: {
            "_id": 1,
            "tag": "$tags"
          },
        }, {
          $unwind: {
            "path": "$tag"
          },
        }, {
          $group: {
            "_id": "$tag",
            "tag": {
              "$first": "$tag"
            }
          }
        }, {
          $sort: {
            "tag": 1
          }
        }],
        "framerates": [{
          $project: {
            "_id": 1,
            "framerate": "$framerate"
          },
        }, {
          $group: {
            "_id": "$framerate",
            "framerate": {
              "$first": "$framerate"
            }
          }
        }, {
          $sort: {
            "framerate": 1
          }
        }]
      }

      const [cursorTags, cursorVersions, cursorFramerates] = await Promise.all(
        [
          client.db().collection('files').aggregate(pipelines.tags),
          client.db().collection('files').aggregate(pipelines.versions),
          client.db().collection('files').aggregate(pipelines.framerates),
        ]
      )

      const tags: string[] = []
      for await (const doc of cursorTags) {
        tags.push(String(doc.tag))
      }

      const versions: string[] = []
      for await (const doc of cursorVersions) {
        versions.push(String(doc.version))
      }

      const framerates: string[] = []
      for await (const doc of cursorFramerates) {
        framerates.push(String(doc.framerate))
      }

      client.close()

      return {
        tags,
        versions,
        framerates
      }
    },
    userGet: async (_: any, payload: TPayload<String>, context: MercuriusContext): Promise<User> => {
      const client = context.mongo()
      await client.connect()

      const input = payload.input

      const $match: TMap = {}
      if (!input) {
        throw new Error('email is required')
      }
      $match['email'] = { $eq: input }

      const user = await client.db().collection('users').findOne($match)
      client.close()

      if (!user) {
        throw new Error('user not found')
      }

      return user as User
    }
  },
  Mutation: {
    fileCreate: async (_: any, payload: TPayload<FileCreateInput>, context: MercuriusContext): Promise<FileItem> => {
      const input = payload.input
      const id = new ObjectId()

      if (!input.creator) {
        throw new Error('email is required')
      }

      if (!input.file) {
        throw new Error('file is required')
      }

      if (!input.name) {
        throw new Error('name is required')
      }

      if (!input.tags) {
        throw new Error('tags is required')
      }

      const f: TUpload = (await input.file).file
      const ext = FILE_EXTENSIONS[f.mimetype]
      if (!ext) {
        throw new Error('invalid file type')
      }

      const fileName = id + '.' + ext
      const filePath = path.join(DIRS.UPLOADS, fileName)
      const rs = f.createReadStream()
      const ws = fs.createWriteStream(filePath)
      await pipeline(rs, ws)

      const jsonString = fs.readFileSync(filePath, 'utf8')
      const jsonObj = JSON.parse(jsonString)

      const valid = lottie(jsonObj)
      if (!valid) {
        const errors = lottie.errors ?? []
        let message = 'invalid lottie file'
        if (errors.length > 0) {
          message = errors[0].message ?? message
        }
        throw new Error(message)
      }

      const metadata = await getLottieMetadata(jsonString)
      const fileSize = metadata.fileSize

      let formated = ''
      if (fileSize) {
        switch (typeof fileSize.formated) {
          case "string":
            formated = fileSize.formated
            break;

          case "number":
            formated = fileSize.formated.toFixed(2)
            break;

          case "object":
            const isArray = Array.isArray(fileSize.formated)
            if (!isArray) {
              const m = (fileSize.formated as TMap)
              formated = (m.value ?? 0) + ' ' + (m.unit ?? '')
            }
            break;

          default:
            break;
        }
      }

      const newData: TMap = {
        _id: id,
        tags: input.tags,
        ...metadata,
        colors: Array.from(metadata.colors),
        name: input.name,
        fileSize: {
          bytes: fileSize?.bytes ?? 0,
          formated
        },
        likes: [],
        downloads: 0,
        createdAt: Date.now(),
        createdBy: '',
      }

      const client = await context.mongo().connect()
      const sess = client.startSession()
      sess.startTransaction()
      const user = await client.db().collection('users').findOne({ email: input.creator })
      newData.createdBy = user?._id
      await client.db().collection('files').insertOne(newData)
      await sess.commitTransaction()
      await sess.endSession()
      client.close()
      newData.createdBy = user as User
      return newData as FileItem
    },
    userCreate: async (_: any, payload: TPayload<UserInput>, context: MercuriusContext): Promise<User> => {
      const input = payload.input

      if (!input.email) {
        throw new Error('email is required')
      }

      if (!(/^\S+@\S+$/.test(input.email))) {
        throw new Error('invalid email')
      }

      if (!input.firstName) {
        throw new Error('firstName is required')
      }

      if (!input.lastName) {
        throw new Error('lastName is required')
      }

      const newData = {
        _id: new ObjectId(),
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        createdAt: Date.now(),
      } as User

      const client = await context.mongo().connect()
      const existing = await client.db().collection('users').findOne({ email: { $eq: input.email } })
      if (existing) {
        throw new Error('email already registered')
      }
      await client.db().collection('users').insertOne(newData)
      client.close()

      return newData
    }
  },
  Subscription: {
    ping: {
      subscribe: (_root: any, _args: any, { pubsub }: MercuriusContext) => {
        pubsub.publish({
          topic: 'PING',
          payload: {
            ping: new Date()
          }
        })
        return pubsub.subscribe('PING')
      }
    }
  }
}