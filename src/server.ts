import mongoose from 'mongoose'
import app from './app'
import config from './config/index'
import { errorLogger, infoLogger } from './shared/logger'

async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    infoLogger.info('Database is connected successfully')
    app.listen(config.port, () => {
      infoLogger.info(
        `app listening on port ${config.port} | http://localhost:${config.port}`
      )
    })
  } catch (error) {
    errorLogger.error('Failed to connect database', error)
  }
}
main()
