interface Isauce {
  userId: string,
  name: string,
  manufacturer: string
  description: string
  mainPepper: string
  imageUrl: string
  heat: number
  likes: number | undefined
  dislikes: number | undefined
  usersLiked: string[]
  usersDisliked: string[]
}

export default Isauce
