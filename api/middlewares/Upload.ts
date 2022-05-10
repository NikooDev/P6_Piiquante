import multer from 'multer'
import { Ihttp } from '@Type'

interface Imime {
  [key: string]: string
}

const MIME_TYPES: Imime = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

const upload = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads')
  },
  filename(req: Ihttp['req'], file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
    let name = file.originalname.split(' ').join('_'),
      extension = MIME_TYPES[file.mimetype]

    name = name.replace('.' + extension, '_')
    callback(null, name + Date.now() + '.' + extension)
  }
})

export default multer({ storage: upload }).single('image')
