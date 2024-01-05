type Gender = 'female' | 'male' | 'other'
interface User{
  name: string
  username: string
  email: string
  birth_date: Date
  gender: Gender
  country: string
  state: string
  city: string
}
interface Id {
  id: number
}

interface Password {
  password: string
}

interface Password_hash{
  password_hash: string
}

interface UserRequest extends User, Password{}
interface UserDataBase extends User, Id, Password_hash{}
interface UserReturnedDB extends User, Id{}




export { User, UserRequest, UserDataBase, UserReturnedDB, Password_hash, Password, Id }
