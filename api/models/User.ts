import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { Iuser } from '@Type'

const UserSchema = new mongoose.Schema<Iuser>({
  email: {
    type: String,
    required: [true, 'Une adresse e-mail est requise'],
    unique: true
  },
  password: { type: String, required: true }
})

UserSchema.plugin(uniqueValidator, { message: 'Un compte existe déjà avec cette adresse e-mail' })

export default mongoose.model<Iuser>('User', UserSchema)
