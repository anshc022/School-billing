# API Reference

## IPC (Inter-Process Communication)

All communication between Electron main process and React renderer is done through the `window.api` object exposed via secure IPC with context isolation.

## Authentication

### `login(username: string, password: string)`

Authenticate admin user.

**Parameters:**
- `username` (string): Admin username
- `password` (string): Admin password

**Returns:**
```javascript
{
  success: boolean,
  user?: { id: number, username: string, role: string },
  error?: string
}
```

**Example:**
```javascript
const result = await window.api.login('admin', 'admin123')
if (result.success) {
  console.log('Logged in as:', result.user.username)
}
```

### `logout()`

Clear session and logout current user.

**Returns:**
```javascript
{ success: boolean }
```

## Students

### `getStudents()`

Fetch all students.

**Returns:**
```javascript
{
  success: boolean,
  data?: Student[],
  error?: string
}
```

**Student Schema:**
```typescript
{
  id: number
  name: string
  class: string
  section: string
  rollNo: string
  parentName: string
  phone: string
  address: string
  createdAt: Date
  updatedAt: Date
}
```

### `getStudent(id: number)`

Fetch a single student with fee records.

**Returns:**
```javascript
{
  success: boolean,
  data?: { ...Student, fees: Fee[] },
  error?: string
}
```

### `createStudent(data: Partial<Student>)`

Create a new student record.

**Parameters:**
```javascript
{
  name: string,
  class: string,
  section: string,
  rollNo: string,
  parentName: string,
  phone: string,
  address: string
}
```

**Returns:**
```javascript
{ success: boolean, data?: Student, error?: string }
```

### `updateStudent(id: number, data: Partial<Student>)`

Update an existing student.

**Returns:**
```javascript
{ success: boolean, data?: Student, error?: string }
```

### `deleteStudent(id: number)`

Delete a student and all associated fee records.

**Returns:**
```javascript
{ success: boolean, error?: string }
```

### `searchStudents(query: string, filters?: { class?: string })`

Search students by name, parent name, or roll number.

**Parameters:**
- `query` (string): Search term
- `filters` (optional): Additional filters
  - `class` (string): Filter by class

**Returns:**
```javascript
{ success: boolean, data?: Student[], error?: string }
```

## Fees

### `getFees()`

Fetch all fee records.

**Returns:**
```javascript
{
  success: boolean,
  data?: Fee[],
  error?: string
}
```

**Fee Schema:**
```typescript
{
  id: number
  studentId: number
  student: Student
  month: number         // 1-12
  year: number
  amount: number        // In paise (₹1 = 100 paise)
  status: 'paid' | 'unpaid'
  paymentMethod?: string  // 'online' | 'cash' | 'check'
  date?: Date
  receiptId: string     // Auto-generated: RCPT-YYYYMMDD-XXXX
  createdAt: Date
  updatedAt: Date
}
```

### `getFeesByStudent(studentId: number)`

Fetch all fees for a specific student.

**Returns:**
```javascript
{ success: boolean, data?: Fee[], error?: string }
```

### `createFee(data: PartialFee)`

Create a new fee record. Receipt ID is auto-generated.

**Parameters:**
```javascript
{
  studentId: number,
  month: number,
  year: number,
  amount: number,
  status?: 'paid' | 'unpaid',
  paymentMethod?: string,
  date?: Date
}
```

**Returns:**
```javascript
{ success: boolean, data?: Fee, error?: string }
```

### `updateFee(id: number, data: PartialFee)`

Update a fee record (typically to change status).

**Parameters:**
```javascript
{
  status?: 'paid' | 'unpaid',
  paymentMethod?: string,
  date?: Date
}
```

**Returns:**
```javascript
{ success: boolean, data?: Fee, error?: string }
```

### `deleteFee(id: number)`

Delete a fee record.

**Returns:**
```javascript
{ success: boolean, error?: string }
```

## Reports

### `getMonthlyReport(month: number, year: number)`

Generate monthly fee report.

**Parameters:**
- `month` (number): 1-12
- `year` (number): e.g., 2024

**Returns:**
```javascript
{
  success: boolean,
  data?: {
    fees: Fee[],
    totalAmount: number,
    paidAmount: number,
    pendingAmount: number
  },
  error?: string
}
```

### `getStudentHistory(studentId: number)`

Get complete fee history for a student.

**Returns:**
```javascript
{ success: boolean, data?: Fee[], error?: string }
```

### `exportToCSV(data: any[], filename: string)`

Export data to CSV file.

**Parameters:**
- `data` (array): Data to export
- `filename` (string): Output filename

**Returns:**
```javascript
{ success: boolean, path?: string, error?: string }
```

### `exportToExcel(data: any[], filename: string)`

Export data to Excel file.

**Returns:**
```javascript
{ success: boolean, path?: string, error?: string }
```

## PDF & Printing

### `generateSlipPDF(feeId: number, template?: 'compact' | 'full')`

Generate a PDF fee slip.

**Parameters:**
- `feeId` (number): Fee record ID
- `template` (optional): 'compact' (A5) or 'full' (A4), default: 'full'

**Returns:**
```javascript
{ success: boolean, path?: string, error?: string }
```

### `printSlip(feeId: number)`

Print a fee slip directly to system printer.

**Returns:**
```javascript
{ success: boolean, error?: string }
```

### `previewSlip(feeId: number)`

Get HTML preview of fee slip.

**Returns:**
```javascript
{ success: boolean, html?: string, error?: string }
```

## Dashboard

### `getDashboardStats()`

Get dashboard statistics.

**Returns:**
```javascript
{
  success: boolean,
  data?: {
    totalStudents: number,
    totalFees: number,
    paidFees: number,
    totalAmount: number,
    paidAmount: number,
    pendingAmount: number
  },
  error?: string
}
```

## Settings

### `getSettings()`

Get application settings.

**Returns:**
```javascript
{
  success: boolean,
  data?: {
    schoolName: string,
    currency: string,
    darkMode: boolean,
    ...
  },
  error?: string
}
```

### `updateSettings(settings: object)`

Update application settings.

**Returns:**
```javascript
{ success: boolean, data?: object, error?: string }
```

## Events

### `onNotification(callback: (message: string, type: string) => void)`

Listen for toast notifications from main process.

**Parameters:**
- `message` (string): Notification text
- `type` (string): 'success' | 'error' | 'info'

**Example:**
```javascript
window.api.onNotification((message, type) => {
  console.log(`${type}: ${message}`)
})
```

## Error Handling

All API calls return a result object with `success` boolean and optional `error` message:

```javascript
const result = await window.api.createStudent(data)

if (result.success) {
  console.log('Student created:', result.data)
} else {
  console.error('Error:', result.error)
}
```

## Type Definitions

Complete TypeScript types are available in `src/renderer/types/` for better IDE support.

---

For implementation details, see:
- `src/main/ipc-handlers.ts` - Handler implementations
- `src/preload/index.ts` - API bridge definition
