import { Ihttp } from '@Type'

const error500 = (res: Ihttp['res']) => {
  res.status(500).send('Error server')
}

export default error500
