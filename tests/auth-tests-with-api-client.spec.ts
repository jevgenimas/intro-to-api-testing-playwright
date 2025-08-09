import { expect, test } from '@playwright/test'
import { ApiClient } from './api-client'
import { StatusCodes } from 'http-status-codes'

test('login and create order with api client', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()
  console.log('orderId:', orderId)
})

test('Successful login and delete existing order with api client', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()

  const deleteResponse = await apiClient.deleteOrder(orderId)
  expect.soft(deleteResponse.status()).toBe(StatusCodes.OK)

  const getResponse = await apiClient.getOrder(orderId)
  const bodyText = await getResponse.text()
  expect.soft(bodyText).toBe('')
})

test('Successful login and get existing order with api client', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()

  const response = await apiClient.getOrder(orderId)
  const responseBody = await response.json()
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.id).toBe(orderId)
})

test('Authorization + Get order by ID using API client', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()

  const getResponse = await apiClient.getOrder(orderId)
  expect(getResponse.status()).toBe(StatusCodes.OK)

  const body = await getResponse.json()
  expect(body.id).toBe(orderId)
})

test('Authorization + Delete order by ID using API client', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()

  const deleteResponse = await apiClient.deleteOrder(orderId)
  expect(deleteResponse.status()).toBe(StatusCodes.OK)

  const getDeletedResponse = await apiClient.getOrder(orderId)
  const text = await getDeletedResponse.text()
  expect(text).toBe('')
})
