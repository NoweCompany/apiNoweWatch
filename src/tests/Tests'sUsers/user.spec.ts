import { randomUUID } from 'crypto';
import UserController from '../../controllers/userController'
import prismaClient from '../../database/prismaClient';
import { UserServices } from '../../services/UserServices';


describe("Test' User", () => {

  beforeEach(() => {
  })

  afterEach(() => {
  });

  it('Should be created new user in database', async () => {
    const sut = new UserServices(prismaClient)

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

    expect(newUser).toMatchObject({
      name: "João Silva",
      email: newUser.email,
      username: newUser.username
    })
  })
})
