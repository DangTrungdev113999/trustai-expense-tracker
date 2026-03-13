interface ApiError {
  code: string
  message: string
}

export class ApiRequestError extends Error {
  code: string

  constructor(code: string, message: string) {
    super(message)
    this.code = code
    this.name = 'ApiRequestError'
  }
}

function getToken(): string | null {
  return localStorage.getItem('auth_token')
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let errorData: { error?: ApiError } | undefined
    try {
      errorData = await res.json()
    } catch {
      // ignore parse errors
    }

    if (errorData?.error) {
      throw new ApiRequestError(errorData.error.code, errorData.error.message)
    }

    if (res.status === 401) {
      throw new ApiRequestError('unauthorized', 'Session expired. Please login again.')
    }

    throw new ApiRequestError('unknown', 'Something went wrong. Please try again.')
  }

  return res.json()
}

export const api = {
  get: <T>(url: string) => request<T>('GET', url),
  post: <T>(url: string, body: unknown) => request<T>('POST', url, body),
}
