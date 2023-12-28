import { randomUUID } from 'crypto';
import { UserServices } from '../../services/UserServices';

describe("Test' User", () => {

  beforeEach(() => {
  })

  afterEach(() => {
  });

  it('Should return a user with their hashed password', async () => {
    const sut = new UserServices()

    const newUser = await sut.createUser({
      name: "João Silva",
      password: "senha123",
      email: `joao.silva${randomUUID()}@example.com`,
      birth_date: new Date("1990-01-01"),
      city: "Campinas",
      country: "Brasil",
      gender: "male",
      state: "SP",
      username: `joaosilva${randomUUID()}`
    })

    console.log(newUser);


    expect(newUser).not.toHaveProperty('password')
    expect(newUser).toHaveProperty('password_hash')
    expect(newUser).toMatchObject({
      name: newUser.name,
      email: newUser.email,
      birth_date: newUser.birth_date,
      city: newUser.city,
      country: newUser.country,
      gender: newUser.gender,
      state: newUser.state,
      username: newUser.username,
    })
  })
})
