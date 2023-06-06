import config from '../../../config'
import { IUser } from './user.interface'
import { User } from './user.model'
import { generateUserId } from './user.utils'

const createUserInDB = async (user: IUser) => {
  // auto generated incremental id
  const id = await generateUserId()
  user.id = id

  // default password
  if (!user.password) {
    user.password = config.default_user_pass
  }

  const createdUser = await User.create(user)
  if (!createUserInDB) {
    throw new Error('Failed to create user!')
  }
  return createdUser
}

export default {
  createUserInDB,
}
