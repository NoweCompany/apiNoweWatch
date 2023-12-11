import crypto from 'node:crypto'
import { UserDataBase, UserRequest, UserReturnDatabase } from '../../interfaces/UserInterface'
import { AbstractUserService } from '../../services/UserServices'

class inMemoryUserDatabase extends AbstractUserService{
  private users: UserDataBase[] = []
  async createUser(dataUser: UserRequest): Promise<UserReturnDatabase>{
    const password_hash = crypto
        .createHash('sha256')
        .update(dataUser.password)
        .digest('hex')

    const newUser: UserDataBase = {
      id: this.users[0].id + 1 || 1,
      name: dataUser.name,
      username: dataUser.username,
      email: dataUser.email,
      birth_date: dataUser.birth_date,
      gender: dataUser.gender,
      password_hash: password_hash,
      country: dataUser.country,
      state: dataUser.state,
      city: dataUser.city,
    }

    this.users.push(newUser)

    const userRetorned:UserReturnDatabase = {
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
    }

    return userRetorned
  }
}

export default inMemoryUserDatabase
