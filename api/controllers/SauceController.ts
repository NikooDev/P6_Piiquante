import fs from 'fs'
import { SauceSchema } from '@Model'
import { Ihttp, Isauce } from '@Type'
import ValidateSauceForm from '../validations/ValidateSauceForm'

class SauceController {

  /**
   * create
   * Création d'une sauce
   * @param req
   * @param res
   */
  public static async create(req: Ihttp['req'], res: Ihttp['res']) {
    const newSauce = JSON.parse(req.body.sauce) as Isauce, file = req.file ? req.file : null
    let isError: boolean

    try {
      const resultValidation = await ValidateSauceForm(newSauce, file?.filename)
      isError = resultValidation.isError

      if(isError) {
        return res.status(400).json({ message: resultValidation.error })
      }

      const sauce = await new SauceSchema<Isauce>({
        ...newSauce,
        imageUrl: 'http://localhost:3000/uploads/'+file?.filename
      })

      sauce.save().then(() => {
        return res.status(201).json({ message: 'La sauce a bien été crée' })
      }).catch((e) => {
        return res.status(400).json({ message: e.message })
      })
    } catch (e) {
      return res.status(500).json({ message: 'Erreur lors de la création de la sauce' })
    }
  }

  /**
   * read
   * Récupère les données d'une sauce
   * @param req
   * @param res
   */
  public static async read(req: Ihttp['req'], res: Ihttp['res']) {
    const id = req.params.id

    try {
      const sauce = await SauceSchema.findById(id)

      return res.status(200).json(sauce)
    } catch (e) {
      return res.status(500).json({ message: 'Un problème a été rencontré lors de la récupération de la sauce' })
    }
  }

  /**
   * update
   * Modification d'une sauce
   * @param req
   * @param res
   */
  public static async update(req: Ihttp['req'], res: Ihttp['res']) {
    const body = req.body, file = req.file ? req.file : null
    let newSauce = {} as Isauce, isError: boolean, error: string

    try {
      const resultValidation = await ValidateSauceForm(file ? JSON.parse(body.sauce) : body, file?.filename)
      isError = resultValidation.isError
      error = resultValidation.error

      if(isError) {
        return res.status(400).json({ message: error })
      }

      if(file) {
        const sauceExist = await SauceSchema.findOne<Isauce>({ _id: req.params.id }) as Isauce,
          oldFile = sauceExist.imageUrl.split('/uploads/')[1]

        fs.unlinkSync('uploads/'+oldFile)

        newSauce = {
          ...JSON.parse(body.sauce),
          imageUrl: 'http://localhost:3000/uploads/'+file?.filename
        }
      } else {
        newSauce = body
      }

      await SauceSchema.updateOne({ _id: req.params.id }, { ...newSauce, _id: req.params.id })

      return res.status(200).json({ message: 'La sauce a bien été modifiée' })
    } catch (e) {
      return res.status(500).json({ message: 'Un problème a été rencontré lors de la modification de la sauce' })
    }
  }

  /**
   * delete
   * Vérification de l'authenticité de l'utilisateur
   * Suppression de la sauce selon son ID
   * @param req
   * @param res
   */
  public static async delete(req: Ihttp['req'], res: Ihttp['res']) {
    const id = req.params.id

    try {
      const sauceExist = await SauceSchema.findOne<Isauce>({ _id: id }) as Isauce

      if(sauceExist && sauceExist.userId !== req.auth.userId) {
        res.status(401).json({ message: 'Vous n\'êtes pas autorisé à supprimer cette sauce' })
      }

      const file = sauceExist.imageUrl.split('/uploads/')[1]
      if(file) fs.unlinkSync('uploads/'+file)

      await SauceSchema.deleteOne({ _id: id })

      res.status(200).json({ message: 'Sauce supprimée'} )
    } catch (e) {
      res.status(400).json({ message: 'La sauce n\'a pas pu être supprimé' })
    }

  }

  /**
   * getAll
   * Récupère la liste de toutes les sauces
   * @param req
   * @param res
   */
  public static async getAll(req: Ihttp['req'], res: Ihttp['res']) {
    try {
      const sauces = await SauceSchema.find()

      return res.status(200).json(sauces)
    } catch (e) {
      return res.status(500).json({ message: 'Un problème a été rencontré lors de la récupération des sauces' })
    }
  }

  /**
   * vote
   * Permet de liker / disliker une sauce
   * @param req
   * @param res
   */
  public static async vote(req: Ihttp['req'], res: Ihttp['res']) {
    const userId = req.body.userId, like = req.body.like, sauceId = req.params.id
    let fieldUpdate = {}

    try {
      switch (like) {
        case 1:
          fieldUpdate = {
            $push: { usersLiked: userId },
            $inc: { likes: +1 }
          }
          break
        case -1:
          fieldUpdate = {
            $push: { usersDisliked: userId },
            $inc: { dislikes: +1 }
          }
          break
        case 0:
          let currentSauce = await SauceSchema.findOne<Isauce>({ _id: sauceId }) as Isauce
          if(currentSauce.usersLiked.includes(userId)) {
            fieldUpdate = {
              $pull: { usersLiked: userId },
              $inc: { likes: -1 }
            }
          }
          if(currentSauce.usersDisliked.includes(userId)) {
            fieldUpdate = {
              $pull: { usersDisliked: userId },
              $inc: { dislikes: -1 }
            }
          }
          break
      }

      await SauceSchema.updateOne({ _id: sauceId }, fieldUpdate)

      return res.status(200).json({ message: 'Votre vote a bien été enregistré' })
    } catch (e) {
      return res.status(400).json({ message: 'Erreur lors de l\'enregistrement du vote' })
    }
  }

}

export default SauceController
