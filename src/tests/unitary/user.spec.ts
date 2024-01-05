import { randomUUID } from 'crypto';
import { UserServices } from '../../services/UserServices';
import { Password_hash, User, UserRequest } from '../../interfaces/UserInterface'
import { PrismaClient } from '@prisma/client'

import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

jest.mock('../../database/prismaClient', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

import prismaSingleton from '../../database/prismaClient'
const prismaMock = prismaSingleton as unknown as DeepMockProxy<PrismaClient>

describe("Test User Services", () => {
  const sut = new UserServices(prismaSingleton)

  beforeEach(() => {
    mockReset(prismaMock)
  })

  afterEach(() => {
  });

  it('Should return a user with three properties after being created in databaase', async () => {
    const userData: User & Password_hash = {
      name: "João Silva",
      username: `joaosilva${randomUUID()}`,
      email: `joao.silva${randomUUID()}@example.com`,
      birth_date: new Date("1990-01-01"),
      gender: "male",
      password_hash: "hashedPassword",
      city: "Campinas",
      state: "SP",
      country: "Brasil",
    }
    const mockedUser = {
      id: 1,
      name: "João Silva",
      username: `joaosilva${randomUUID()}`,
      email: `joao.silva${randomUUID()}@example.com`,
      birth_date: new Date("1990-01-01"),
      gender: "male",
      password_hash: "hashedPassword",
      city: "Campinas",
      state: "SP",
      country: "Brasil",
      active: true
    }

    prismaMock.users.create.mockResolvedValue(mockedUser)

    const newUser = await sut.createUser(userData)

    expect(newUser).toMatchObject({
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
    })
  })

  it('Should be returned a error of validation, with an array containg errors', () => {
    const invalidUserData: UserRequest = {
      name: 'Ab',
      password: 'pa',
      email: 'invalidemail',
      birth_date: new Date('01/01/1990'),
      city: 'A',
      country: 'A',
      gender: 'male',
      state: 'A',
      username: 'user'
    };
    const errors = sut.validateUserData(invalidUserData)

    const expectedErrorMessages = [
      'The name must be at least 3 characters long',
      'The password must be at least 3 characters long and a maximum of 16.',
      'Invalid Email.',
      'Invalid date of birth. Use yyyy-mm-dd format.',
      'The city must be at least 2 characters long',
      'The country must be at least 2 characters long',
      'The state must be at least 2 characters long.',
      'The username must be at least 5 characters long.',
    ];

    expect(errors).not.toBeNull
    expect(errors).toEqual(expectedErrorMessages)
    expect(errors).toHaveLength(8)
  })

  it('ValidateUserData should return "NULL"', () => {
    const UserData: UserRequest = {
      name: "João Silva",
      username: `joaosilva${randomUUID()}`,
      email: `joao.silva${randomUUID()}@example.com`,
      birth_date: new Date("1990-01-01"),
      gender: "male",
      password: "Password",
      city: "Campinas",
      state: "SP",
      country: "Brasil",
    };

    const responseValidateSevice = sut.validateUserData(UserData)

    expect(responseValidateSevice).toBeNull
  })
})
