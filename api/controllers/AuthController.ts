import { validationResult } from 'express-validator'
import { PasswordSchema, UserSchema } from '@Model'
import { Ihttp } from '@Type'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

class AuthController {

  /**
   * Signup
   * Traitement du formulaire d'inscription
   * @param req
   * @param res
   */
  public static async signup(req: Ihttp['req'], res: Ihttp['res']) {
    const errors = validationResult(req), form = req.body, err: string[] = []

    if(!errors.isEmpty()) {
      let error = errors.array({ onlyFirstError: true })
      for(let k in error) err.push(error[k].msg)
      return res.status(400).json({ message: err.join('\r\n') })
    }

    if(!PasswordSchema.validate(req.body.password)) {
      err.push('Votre mot de passe doit comporter au minimum :\r\n- 8 caractères\r\n- une majuscule\r\n- une minuscule\r\n- un chiffre\r\n- un caractère spécial')
      return res.status(400).json({ message: err.join('\r\n') })
    }

    try {
      const encryptPassword = await bcrypt.hash(form.password, 10),
        user = await new UserSchema({
          email: form.email,
          password: encryptPassword
        })

      user.save().then(() => {
        return res.status(201).json({ message: 'Utilisateur créé !' })
      }).catch(e => {
        return res.status(400).json({ message: e.errors.email.properties.message })
      })
    } catch (e) {
      return res.status(500).json({ message: 'Une erreur a été détectée, si le problème persiste contactez l\'administrateur du site' })
    }
  }

  /**
   * login
   * Connexion des utilisateurs
   * @param req
   * @param res
   */
  static async login(req: Ihttp['req'], res: Ihttp['res']) {
    const form = req.body
    try {
      let result = await UserSchema.findOne({ email: form.email })
      if(!result) return res.status(401).json({ message: 'Utilisateur non trouvé' })

      let checkPassword = await bcrypt.compare(form.password, result.password)
      if(!checkPassword) {
        return res.status(401).json({ message: 'Mot de passe incorrect' })
      }

      const token = jwt.sign({ userId: result._id }, process.env.TOKEN, { expiresIn: '24h' })

      res.status(200).json({
        userId: result._id,
        token: token
      })
    } catch (err) {
      res.status(500).json({ err })
    }
  }

}

export default AuthController
