import app from '../../app';
import request from 'supertest';
import prismaClient from '../../database/prismaClient';
import { resolve } from 'path';

describe("Test' UserPhoto", () => {
  beforeEach(() => {

  })

  afterEach(async () => {
  });

  afterAll(async () => {
  })

  it('must create a photo linked to a user', async () => {
    const fileDiretory = resolve(__dirname, '..', 'assets', 'img', '1.117kb.jpg')

    const response = await request(app)
      .post('/usersPhoto')
      .set('Content-Type', 'multipart/form-data')
      .attach("userPhoto", fileDiretory)

    console.log(response.body);

    expect(response.status).toBe(200)
  })
})
