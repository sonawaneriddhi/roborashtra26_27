import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || ''
const dbName = process.env.MONGODB_DB_NAME || 'roborashtra'

let client
let clientPromise

if (!uri) {
  console.warn('⚠️ MONGODB_URI is not set in environment variables.')
} else {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so the MongoClient is not repeated on HMR
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    // In production, instantiate directly
    client = new MongoClient(uri)
    clientPromise = client.connect()
  }
}

export async function getDatabase() {
  if (!clientPromise) {
    throw new Error('MONGODB_URI is not configured in .env')
  }
  const connectedClient = await clientPromise
  return connectedClient.db(dbName)
}

export { clientPromise }
