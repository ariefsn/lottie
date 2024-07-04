import { MongoClient } from 'mongodb'

export const newMongoClient = (connString: string) => new MongoClient(connString)