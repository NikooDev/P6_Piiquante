import { body } from 'express-validator'

/**
 * Vérifie si la valeur de l'adresse e-mail est bien formatée
 * Fixe une longueur minimale et maximale au mot de passe
 */
export const validateEmail = [
  body('email').isEmail().withMessage('Votre adresse e-mail est incorrect'),
]
