import { Request, Response, NextFunction } from 'express'

interface Ihttp {
  req: Request
  res: Response
  next: NextFunction
}

export default Ihttp
