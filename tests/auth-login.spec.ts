import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDto } from './dto/login-dto'
import { OrderDto } from './dto/order-dto'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const orderPath = 'orders'

// Регулярное выражение для JWT токена
const jwtPattern = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/

test.describe('Tallinn delivery API tests', () => {
  test('login with correct data and verify auth token', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()
    console.log('Request body:', requestBody)

    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })

    const jwtValue = await response.text()
    console.log('Response status:', response.status())
    console.log('JWT:', jwtValue)

    expect(response.status()).toBe(StatusCodes.OK)
    expect(jwtValue).toMatch(jwtPattern)
  })

  test('login with incorrect data should return 401', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithIncorrectData()
    console.log('Incorrect login request:', requestBody)

    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })

    const responseBody = await response.text()
    console.log('Response status:', response.status())
    console.log('Response body:', responseBody)

    expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
    expect(responseBody).toBe('')
  })

  test('login and create order (authorized)', async ({ request }) => {
    // Шаг 1: логин
    const loginResponse = await request.post(`${serviceURL}${loginPath}`, {
      data: LoginDto.createLoginWithCorrectData(),
    })
    const jwt = await loginResponse.text()

    // Шаг 2: создать заказ
    const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
      data: OrderDto.createOrderWithoutId(),
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    const responseBody = await orderResponse.json()

    console.log('Order status:', orderResponse.status())
    console.log('Order response:', responseBody)

    expect.soft(orderResponse.status()).toBe(StatusCodes.OK)
    expect.soft(responseBody.status).toBe('OPEN')
    expect.soft(responseBody.id).toBeDefined()
  })

  test('incorrect HTTP method should return 405', async ({ request }) => {
    const response = await request.get(`${serviceURL}${loginPath}`)
    console.log('Status for wrong method:', response.status())
    expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
  })

  test('login with invalid request body structure should return 401', async ({ request }) => {
    const invalidRequestBody = {
      login: 'wrong-field', // неправильное поле, не username
    }

    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: invalidRequestBody,
    })

    console.log('Response status for invalid body:', response.status())
    expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
  })
})
