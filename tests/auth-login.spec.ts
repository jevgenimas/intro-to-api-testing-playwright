import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDto } from './dto/login-dto'
import { OrderDto } from './dto/order-dto'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const orderPath = 'orders'

const jwtPattern = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/

test.describe('Tallinn delivery API tests', () => {
  test('login with correct data and verify auth token', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithCorrectData()
    const response = await request.post(`${serviceURL}${loginPath}`, { data: requestBody })
    const jwtValue = await response.text()
    expect(response.status()).toBe(StatusCodes.OK)
    expect(jwtValue).toMatch(jwtPattern)
  })

  test('login with incorrect data should return 401', async ({ request }) => {
    const requestBody = LoginDto.createLoginWithIncorrectData()
    const response = await request.post(`${serviceURL}${loginPath}`, { data: requestBody })
    const responseBody = await response.text()
    expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
    expect(responseBody).toBe('')
  })

  test('login and create order (authorized)', async ({ request }) => {
    const loginResponse = await request.post(`${serviceURL}${loginPath}`, {
      data: LoginDto.createLoginWithCorrectData(),
    })
    const jwt = await loginResponse.text()

    const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
      data: OrderDto.createOrderWithoutId(),
      headers: { Authorization: `Bearer ${jwt}` },
    })

    const responseBody = await orderResponse.json()
    expect.soft(orderResponse.status()).toBe(StatusCodes.OK)
    expect.soft(responseBody.status).toBe('OPEN')
    expect.soft(responseBody.id).toBeDefined()
  })

  test('Authorization and Get order by ID', async ({ request }) => {
    const loginResponse = await request.post(`${serviceURL}${loginPath}`, {
      data: LoginDto.createLoginWithCorrectData(),
    })
    const jwt = await loginResponse.text()

    const createOrderResponse = await request.post(`${serviceURL}${orderPath}`, {
      data: OrderDto.createOrderWithoutId(),
      headers: { Authorization: `Bearer ${jwt}` },
    })
    const createdOrder = await createOrderResponse.json()

    const getOrderResponse = await request.get(`${serviceURL}${orderPath}/${createdOrder.id}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
    const fetchedOrder = await getOrderResponse.json()

    expect(getOrderResponse.status()).toBe(StatusCodes.OK)
    expect(fetchedOrder.id).toBe(createdOrder.id)
    expect(fetchedOrder.status).toBe('OPEN')
  })

  test('Authorization + Delete order by ID', async ({ request }) => {
    const loginResponse = await request.post(`${serviceURL}${loginPath}`, {
      data: LoginDto.createLoginWithCorrectData(),
    })
    const jwt = await loginResponse.text()

    const createOrderResponse = await request.post(`${serviceURL}${orderPath}`, {
      data: OrderDto.createOrderWithoutId(),
      headers: { Authorization: `Bearer ${jwt}` },
    })
    const createdOrder = await createOrderResponse.json()

    const deleteResponse = await request.delete(`${serviceURL}${orderPath}/${createdOrder.id}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
    expect(deleteResponse.status()).toBe(StatusCodes.OK)

    const getDeletedOrderResponse = await request.get(
      `${serviceURL}${orderPath}/${createdOrder.id}`,
      { headers: { Authorization: `Bearer ${jwt}` } },
    )
    const bodyText = await getDeletedOrderResponse.text()
    expect(bodyText).toBe('')
  })

  test('incorrect HTTP method should return 405', async ({ request }) => {
    const response = await request.get(`${serviceURL}${loginPath}`)
    expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
  })

  test('login with invalid request body structure should return 401', async ({ request }) => {
    const invalidRequestBody = { login: 'wrong-field' }
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: invalidRequestBody,
    })
    expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
  })
})
