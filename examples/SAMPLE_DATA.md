# This is a sample example data file showing the structure of exported reports

## Sample Student Export (students.json)

```json
[
  {
    "id": 1,
    "name": "Rahul Kumar",
    "class": "10-A",
    "section": "Science",
    "rollNo": "001",
    "parentName": "Mr. Kumar",
    "phone": "9876543210",
    "address": "123 Main St, Delhi",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Priya Singh",
    "class": "10-B",
    "section": "Commerce",
    "rollNo": "002",
    "parentName": "Mr. Singh",
    "phone": "9876543211",
    "address": "456 Park Rd, Mumbai",
    "createdAt": "2024-01-15T10:35:00Z"
  }
]
```

## Sample Monthly Report (monthly-report-jan-2024.json)

```json
{
  "month": "January",
  "year": 2024,
  "totalAmount": 500000,
  "paidAmount": 100000,
  "pendingAmount": 400000,
  "totalRecords": 5,
  "paidRecords": 1,
  "unpaidRecords": 4,
  "fees": [
    {
      "id": 1,
      "studentId": 1,
      "studentName": "Rahul Kumar",
      "class": "10-A",
      "amount": 100000,
      "status": "paid",
      "receiptId": "RCPT-20240101-0001",
      "paymentDate": "2024-01-05T14:22:00Z"
    },
    {
      "id": 2,
      "studentId": 2,
      "studentName": "Priya Singh",
      "class": "10-B",
      "amount": 100000,
      "status": "unpaid",
      "receiptId": "RCPT-20240102-0002",
      "paymentDate": null
    }
  ]
}
```

## CSV Export Format (fees-report.csv)

```csv
Receipt ID,Student Name,Class,Month,Year,Amount (₹),Status,Payment Date,Parent Name,Phone
RCPT-20240101-0001,Rahul Kumar,10-A,January,2024,500,paid,2024-01-05,Mr. Kumar,9876543210
RCPT-20240102-0002,Priya Singh,10-B,January,2024,500,unpaid,,Mr. Singh,9876543211
RCPT-20240103-0003,Amit Patel,9-A,January,2024,500,unpaid,,Mr. Patel,9876543212
RCPT-20240104-0004,Neha Verma,9-B,January,2024,500,unpaid,,Mrs. Verma,9876543213
RCPT-20240105-0005,Vikram Dubey,8-A,January,2024,500,unpaid,,Mr. Dubey,9876543214
```

## Excel Export Format (fees-report.xlsx)

| Receipt ID | Student Name | Class | Month | Year | Amount (₹) | Status | Payment Date | Parent Name | Phone |
|---|---|---|---|---|---|---|---|---|---|
| RCPT-20240101-0001 | Rahul Kumar | 10-A | January | 2024 | 500 | paid | 2024-01-05 | Mr. Kumar | 9876543210 |
| RCPT-20240102-0002 | Priya Singh | 10-B | January | 2024 | 500 | unpaid | | Mr. Singh | 9876543211 |
| RCPT-20240103-0003 | Amit Patel | 9-A | January | 2024 | 500 | unpaid | | Mr. Patel | 9876543212 |

## Student History Export

```json
{
  "studentId": 1,
  "studentName": "Rahul Kumar",
  "class": "10-A",
  "section": "Science",
  "totalFeesAmount": 1000000,
  "totalPaidAmount": 500000,
  "totalPendingAmount": 500000,
  "feeRecords": [
    {
      "month": "January",
      "year": 2024,
      "amount": 500000,
      "status": "paid",
      "receiptId": "RCPT-20240101-0001",
      "paymentDate": "2024-01-05T14:22:00Z"
    },
    {
      "month": "February",
      "year": 2024,
      "amount": 500000,
      "status": "unpaid",
      "receiptId": "RCPT-20240201-0015",
      "paymentDate": null
    }
  ]
}
```

Note: The actual PDF output would be a formatted fee slip document with:
- School header and logo
- Student information
- Fee details (month, amount, status)
- Receipt ID and QR code
- Payment instructions
- Signature/stamp area
