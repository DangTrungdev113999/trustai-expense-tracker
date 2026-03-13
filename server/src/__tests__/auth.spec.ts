import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app'

describe('POST /api/auth/register', () => {
  it('should register with valid email and password >= 6 chars', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('user')
    expect(res.body.data).toHaveProperty('token')
    expect(res.body.data.user).toHaveProperty('id')
    expect(res.body.data.user.email).toBe('test@example.com')
    expect(res.body.data.user).toHaveProperty('createdAt')
    expect(typeof res.body.data.token).toBe('string')
  })

  it('should return 400 when email already exists', async () => {
    // Register first user
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'duplicate@example.com', password: 'password123' })

    // Attempt duplicate registration
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'duplicate@example.com', password: 'password456' })

    expect(res.status).toBe(400)
    expect(res.body.error).toHaveProperty('code', 'email_exists')
  })

  it('should return 400 when password is less than 6 chars', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'weak@example.com', password: '12345' })

    expect(res.status).toBe(400)
    expect(res.body.error).toHaveProperty('code', 'password_too_weak')
  })
})

describe('POST /api/auth/login', () => {
  it('should login with correct credentials', async () => {
    // Register first
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'login@example.com', password: 'password123' })

    // Login
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('user')
    expect(res.body.data).toHaveProperty('token')
    expect(res.body.data.user.email).toBe('login@example.com')
  })

  it('should return 401 with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'wrongpassword' })

    expect(res.status).toBe(401)
    expect(res.body.error).toHaveProperty('code', 'invalid_credentials')
  })

  it('should return 400 when email or password is missing', async () => {
    const resNoEmail = await request(app)
      .post('/api/auth/login')
      .send({ password: 'password123' })

    expect(resNoEmail.status).toBe(400)
    expect(resNoEmail.body.error).toHaveProperty('code')

    const resNoPassword = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com' })

    expect(resNoPassword.status).toBe(400)
    expect(resNoPassword.body.error).toHaveProperty('code')
  })
})
