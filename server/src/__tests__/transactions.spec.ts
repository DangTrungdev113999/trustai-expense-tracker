import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../app'

/**
 * Helper: register a user and return auth token
 */
async function getAuthToken(email: string, password: string): Promise<string> {
  await request(app)
    .post('/api/auth/register')
    .send({ email, password })

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password })

  return res.body.data?.token ?? ''
}

describe('POST /api/transactions', () => {
  let token: string

  beforeAll(async () => {
    token = await getAuthToken('txn-user@example.com', 'password123')
  })

  it('should create transaction with valid data (authenticated)', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'expense',
        category: 'Food',
        amount: 50000,
        date: '2026-03-13T00:00:00.000Z',
        note: 'Lunch',
      })

    expect(res.status).toBe(201)
    expect(res.body.data).toHaveProperty('transaction')

    const txn = res.body.data.transaction
    expect(txn).toHaveProperty('id')
    expect(txn).toHaveProperty('userId')
    expect(txn.type).toBe('expense')
    expect(txn.category).toBe('Food')
    expect(txn.amount).toBe(50000)
    expect(txn.date).toBe('2026-03-13T00:00:00.000Z')
    expect(txn.note).toBe('Lunch')
    expect(txn).toHaveProperty('createdAt')
  })

  it('should return 401 when no token provided', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .send({
        type: 'expense',
        category: 'Food',
        amount: 50000,
        date: '2026-03-13T00:00:00.000Z',
      })

    expect(res.status).toBe(401)
    expect(res.body.error).toHaveProperty('code', 'unauthorized')
  })

  it('should return 400 when amount is <= 0', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'expense',
        category: 'Food',
        amount: -100,
        date: '2026-03-13T00:00:00.000Z',
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toHaveProperty('code', 'invalid_amount')
  })

  it('should return 400 when type is invalid', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'donation',
        category: 'Food',
        amount: 50000,
        date: '2026-03-13T00:00:00.000Z',
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toHaveProperty('code', 'invalid_type')
  })
})

describe('GET /api/transactions', () => {
  let tokenA: string
  let tokenB: string

  beforeAll(async () => {
    tokenA = await getAuthToken('user-a@example.com', 'password123')
    tokenB = await getAuthToken('user-b@example.com', 'password123')

    // User A creates a transaction
    await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        type: 'income',
        category: 'Salary',
        amount: 10000000,
        date: '2026-03-01T00:00:00.000Z',
        note: 'Monthly salary',
      })
  })

  it('should return transactions for authenticated user', async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${tokenA}`)

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('transactions')
    expect(Array.isArray(res.body.data.transactions)).toBe(true)
    expect(res.body.data.transactions.length).toBeGreaterThan(0)
  })

  it('should return 401 when not authenticated', async () => {
    const res = await request(app)
      .get('/api/transactions')

    expect(res.status).toBe(401)
    expect(res.body.error).toHaveProperty('code', 'unauthorized')
  })

  it('should not return transactions from other users (isolation)', async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${tokenB}`)

    expect(res.status).toBe(200)
    expect(res.body.data.transactions).toHaveLength(0)
  })
})
