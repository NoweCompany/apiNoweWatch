import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import prismaSingleton from '../database/prismaClient'
import { PrismaClient } from '@prisma/client'
import { resolve } from 'path'

const pismaClienteSingletonDiretory = resolve(__dirname, '..', 'database', 'prismaClient')

function createMock(): DeepMockProxy<PrismaClient>{
  jest.mock(pismaClienteSingletonDiretory, () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
  }))

  const prismaMock = prismaSingleton as unknown as DeepMockProxy<PrismaClient>

  return prismaMock
}
function resetMock(prismaMock: DeepMockProxy<PrismaClient>){
  return mockReset(prismaMock)
}

export {createMock, resetMock}
