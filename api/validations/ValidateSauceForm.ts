import fs from 'fs'
import { Isauce } from '@Type'

const ValidateSauceForm = async (newSauce?: Isauce, file?: string) => {
  const name = newSauce && newSauce.name.length, manufacturer = newSauce && newSauce.manufacturer.length,
    description = newSauce && newSauce.description.length, mainPepper = newSauce && newSauce.mainPepper.length
  let error: string = '', isError = false

  if(name && name < 4 || name && name > 20 || manufacturer && manufacturer < 4 || manufacturer && manufacturer > 20) {
    error = 'Les champs : \r\n- Name\r\n- Manufacturer\r\ndoivent comporter entre 4 et 20 caractères'
    isError = true
  } else if(description && description < 10 || description && description > 300) {
    error = 'La description doit comporter entre 10 et 300 caractères'
    isError = true
  } else if(mainPepper && mainPepper < 5 || mainPepper && mainPepper > 50) {
    error = 'mainPepper doit comporter entre 5 et 50 caractères'
    isError = true
  }

  if(isError && file) fs.unlinkSync('uploads/'+file)

  return { isError, error }
}

export default ValidateSauceForm
