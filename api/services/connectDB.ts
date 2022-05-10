import mongoose from 'mongoose'

const connectDB = async (url: string) => {
  try {
    await mongoose.connect(url)
    console.log('MongoDB connected !')
  } catch (e) {
    console.log('Failed to connect to MongoDB', e)
  }
}

export default connectDB
