import { test, expect } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDto } from './dto/login-dto'
import dotenv from 'dotenv'
dotenv.config()

const BASE_URL = 'https://backend.tallinn-learning.ee'
const LOGIN_ENDPOINT = '/login/student'
const jwtPattern = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/

test.describe('login API tests', () => {
  test('successful login returns valid JWT', async ({ request }) => {
    const response = await request.post(`${BASE_URL}${LOGIN_ENDPOINT}`, {
      data: LoginDto.createLoginWithCorrectData(),
    })

    const jwt = await response.text()
    expect.soft(response.status()).toBe(StatusCodes.OK)
    expect.soft(jwt).toMatch(jwtPattern)
  })

  test('login using GET method should return 405', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${LOGIN_ENDPOINT}`)
    expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
  })

  test('login with invalid data should return 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}${LOGIN_ENDPOINT}`, {
      data: { foo: 'test' },
    })
    expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
  })
})
