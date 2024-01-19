import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
import prismaSingleton from '../../database/prismaClient'

jest.mock('../../database/prismaClient', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))
const prismaMock = prismaSingleton as unknown as DeepMockProxy<PrismaClient>

import { TokenServices } from '../../services/TokenService'

describe("Test User Services", () => {
  const sut = new TokenServices(prismaSingleton)

  beforeEach(() => {
    mockReset(prismaMock)
  })

  afterEach(() => {
  });

  it('Should be returned an error on call "authenticateUser" whith invalid parameters', async () => {
    const authenticate = await sut.authenticateUser('userAuthentication@example.com', 'securePassword')

    expect(authenticate).toBeFalsy
  })

  it('expect that on call "authenticateUser" whith valid parameters a user will be returned', async () => {
    const mockUser = {
      id: 1,
      name: "João Silva",
      username: `joaosilva`,
      email: `joao.silva@example.com`,
      birth_date: new Date("1990-01-01"),
      gender: "male",
      password_hash: "hashedPassword",
      city: "Campinas",
      state: "SP",
      country: "Brasil",
      active: true
    }

    prismaMock.users.findFirst.mockResolvedValue(mockUser)

    const userAuthentication = "joao.silva@example.com"
    const pass = "senha12345"
    const authenticate = await sut.authenticateUser(userAuthentication, pass)

    expect(authenticate).toEqual(authenticate)
  })
})
