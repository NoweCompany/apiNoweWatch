interface UserRequest {
  name: string
  username: string
  email: string
  birth_date: Date
  gender: 'female' | 'male' | 'other'
  password: string
  country: string
  state: string
  city: string
}

interface UserDataBase {
  id: number
  name: string
  username: string
  email: string
  birth_date: Date
  gender: 'female' | 'male' | 'other'
  password_hash: string
  country: string
  state: string
  city: string
}
interface User {
  name: string
  username: string
  email: string
  birth_date: Date
  gender: 'female' | 'male' | 'other'
  password_hash: string
  country: string
  state: string
  city: string
}

interface UserReturnDatabase {
  name: string;
  username: string;
  email: string;
}

export {UserRequest, UserDataBase, UserReturnDatabase, User}
