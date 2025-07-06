// HW_09

import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

const BASE_URL = 'https://backend.tallinn-learning.ee/test-orders'
const VALID_API_KEY = '1234567890123456'

const validOrderBody = (id: number) => ({
  status: 'OPEN',
  courierId: 0,
  customerName: 'Test Customer',
  customerPhone: '+3721234567',
  comment: 'Playwright test',
  id: id,
})

// GET /test-orders

test('GET login with valid username and password should return 200', async ({ request }) => {
  const response = await request.get(BASE_URL, {
    params: {
      username: 'validUser',
      password: 'validPass',
    },
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
})

test('GET login with missing password should return 500', async ({ request }) => {
  const response = await request.get(BASE_URL, {
    params: {
      username: 'validUser',
      password: '',
    },
  })
  expect.soft(response.status()).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
})

test('GET login with missing username should return 500', async ({ request }) => {
  const response = await request.get(BASE_URL, {
    params: {
      username: '',
      password: 'validUser',
    },
  })
  expect.soft(response.status()).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
})

// DELETE /test-orders/{id}

test('DELETE order with valid api_key and valid id 1 should return 204', async ({ request }) => {
  const response = await request.delete(`${BASE_URL}/1`, {
    headers: {
      api_key: VALID_API_KEY,
    },
  })
  expect.soft(response.status()).toBe(StatusCodes.NO_CONTENT)
})

test('DELETE order with valid api_key and valid id 5 should return 204', async ({ request }) => {
  const response = await request.delete(`${BASE_URL}/5`, {
    headers: {
      api_key: VALID_API_KEY,
    },
  })
  expect.soft(response.status()).toBe(StatusCodes.NO_CONTENT)
})

test('DELETE order with valid api_key and valid id 10 should return 204', async ({ request }) => {
  const response = await request.delete(`${BASE_URL}/10`, {
    headers: {
      api_key: VALID_API_KEY,
    },
  })
  expect.soft(response.status()).toBe(StatusCodes.NO_CONTENT)
})

test('DELETE order with valid api_key and invalid id 0 should return 400', async ({ request }) => {
  const response = await request.delete(`${BASE_URL}/0`, {
    headers: {
      api_key: VALID_API_KEY,
    },
  })
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('DELETE order with valid api_key and invalid id 11 should return 400', async ({ request }) => {
  const response = await request.delete(`${BASE_URL}/11`, {
    headers: {
      api_key: VALID_API_KEY,
    },
  })
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('DELETE order with valid api_key and invalid id format should return 400', async ({
                                                                                         request,
                                                                                       }) => {
  const response = await request.delete(`${BASE_URL}/abc`, {
    headers: {
      api_key: VALID_API_KEY,
    },
  })
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('DELETE order without valid api_key and with valid id should return 401', async ({
                                                                                        request,
                                                                                      }) => {
  const response = await request.delete(`${BASE_URL}/1`, {
    headers: {
      api_key: '555555',
    },
  })
  expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('DELETE order with api_key missing and with valid id should return 401', async ({
                                                                                       request,
                                                                                     }) => {
  const response = await request.delete(`${BASE_URL}/1`, {
    headers: {
      api_key: '',
    },
  })
  expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('DELETE order with valid api_key and missing id should return 405', async ({ request }) => {
  const response = await request.delete(`${BASE_URL}/`, {
    headers: {
      api_key: VALID_API_KEY,
    },
  })
  expect.soft(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
})

// PUT /test-orders/{id}

test('PUT order with valid data with valid id 1 should return 200', async ({ request }) => {
  const response = await request.put(`${BASE_URL}/1`, {
    headers: {
      api_key: VALID_API_KEY,
      'Content-Type': 'application/json',
    },
    data: validOrderBody(1),
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
})

test('PUT order with valid data with valid id 5 should return 200', async ({ request }) => {
  const response = await request.put(`${BASE_URL}/5`, {
    headers: {
      api_key: VALID_API_KEY,
      'Content-Type': 'application/json',
    },
    data: validOrderBody(5),
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
})

test('PUT order with valid data with valid id 10 should return 200', async ({ request }) => {
  const response = await request.put(`${BASE_URL}/10`, {
    headers: {
      api_key: VALID_API_KEY,
      'Content-Type': 'application/json',
    },
    data: validOrderBody(10),
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
})

test('PUT order with valid data with invalid id 0 should return 400', async ({ request }) => {
  const response = await request.put(`${BASE_URL}/0`, {
    headers: {
      api_key: VALID_API_KEY,
      'Content-Type': 'application/json',
    },
    data: validOrderBody(0),
  })
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('PUT order with valid data with invalid id 11 should return 400', async ({ request }) => {
  const response = await request.put(`${BASE_URL}/11`, {
    headers: {
      api_key: VALID_API_KEY,
      'Content-Type': 'application/json',
    },
    data: validOrderBody(11),
  })
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('PUT order with invalid id and valid api_key should return 400', async ({ request }) => {
  const response = await request.put(`${BASE_URL}/abc`, {
    headers: {
      api_key: VALID_API_KEY,
      'Content-Type': 'application/json',
    },
    data: 'abc',
  })
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('PUT order without api_key and valid id should return 401', async ({ request }) => {
  const response = await request.put(`${BASE_URL}/1`, {
    headers: {
      api_key: '',
      'Content-Type': 'application/json',
    },
    data: validOrderBody(1),
  })

  expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('PUT order with invalid api_key and valid id should return 401', async ({ request }) => {
  const response = await request.put(`${BASE_URL}/1`, {
    headers: {
      api_key: 'abcdefg][;,./zxc',
      'Content-Type': 'application/json',
    },
    data: validOrderBody(1),
  })
  expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('PUT order without id and valid api_key should return 405', async ({ request }) => {
  const response = await request.put(`${BASE_URL}/`, {
    headers: {
      api_key: VALID_API_KEY,
      'Content-Type': 'application/json',
    },
    data: '',
  })
  expect.soft(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
})

test('PUT order with valid api_key and invalid id should return 405', async ({ request }) => {
  const response = await request.put(`${BASE_URL}/`, {
    headers: {
      api_key: VALID_API_KEY,
      'Content-Type': 'application/json',
    },
    data: '',
  })
  expect.soft(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
})
