import { Link } from 'react-router-dom'

export function RegisterForm() {
  return (
    <form>
      <div>
        <label htmlFor="register-email">Email</label>
        <input id="register-email" type="email" name="email" />
      </div>

      <div>
        <label htmlFor="register-password">Password</label>
        <input id="register-password" type="password" name="password" />
      </div>

      <button type="submit">Register</button>

      <p>
        Already have account? <Link to="/login">Login</Link>
      </p>
    </form>
  )
}
