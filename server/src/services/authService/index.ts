export * from './types'

import { register } from './libs/register'
import { login } from './libs/login'

export const authService = {
  register,
  login,
}
