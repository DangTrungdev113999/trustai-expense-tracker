# Task: Viết types + tests cho Auth + Transaction Management

## Steps
1. git checkout develop && git checkout -b feature/auth-transactions
2. Viết shared types (TypeScript interfaces) từ spec
3. Viết unit tests: API tests + component tests
4. Commit: git add -A && git commit -m "test: add types + tests for auth-transactions (all RED)"

## Spec

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

**Test Scenarios:**

**Auth:**
1. Register với email hợp lệ + password ≥6 chars → 200 + token
2. Register với email đã tồn tại → 400
3. Register với password <6 chars → 400
4. Login với credentials đúng → 200 + token
5. Login với credentials sai → 401
6. Login thiếu email hoặc password → 400

**Transactions:**
7. Tạo transaction (authenticated) với data hợp lệ → 201 + transaction object có đủ fields
8. Tạo transaction không có token → 401
9. Tạo transaction với amount ≤0 → 400
10. Tạo transaction với type không hợp lệ → 400
11. GET /api/transactions (authenticated) → 200 + array transactions của user đó
12. GET /api/transactions (không authenticated) → 401
13. User A không thấy transactions của User B (isolation test)

## Rules
- Chỉ viết types + tests. KHÔNG implement.
- Tests phải chạy được nhưng FAIL (RED).
- Tự quyết định vị trí file tests.
- **FE tests = CHỈ render tests.** Verify components render + key elements exist.
- **TUYỆT ĐỐI KHÔNG dùng vi.mock() trong FE tests.** Không mock react-router-dom, useNavigate, fetch, etc.
- FE test pattern: `render(<MemoryRouter><Component /></MemoryRouter>)` → `expect(screen.getByRole(...))`.
