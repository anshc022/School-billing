# Customization Guide - Fee Slip Template

## Overview

The fee slip is generated as a professional PDF document. You can customize the layout, styling, colors, and included information by modifying the fee slip template component.

## File Location

- **Template Component:** `src/renderer/components/FeeSlipPreview.tsx`
- **PDF Generation:** `src/main/ipc-handlers.ts` (handlePrintOps function)

## Customizing the Layout

### Adding/Removing Fields

Edit the fee slip template in `FeeSlipPreview.tsx`:

```tsx
// Add a new field by inserting:
<div className="flex justify-between mb-3">
  <span className="font-semibold">Custom Field:</span>
  <span>{data.customField}</span>
</div>
```

### Changing Colors

Modify the Tailwind classes in the template:

```tsx
// Current header (blue):
<div className="bg-blue-600 text-white">

// Change to green:
<div className="bg-green-600 text-white">

// Change to custom color:
<div style={{ backgroundColor: '#1f2937' }} className="text-white">
```

### Adjusting Spacing and Typography

```tsx
// Increase padding:
<div className="p-8">  {/* was p-6 */}

// Change font size:
<h1 className="text-4xl">  {/* was text-3xl */}

// Adjust margins:
<div className="mb-8">  {/* was mb-6 */}
```

## Adding School Logo/Stamp

### Include Logo Image

```tsx
<div className="mb-6">
  <img 
    src={require('../../../public/logo.png')} 
    alt="School Logo" 
    style={{ width: '120px', height: 'auto' }}
  />
</div>
```

### Add Stamp on Bottom Right

```tsx
<div className="absolute bottom-8 right-8">
  <img 
    src={require('../../../public/stamp.png')} 
    alt="Official Stamp" 
    style={{ width: '80px', opacity: 0.7 }}
  />
</div>
```

## QR Code Customization

### Change QR Code Size

```tsx
// Current size: 100x100px
<div style={{ width: '100px', height: '100px' }} className="bg-white p-2">

// Increase to 150x150px
<div style={{ width: '150px', height: '150px' }} className="bg-white p-2">
```

### Include QR Code Data

Modify the QR code generation:

```tsx
const qrData = {
  studentName: student.name,
  receiptId: fee.receiptId,
  amount: fee.amount,
  date: new Date().toISOString(),
}

// QR code will encode this JSON
```

## Print Template Variants

### Compact Template (A5 Size)

```tsx
export const FeeSlipCompact = (props) => {
  return (
    <div style={{ width: '148mm', height: '210mm' }}>
      {/* Reduced padding and spacing */}
      <div className="p-4">
        {/* Content */}
      </div>
    </div>
  )
}
```

### Full-Width Template (A4 Size)

```tsx
export const FeeSlipFull = (props) => {
  return (
    <div style={{ width: '210mm', height: '297mm' }}>
      {/* Normal padding and spacing */}
      <div className="p-8">
        {/* Content */}
      </div>
    </div>
  )
}
```

## Conditional Content

### Show/Hide Fields Based on Payment Status

```tsx
{fee.status === 'paid' && (
  <div className="bg-green-50 p-4 rounded mb-4">
    <p className="text-green-700">✓ Payment Received</p>
  </div>
)}

{fee.status === 'unpaid' && (
  <div className="bg-red-50 p-4 rounded mb-4">
    <p className="text-red-700">⚠ Payment Pending</p>
  </div>
)}
```

### Include Discount/Extra Charges

```tsx
{fee.discount > 0 && (
  <div className="flex justify-between mb-3">
    <span className="font-semibold">Discount:</span>
    <span className="text-green-600">-₹{fee.discount / 100}</span>
  </div>
)}

{fee.lateFee > 0 && (
  <div className="flex justify-between mb-3">
    <span className="font-semibold">Late Fee:</span>
    <span className="text-red-600">+₹{fee.lateFee / 100}</span>
  </div>
)}
```

## Footer Customization

### Add Payment Instructions

```tsx
<div className="mt-6 pt-6 border-t border-slate-300 text-xs text-slate-600">
  <p className="font-semibold mb-2">Payment Instructions:</p>
  <p>• Online: Account No. XXXXXXXXX, IFSC: XXXXX</p>
  <p>• Cash: Submit at school office during office hours</p>
  <p>• Cheque: Post-dated cheques accepted</p>
</div>
```

### Add Notes Section

```tsx
<div className="mt-4 bg-yellow-50 p-3 rounded">
  <p className="text-xs text-slate-700">
    <strong>Note:</strong> This is a computer-generated receipt. 
    No signature required.
  </p>
</div>
```

## Printer-Specific Settings

### Optimize for Thermal Printer

```tsx
export const FeeSlipThermal = (props) => {
  return (
    <div style={{ width: '80mm' }}>
      {/* Narrower layout for thermal printer */}
    </div>
  )
}
```

### Page Break for Multiple Slips

```tsx
<div className="page-break" style={{ pageBreakAfter: 'always' }}>
  {/* First slip */}
</div>
<div>
  {/* Next slip */}
</div>
```

## Environment Variables

Create `.env.local` to configure:

```env
VITE_SCHOOL_NAME=Your School Name
VITE_SCHOOL_ADDRESS=School Address
VITE_SCHOOL_PHONE=+91-XXXXXXXXXX
VITE_SCHOOL_EMAIL=admin@school.com
VITE_CURRENCY=INR
VITE_CURRENCY_SYMBOL=₹
```

Then use in template:

```tsx
<p>{import.meta.env.VITE_SCHOOL_NAME}</p>
```

## Testing Your Changes

1. Generate a fee slip PDF with your changes
2. Print to file or preview in PDF reader
3. Check alignment, spacing, and clarity
4. Test with different screen sizes (if applicable)

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| QR code not showing | Ensure QR code library is installed: `npm install qrcode` |
| Logo doesn't appear | Check image path and file exists in `public/` folder |
| Text overlapping | Increase container width or reduce font size |
| Page margins wrong | Adjust `style={{ width, height }}` properties |
| Print quality poor | Ensure print resolution is 300 DPI in browser print dialog |

---

For questions or advanced customization, review the React/Tailwind documentation or modify the component directly.
