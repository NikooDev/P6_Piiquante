import 'module-alias/register'
import 'dotenv/config'
import http from 'http'
import express from 'express'
import router from './router'
import cors, { CorsOptions } from 'cors'
import { error404, error500 } from './handlers'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import connectDB from './services/connectDB'
import nocache from 'nocache'

const app = express(),
  server = http.createServer(app),
  normalizePort = (val: string) => {
    const port = parseInt(val, 10)
    if(isNaN(port)) return val
    if(port >= 0) return port
    return false
  },
  corsOptions: CorsOptions = {
    origin: process.env.HOST_ORIGIN,
    methods: ['GET, POST, PUT, DELETE'],
    allowedHeaders: ['Origin, X-Requested-With, Content, Accept, Content-Type, Authorization']
  },
  port = Number(normalizePort(process.env.PORT || '3000')),
  mongodbUrl = 'mongodb+srv://'+process.env.MONGODB_USER+':'+process.env.MONGODB_PASS+'@'+process.env.MONGODB_HOST+'/'+process.env.MONGODB_BASE+'?retryWrites=true&w=majority'

/**
 * Configuration et déclarations des middlewares express
 */
app.set('port', port)
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use('/api', router)
app.use('/uploads', express.static('uploads'))

/**
 * Gestion du cache
 */
if(process.env.NODE_ENV === 'development') {
  app.use(nocache())
}

/**
 * Configuration des pages d'erreurs
 */
app.use((req, res) => error404(res))
app.use((req, res) => error500(res))

// noinspection JSIgnoredPromiseFromCall
/**
 * Connexion à la base de données
 */
connectDB(mongodbUrl)

/**
 * Gestion des erreurs serveur
 * @param error
 */
const errorHandler = (error: any) => {
  if(error.syscall !== 'listen') {
    throw error
  }
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.')
      process.exit(1)
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.')
      process.exit(1)
      break;
    default:
      throw error
  }
}

/**
 * Évènements serveur
 */
server.on('error', errorHandler)
server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Listening on '+bind+' : http://localhost:'+port)
})
server.listen(port)
