# Task: Implement Auth + Transaction Management Frontend

## Tests cần pass
[Quinn sẽ tạo test files — đọc sau khi Quinn commit]

## UX Spec

### Register Page
**States:**
- Default: Form với 2 fields (Email, Password), button "Register", link "Already have account? Login"
- Loading: Button hiển thị spinner, disabled, text "Registering..."
- Error: Alert box màu đỏ phía trên form, hiển thị message lỗi từ API
- Success: Redirect về Transactions List (đã authenticated)

**Interactions:**
- User nhập email + password → click Register → show loading state
- Validation error (email invalid/password <6 chars) → hiển thị error state, focus vào field lỗi
- Email đã tồn tại → hiển thị error "Email already exists"
- Success → redirect + fade transition (200ms)

**Responsive:**
- Mobile: Form chiếm 100% width, padding 16px
- Desktop: Form max-width 400px, centered

### Login Page
**States:**
- Default: Form với 2 fields (Email, Password), button "Login", link "Don't have account? Register"
- Loading: Button hiển thị spinner, disabled, text "Logging in..."
- Error: Alert box màu đỏ phía trên form, hiển thị "Invalid credentials" hoặc message lỗi từ API
- Success: Redirect về Transactions List

**Interactions:**
- User nhập email + password → click Login → show loading state
- Invalid credentials → hiển thị error state, không clear password field
- Success → redirect + fade transition (200ms)

**Responsive:**
- Mobile: Form chiếm 100% width, padding 16px
- Desktop: Form max-width 400px, centered

### Add Transaction (Modal)
**States:**
- Default: Modal với form gồm Type (radio: Income/Expense), Category (dropdown), Amount (number input), Date (date picker), Note (textarea optional), buttons "Cancel" + "Save"
- Loading: Save button hiển thị spinner, disabled, text "Saving..."
- Error: Alert box màu đỏ trong modal, hiển thị message lỗi (amount ≤0, invalid date, etc.)
- Success: Modal đóng + fade out (150ms), transaction mới xuất hiện đầu danh sách với subtle highlight (300ms)

**Interactions:**
- User click "Add Transaction" (button floating bottom-right trên mobile, top-right trên desktop) → modal mở với fade-in + scale animation (200ms)
- User chọn Type (Income/Expense) → Category dropdown update options tương ứng
- User nhập Amount → format số tự động (e.g., 1000000 → 1,000,000)
- User chọn Date → date picker mở, default = today
- User click Cancel → modal đóng, không save
- User click Save → validate amount >0 → call API → success/error state
- Click outside modal hoặc ESC key → đóng modal (nếu chưa có changes, hoặc confirm nếu đã nhập data)

**Responsive:**
- Mobile: Modal fullscreen, padding 16px
- Desktop: Modal centered, max-width 500px, overlay backdrop

### Transactions List Page
**States:**
- Default: Header "Transactions", button "Add Transaction", danh sách transactions (mới nhất lên đầu)
- Loading: Skeleton loaders (3-5 items giả lập structure của transaction card)
- Empty: Icon + text "No transactions yet. Add your first transaction!", button "Add Transaction"
- Error: Alert box "Failed to load transactions. Retry?" với button Retry
- Success: Danh sách transactions, mỗi item hiển thị: Type icon (income=green↑, expense=red↓), Category, Amount (colored: income=green, expense=red), Date, Note (nếu có)

**Interactions:**
- Page load → show loading skeleton → fetch transactions → show list hoặc empty state
- Click "Add Transaction" → mở Add Transaction modal
- Click Retry (khi error) → re-fetch transactions
- Scroll (nếu có nhiều transactions) → smooth scroll

**Responsive:**
- Mobile: List layout, mỗi transaction là card full-width, stack vertical
- Desktop: Grid hoặc table layout, 2-3 columns (Type, Category, Amount, Date, Note)

### Error Patterns (chung)
- Network error: "Connection failed. Please check your internet."
- Auth expired: Redirect về Login page, hiển thị toast "Session expired. Please login again."
- Validation error: Alert box với message cụ thể từ API
- Generic error: "Something went wrong. Please try again."

### Loading Patterns (chung)
- Initial load (Transactions List): Skeleton loaders (shimmer effect)
- Action pending (Register/Login/Add Transaction): Button spinner + disabled state + loading text
- Modal open/close: Fade + scale animation (150-200ms)

## Steps
1. ĐỌC UX spec TRƯỚC — hiểu user thấy gì, cảm gì ở mỗi state
2. Đọc types + tests để hiểu requirements
3. Implement FE theo UX spec: components, pages, interactions — TỰ QUYẾT ĐỊNH cách tổ chức
4. BẮT BUỘC implement: loading states, error feedback, empty states theo UX spec
5. BẮT BUỘC: Config Vite proxy `/api` → `localhost:3000` (cho tunnel testing)
6. Nếu BE chưa xong → dùng MSW mock
7. Run: npx vitest run [test-path]
8. Iterate đến khi ALL GREEN
9. Commit: git add -A && git commit -m "feat: implement auth-transactions frontend"

## Rules
- TOÀN QUYỀN: folder structure, UI framework, state management, routing
- TypeScript strict, no any
- Import shared types đã có
- KHÔNG sửa test assertions (expect statements). NẾU test có lỗi setup/import (vi.mock hoisting, missing module) → ĐƯỢC PHÉP fix setup.
- BẮT BUỘC Vite proxy cho API calls
- **UX spec là yêu cầu, không phải gợi ý.** Implement tất cả states + interactions trong spec.
- **Tự chủ thêm polish** nếu UX spec không cover (icons, transitions, hover states) — dùng best practices.

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
