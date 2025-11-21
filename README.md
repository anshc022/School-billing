# School Billing System

🎓 **A production-ready Electron + React + Vite desktop application** for managing student fee billing, generating and printing fee slips, and tracking payments.

**Status: ✅ Production Ready | Version: 1.0.0 | License: MIT**

---

## ⚡ Quick Start (3 Commands)

```bash
npm install         # Install all dependencies
npm run migrate     # Create database & seed sample data
npm run dev        # Start development server
```

**Login with:** `admin` / `admin123`

---

## ✨ Key Features

- 🔐 **Secure Admin Login** - Local authentication with bcryptjs password hashing
- 👥 **Student Management** - Full CRUD, search, filter by class
- 💰 **Fee Management** - Track monthly fees, payment status, receipt IDs
- 📊 **Dashboard** - Overview statistics (students, fees collected, pending)
- 📄 **PDF Generation** - Professional fee slips with QR code placeholders
- 🖨️ **Print Support** - Print preview and direct printing capabilities
- 📈 **Reports & Export** - Monthly reports, student history, CSV/Excel export
- 💾 **Offline First** - Complete offline functionality, no internet required
- 🎨 **Modern UI** - Clean, minimal design with Tailwind CSS
- 🌙 **Dark Mode** - Built-in dark/light theme toggle
- 📱 **Responsive** - Works on Windows, macOS, and Linux
- 🚀 **Fast** - Vite HMR, instant hot reload during development

---

## 📚 Documentation Guide

| Document | Purpose |
|----------|---------|
| [**INSTALLATION.md**](./INSTALLATION.md) | Step-by-step setup for first-time users |
| [**SETUP.md**](./SETUP.md) | Development environment & build instructions |
| [**API.md**](./API.md) | Complete IPC API reference |
| [**CUSTOMIZATION.md**](./CUSTOMIZATION.md) | How to customize fee slip templates |
| [**PROJECT_SUMMARY.md**](./PROJECT_SUMMARY.md) | Project overview & file structure |
| [**CHECKLIST.md**](./CHECKLIST.md) | Verification of all generated components |

---

## 🚀 Features

### Admin & Security
- Admin login with secure password hashing
- Context isolation and secure IPC communication
- Input validation and SQL injection prevention
- Session persistence

## Building for Production

```bash
# Build and package for your platform
npm run build

# After building, run the packaged app
npm run start
```

This will generate installers for:
- **Windows:** .nsis, .portable
- **macOS:** .dmg, .zip
- **Linux:** .AppImage, .deb

## Project Structure

```
school-billing/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── index.ts             # Main app entry
│   │   ├── ipc-handlers.ts      # IPC handlers (CRUD, auth, etc)
│   │   ├── db.ts                # Database initialization
│   │   ├── utils.ts             # Utility functions
│   │   └── seed.ts              # Database seeding script
│   ├── preload/
│   │   └── index.ts             # Preload bridge (IPC API)
│   └── renderer/                # React Vite app
│       ├── App.tsx              # Main React component
│       ├── main.tsx             # React entry point
│       ├── index.css            # Global styles
│       ├── pages/               # Page components
│       │   ├── LoginPage.tsx
│       │   ├── DashboardPage.tsx
│       │   ├── StudentsPage.tsx
│       │   ├── FeesPage.tsx
│       │   ├── ReportsPage.tsx
│       │   └── SettingsPage.tsx
│       ├── components/          # Reusable components
│       │   ├── Layout.tsx
│       │   ├── LayoutSidebar.tsx
│       │   ├── ToastProvider.tsx
│       │   ├── StudentForm.tsx
│       │   ├── FeeForm.tsx
│       │   ├── StudentTable.tsx
│       │   └── FeeSlipPreview.tsx
│       ├── hooks/               # React hooks
│       │   ├── useAuth.ts
│       │   ├── useToast.ts
│       │   └── useDashboardStats.ts
│       ├── lib/                 # Utilities
│       └── types/               # TypeScript types
├── prisma/
│   └── schema.prisma            # Database schema
├── database/
│   └── school.db                # SQLite database file
├── tests/
│   ├── setup.ts                 # Vitest setup
│   ├── utils.test.ts            # Unit tests
│   └── DashboardPage.test.tsx   # Component tests
├── public/                      # App icons and assets
├── index.html                   # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── README.md
```

## Key Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Electron + Vite with HMR |
| `npm run build` | Build React app and Electron packages |
| `npm run migrate` | Create/migrate database and seed sample data |
| `npm run test` | Run unit and component tests |
| `npm run lint` | Run ESLint checks |
| `npm run format` | Format code with Prettier |

## Database

### Schema Overview

- **users**: Admin account with hashed password
- **students**: Student records (name, class, contact, parent info)
- **fees**: Fee records with payment status and receipt ID

### Location

- **Dev:** `database/school.db`
- **Production:** Stored in app's local data directory

### Seed Data

The database is automatically seeded with:
- 1 admin account
- 5 sample students (Classes 8-10)
- 10 fee records (mix of paid and unpaid)

## Customization

### Change School Information

Edit the settings in `src/main/utils.ts`:
```typescript
export function getSchoolName(): string {
  return 'Your School Name'
}
```

And in the UI, go to **Settings** page to configure:
- School name
- Logo/stamp image
- Currency (INR, USD, etc.)
- Fee slip template

### Modify Fee Slip Template

Edit the fee slip HTML/CSS in `src/renderer/components/FeeSlipPreview.tsx`:
- Adjust layout and styling
- Add/remove fields
- Include custom logos
- Modify QR code positioning

### Change Database Location

Update the database URL in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./path/to/custom/school.db"
}
```

Then run migrations:
```bash
npm run migrate
```

## IPC API Reference

The app exposes a secure `window.api` object in the renderer:

```typescript
// Authentication
api.login(username, password)
api.logout()

// Students
api.getStudents()
api.getStudent(id)
api.createStudent(data)
api.updateStudent(id, data)
api.deleteStudent(id)
api.searchStudents(query, filters)

// Fees
api.getFees()
api.getFeesByStudent(studentId)
api.createFee(data)
api.updateFee(id, data)
api.deleteFee(id)

// Reports
api.getMonthlyReport(month, year)
api.getStudentHistory(studentId)
api.exportToCSV(data, filename)
api.exportToExcel(data, filename)

// PDF & Print
api.generateSlipPDF(feeId, template)
api.printSlip(feeId)
api.previewSlip(feeId)

// Dashboard & Settings
api.getDashboardStats()
api.getSettings()
api.updateSettings(settings)
```

## Troubleshooting

### Database Issues

**Problem:** "SQLITE_CANTOPEN" error
- Ensure `database/` folder exists and is writable
- On Windows, check folder permissions
- Try deleting `database/school.db` and running `npm run migrate` again

**Problem:** "PRISMA_SCHEMA_INVALID_DATASOURCE"
- Make sure the database path in `prisma/schema.prisma` is correct
- Use relative paths starting with `./`

### Build Issues

**Problem:** "electron-builder" failed
- Install Windows Build Tools (on Windows): `npm install --global windows-build-tools`
- On macOS: Ensure Xcode Command Line Tools are installed

**Problem:** Module not found errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

### IPC Communication Issues

**Problem:** "api is not defined" in React
- Ensure preload script is correctly loaded (check `src/main/index.ts`)
- Verify context isolation is enabled in BrowserWindow settings

## File Size & Performance

- **App Size:** ~200-300 MB (with Electron & dependencies)
- **Build Time:** 2-5 minutes depending on platform
- **Memory Usage:** ~150-250 MB during runtime

## Security Notes

1. **Context Isolation:** Enabled to prevent renderer process access to Node.js APIs
2. **Preload Validation:** All IPC messages are validated in the main process
3. **SQL Injection:** Protected via Prisma ORM parameterized queries
4. **Electron Sandbox:** Enabled for additional security
5. **Password Security:** Passwords are hashed with bcryptjs (10 rounds)

## License

MIT © 2024

## Support

For issues, feature requests, or contributions:
1. Check the troubleshooting section above
2. Review the database schema in `prisma/schema.prisma`
3. Check console logs (enable with DevTools)
4. Review IPC handler implementations in `src/main/ipc-handlers.ts`

---

**Happy Billing! 📊✨**
