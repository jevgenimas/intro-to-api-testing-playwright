import { test, expect } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoanApplicationDto } from './dto/loan-application.dto'

const URL = 'https://backend.tallinn-learning.ee/api/loan-calc/decision'

test.describe('Loan Decision API tests', () => {
  test('Income = 0 → 400 Bad Request', async ({ request }) => {
    const response = await request.post(URL, {
      data: LoanApplicationDto.negativeIncome(),
    })
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
  })

  test('Medium risk and should return 200 OK', async ({ request }) => {
    const response = await request.post(URL, {
      data: LoanApplicationDto.mediumRisk(),
    })
    const body = await response.json()

    expect.soft(response.status()).toBe(StatusCodes.OK)
    expect.soft(body.riskLevel).toBe('Medium Risk')
    expect.soft(body.riskScore).toBeGreaterThan(0)
    expect.soft(body.riskPeriods).toContain(6)
    expect.soft(body.applicationId).toBeTruthy()
  })

  test('Low risk and should return 200 OK', async ({ request }) => {
    const response = await request.post(URL, {
      data: LoanApplicationDto.lowRisk(),
    })
    const body = await response.json()

    expect.soft(response.status()).toBe(StatusCodes.OK)
    expect.soft(body.riskLevel).toBe('Low Risk')
    expect.soft(body.riskScore).toBeGreaterThan(0)
    expect.soft(body.riskPeriods).toContain(12)
    expect.soft(body.applicationId).toBeTruthy()
  })

  test('High risk and should return 200 OK', async ({ request }) => {
    const response = await request.post(URL, {
      data: LoanApplicationDto.highRisk(),
    })
    const body = await response.json()

    expect.soft(response.status()).toBe(StatusCodes.OK)
    expect.soft(body.riskLevel).toBe('High Risk')
    expect.soft(body.riskScore).toBeGreaterThan(0)
    expect.soft(body.riskPeriods).toContain(3)
    expect.soft(body.applicationId).toBeTruthy()
  })

  test('Debt is negative and should return 400 Bad Request', async ({ request }) => {
    const response = await request.post(URL, {
      data: LoanApplicationDto.negativeDebt(),
    })
    expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
  })
})
