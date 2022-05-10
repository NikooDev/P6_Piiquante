import mongoose from 'mongoose'
import { Ihttp } from '@Type'

/**
 * Retourne un message d'erreur en cas de problème de connexion à MongoDB
 * @param req
 * @param res
 * @param next
 */
const checkDB = (req: Ihttp['req'], res: Ihttp['res'], next: Ihttp['next']) => {
  if(mongoose.connection.readyState === 0) {
    return res.status(500).json({ message: 'Erreur lors de la connexion à la base de données' })
  } else {
    next()
  }
}

export default checkDB
