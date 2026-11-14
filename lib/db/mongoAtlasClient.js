/**
 * lib/db/mongoAtlasClient.js
 * ──────────────────────────
 * Lightweight, resilient HTTPS client for MongoDB Atlas Data API.
 * Designed for Next.js static exports and edge environments (Cloudflare Pages)
 * without requiring a long-running Node.js TCP socket server.
 *
 * Configurable via:
 * - Environment variables (NEXT_PUBLIC_MONGODB_ATLAS_API_KEY, NEXT_PUBLIC_MONGODB_ATLAS_ENDPOINT, etc.)
 * - Or runtime credentials configured through the Admin Database Gateway.
 *
 * If credentials are missing or offline, methods fail gracefully with detailed
 * diagnostic codes instead of throwing unhandled exceptions.
 */

const DEFAULT_CONFIG = {
  endpoint:
    process.env.NEXT_PUBLIC_MONGODB_ATLAS_ENDPOINT ||
    'https://data.mongodb-api.com/app/data-roborashtra/endpoint/data/v1',
  cluster: process.env.NEXT_PUBLIC_MONGODB_ATLAS_CLUSTER || 'Cluster0',
  database: process.env.NEXT_PUBLIC_MONGODB_DATABASE || 'roborashtra',
  apiKey: process.env.NEXT_PUBLIC_MONGODB_ATLAS_API_KEY || '',
}

class MongoAtlasClient {
  constructor(customConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...customConfig }
  }

  /**
   * Update or override runtime credentials (e.g. entered via Admin UI)
   */
  configure(newConfig = {}) {
    this.config = {
      ...this.config,
      ...newConfig,
    }
  }

  getConfig() {
    return {
      endpoint: this.config.endpoint,
      cluster: this.config.cluster,
      database: this.config.database,
      isKeyConfigured: Boolean(this.config.apiKey && this.config.apiKey.trim().length > 0),
    }
  }

  /**
   * Internal helper to execute Data API actions via HTTPS fetch.
   */
  async _request(action, body = {}) {
    const { apiKey, endpoint, cluster, database } = this.config

    if (!apiKey || !apiKey.trim()) {
      return {
        success: false,
        reason: 'NOT_CONFIGURED',
        error: 'MongoDB Atlas API Key is not configured. Add NEXT_PUBLIC_MONGODB_ATLAS_API_KEY or configure in Admin.',
      }
    }

    // Clean endpoint URL
    const baseUrl = endpoint.replace(/\/+$/, '')
    const actionUrl = `${baseUrl}/action/${action}`

    const payload = {
      dataSource: cluster,
      database: database,
      ...body,
    }

    try {
      const response = await fetch(actionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'api-key': apiKey.trim(),
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        return {
          success: false,
          reason: 'HTTP_ERROR',
          status: response.status,
          error: `Atlas Data API responded with status ${response.status}: ${errorText || response.statusText}`,
        }
      }

      const data = await response.json().catch(() => ({}))
      return {
        success: true,
        data,
      }
    } catch (err) {
      return {
        success: false,
        reason: 'NETWORK_ERROR',
        error: err.message || 'Network request to MongoDB Atlas Data API failed.',
      }
    }
  }

  /**
   * Diagnostic test: verifies reachability and API key authentication.
   */
  async testConnection() {
    if (!this.config.apiKey || !this.config.apiKey.trim()) {
      return {
        success: false,
        reason: 'NOT_CONFIGURED',
        message: 'No API Key found. Operating in local storage cache mode.',
      }
    }

    // Ping by running a lightweight findOne on system metadata or leads collection
    const result = await this._request('findOne', {
      collection: '_healthcheck',
      filter: {},
    })

    if (result.success) {
      return {
        success: true,
        message: 'Connected to MongoDB Atlas cluster successfully.',
      }
    }

    // If _healthcheck doesn't exist, Atlas might return 200 with document: null which is still a success!
    if (result.reason === 'HTTP_ERROR' && result.status === 404) {
      // 404 on custom endpoint implies invalid endpoint path
      return {
        success: false,
        reason: 'INVALID_ENDPOINT',
        message: 'Endpoint URL path was not recognized by MongoDB Atlas.',
      }
    }

    if (result.reason === 'HTTP_ERROR' && (result.status === 401 || result.status === 403)) {
      return {
        success: false,
        reason: 'AUTH_FAILED',
        message: 'Invalid API Key or insufficient Atlas Data API permissions.',
      }
    }

    return result
  }

  /**
   * Find documents in a collection.
   */
  async find(collection, filter = {}, sort = {}, limit = 100) {
    const result = await this._request('find', {
      collection,
      filter,
      sort,
      limit,
    })

    if (!result.success) return result
    return {
      success: true,
      documents: result.data.documents || [],
    }
  }

  /**
   * Find a single document.
   */
  async findOne(collection, filter = {}) {
    const result = await this._request('findOne', {
      collection,
      filter,
    })

    if (!result.success) return result
    return {
      success: true,
      document: result.data.document || null,
    }
  }

  /**
   * Insert a document.
   */
  async insertOne(collection, document) {
    return this._request('insertOne', {
      collection,
      document,
    })
  }

  /**
   * Insert multiple documents.
   */
  async insertMany(collection, documents) {
    return this._request('insertMany', {
      collection,
      documents,
    })
  }

  /**
   * Update one document matching filter.
   */
  async updateOne(collection, filter, update, upsert = true) {
    return this._request('updateOne', {
      collection,
      filter,
      update: { $set: update },
      upsert,
    })
  }

  /**
   * Delete one document.
   */
  async deleteOne(collection, filter) {
    return this._request('deleteOne', {
      collection,
      filter,
    })
  }

  /**
   * Delete multiple documents.
   */
  async deleteMany(collection, filter) {
    return this._request('deleteMany', {
      collection,
      filter,
    })
  }
}

export const mongoAtlasClient = new MongoAtlasClient()
