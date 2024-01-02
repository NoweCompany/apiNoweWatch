import app from '../../app';
import request from 'supertest';
import { randomUUID } from 'crypto';

import prismaClient from '../../database/prismaClient';
import { prismaMock } from '../../configs/singleton';

describe("Test' User", () => {

  beforeEach(() => {

  })

  afterEach(async () => {
    await prismaClient.users.deleteMany({})
  });

  it('Should create a user in database', async () => {

    const userMock = {
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
    }

    prismaMock.users.create.mockResolvedValue(userMock)

    const user = {
      name: "João Silva",
      password: "senha123",
      email: `joao.silva${randomUUID()}@example.com`,
      birth_date: "1990-01-01",
      city: "Campinas",
      country: "Brasil",
      gender: "male",
      state: "SP",
      username: `joaosilva${randomUUID()}`
    }
    const response = await request(app).post('/users').send(user)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: expect.any(Number),
      name: userMock.name,
      email: userMock.email,
      username: userMock.username
    })
  })
})
