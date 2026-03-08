import { logger } from '#server/utils/logger'

export default defineEventHandler((event) => {
  const { method, url } = event.node.req

  if (!url?.startsWith('/api/') || url === '/api/health') return

  const start = Date.now()

  event.node.res.on('finish', () => {
    logger.info({
      method,
      url,
      status: event.node.res.statusCode,
      duration: Date.now() - start,
    }, 'Request completed')
  })
})
