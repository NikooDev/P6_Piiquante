import { Ihttp } from '@Type'

const error404 = (res: Ihttp['res']) => {
  res.status(404).send('Page Not Found')
}

export default error404
