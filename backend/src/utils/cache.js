const apicache = require('apicache')

const cache = apicache.options({
  respectCacheControl: true,
  statusCodes: {
    include: [200]
  }
}).middleware

function cacheDefault() {
  const ttl = `${process.env.CACHE_TTL_SECONDS || 60} seconds`
  return cache(ttl)
}

module.exports = { cacheDefault }

