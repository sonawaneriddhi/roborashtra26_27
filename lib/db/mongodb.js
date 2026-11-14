import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || ''
const dbName = process.env.MONGODB_DB_NAME || 'roborashtra'

let clientPromise

/**
 * Create the MongoDB connection lazily.
 *
 * Connecting at module scope meant importing an API route during
 * `next build` immediately opened a socket to Atlas. That produced
 * noisy build-time DNS errors (and could bake a connection attempt into
 * a static export). Connections should only happen on a real request.
 */
function getClientPromise() {
  if (!uri) {
    throw new Error('MONGODB_URI is not configured in .env')
  }

  if (process.env.NODE_ENV === 'development') {
    // Reuse the client across HMR reloads in development.
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect()
    }
    return global._mongoClientPromise
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect()
  }
  return clientPromise
}

export async function getDatabase() {
  const connectedClient = await getClientPromise()
  return connectedClient.db(dbName)
}
