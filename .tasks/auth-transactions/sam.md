# Task: Implement Auth + Transaction Management Backend

## Tests cần pass
[Quinn sẽ tạo test files — đọc sau khi Quinn commit]

## Steps
1. Đọc types + tests để hiểu requirements
2. Implement BE: routes, logic, database — TỰ QUYẾT ĐỊNH cách tổ chức
3. Run: npx vitest run [test-path]
4. Iterate đến khi ALL GREEN
5. Commit: git add -A && git commit -m "feat: implement auth-transactions backend"

## Rules
- TOÀN QUYỀN: folder structure, dependencies, patterns, database
- TypeScript strict, no any
- Import shared types đã có
- KHÔNG sửa test files

## Spec

**API Contracts:**

```
POST /api/auth/register
Request: RegisterRequest
Response: AuthResponse
Errors:
  - 400: Email already exists
  - 400: Invalid email format
  - 400: Password too weak (min 6 chars)

POST /api/auth/login
Request: LoginRequest
Response: AuthResponse
Errors:
  - 401: Invalid credentials
  - 400: Missing email or password

POST /api/transactions
Headers: Authorization: Bearer <token>
Request: CreateTransactionRequest
Response: { transaction: Transaction }
Errors:
  - 401: Unauthorized (missing/invalid token)
  - 400: Invalid amount (must be > 0)
  - 400: Invalid date format
  - 400: Invalid type or category

GET /api/transactions
Headers: Authorization: Bearer <token>
Response: GetTransactionsResponse
Errors:
  - 401: Unauthorized (missing/invalid token)
```

**Shared Types:**
```typescript
// User & Auth
interface User {
  id: string;
  email: string;
  createdAt: string; // ISO 8601
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Transactions
type TransactionType = 'income' | 'expense';
type Category = 'Food' | 'Transport' | 'Entertainment' | 'Shopping' | 'Salary' | 'Freelance' | 'Other';

interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: Category;
  amount: number; // positive number
  date: string; // ISO 8601
  note?: string;
  createdAt: string; // ISO 8601
}

interface CreateTransactionRequest {
  type: TransactionType;
  category: Category;
  amount: number;
  date: string; // ISO 8601
  note?: string;
}

interface GetTransactionsResponse {
  transactions: Transaction[];
}
```
