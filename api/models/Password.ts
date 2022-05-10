import PasswordValidator from 'password-validator'

const PasswordSchema = new PasswordValidator()

PasswordSchema.is().min(8)
.has().uppercase(1)
.has().lowercase(1)
.has().symbols(1)
.has().digits(1)

export default PasswordSchema
