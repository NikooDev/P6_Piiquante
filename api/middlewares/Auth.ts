import { Ihttp } from '@Type'
import jwt from 'jsonwebtoken'

interface Ijwt {
  userId: string
  iat: number
  exp: number
}

const auth = (req: Ihttp['req'], res: Ihttp['res'], next: Ihttp['next']) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] as string,
      decodeToken = jwt.verify(token, process.env.TOKEN) as Ijwt,
      userId = decodeToken.userId

    req.auth = { userId }

    if(req.body.userId && req.body.userId !== userId) {
      return new Error('Invalid user ID')
    } else {
      next()
    }
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' })
  }
}

export default auth
