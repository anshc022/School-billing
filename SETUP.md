# Development & Build Setup Guide

## Prerequisites

- **Node.js:** 18.x or higher
- **npm:** 9.x or higher
- **Git:** For version control

### Platform-Specific Requirements

#### Windows
- Windows 7 SP1 or later
- Visual C++ Redistributable (included in build)
- (Optional) Windows Build Tools for native modules

#### macOS
- macOS 10.13 or later
- Xcode Command Line Tools: `xcode-select --install`
- (Optional) CocoaPods for native modules

#### Linux
- Ubuntu 18.04+ / Debian 10+ / Fedora 32+
- Build essentials: `sudo apt-get install build-essential python3`

## Installation Steps

### 1. Clone/Setup Project

```bash
cd school-billing
npm install
```

### 2. Initialize Database

```bash
# Create database and seed sample data
npm run migrate

# This will:
# - Create database/school.db
# - Create schema (users, students, fees tables)
# - Seed 1 admin user, 5 students, 10 fee records
```

### 3. Start Development

```bash
# Start Electron + Vite with hot reload
npm run dev

# This will:
# - Launch Vite dev server on http://localhost:5173
# - Open Electron window
# - Enable hot module replacement (HMR)
# - Open DevTools automatically
```

## Development Workflow

### File Structure During Development

```
dist/              (auto-generated on build)
├── main/
│   └── index.js   (compiled Electron main)
├── renderer/      (Vite build output)
└── ...

src/
├── main/          (Electron main process - TypeScript)
├── preload/       (IPC bridge - TypeScript)
└── renderer/      (React app - TypeScript + TSX)
```

### Making Changes

#### React Component Changes
- Edit files in `src/renderer/`
- Changes auto-reload in Electron window (HMR)
- No manual reload needed

#### Main Process Changes
- Edit files in `src/main/` or `src/preload/`
- Electron automatically restarts (via electron-reloader)
- Takes ~1-2 seconds

#### Database Schema Changes
- Edit `prisma/schema.prisma`
- Create migration: `npx prisma migrate dev --name your_migration_name`
- Restart dev server

## Building for Production

### Step 1: Build React and Compile Electron

```bash
npm run build

# This will:
# 1. Build React app to dist/renderer/
# 2. Compile TypeScript (src/main/ → dist/main/)
# 3. Run electron-builder
# 4. Generate platform-specific installers
```

### Step 2: Build for Specific Platform

```bash
# Windows (generates .nsis and .portable)
npm run build

# macOS (generates .dmg and .zip)
npm run build

# Linux (generates .AppImage and .deb)
npm run build

# Note: electron-builder auto-detects your OS and builds for it
# To build for other platforms, you need cross-compilation setup
```

### Step 3: Run the Packaged App

```bash
npm run start

# Or open the installer from dist/
# - Windows: dist/School Billing System Setup 1.0.0.exe
# - macOS: dist/School Billing System-1.0.0.dmg
# - Linux: dist/School Billing System-1.0.0.AppImage
```

## Testing

### Run Unit Tests

```bash
npm run test

# Run tests in watch mode
npm run test -- --watch

# Generate coverage report
npm run test:coverage

# Open coverage in browser
npm run test:ui
```

### Test Files Location

```
tests/
├── setup.ts              # Vitest configuration
├── utils.test.ts         # Utility functions tests
└── DashboardPage.test.tsx # Component tests
```

### Adding New Tests

```bash
# Create test file: src/renderer/components/MyComponent.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeTruthy()
  })
})
```

## Code Quality

### Run Linter

```bash
npm run lint

# Fix automatically
npm run lint:fix
```

### Format Code

```bash
npm run format

# Check without modifying
npm run format:check
```

### Pre-commit Hooks

Husky automatically runs linter before commits:

```bash
# First-time setup
npx husky install

# Hooks are now active
git commit -m "message"  # Runs linting first
```

## Debugging

### Electron DevTools

- Open in app: `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS)
- Inspect React components
- Debug JavaScript
- Check Network (IPC calls)
- View Console logs

### IPC Communication

1. Open DevTools (Ctrl+Shift+I)
2. Go to Console tab
3. Test IPC:
   ```javascript
   // Test API call
   window.api.getDashboardStats().then(result => console.log(result))
   ```

### Database Debugging

```bash
# Open Prisma Studio (interactive DB explorer)
npx prisma studio

# Opens http://localhost:5555
```

## Environment Variables

Create `.env.local` in project root:

```env
# Database
DATABASE_URL=file:./database/school.db

# App
APP_NAME=School Billing System
VITE_API_URL=http://localhost:3000

# Feature flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_EXPORT=true
```

Use in code:

```typescript
// In Electron main
const dbUrl = process.env.DATABASE_URL

// In React/Vite
const apiUrl = import.meta.env.VITE_API_URL
```

## Troubleshooting Development

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf dist node_modules/.vite
```

### Issue: Database locked/corrupted

**Solution:**
```bash
# Backup current database
cp database/school.db database/school.db.backup

# Delete and recreate
rm database/school.db
npm run migrate
```

### Issue: Hot reload not working

**Solution:**
- Check Vite dev server is running: `http://localhost:5173`
- Restart: `npm run dev`
- Check browser console for errors

### Issue: IPC communication not working

**Solution:**
- Verify preload script path in `src/main/index.ts`
- Check contextIsolation is `true`
- Verify IPC handlers in `src/main/ipc-handlers.ts`
- Use DevTools console to test: `window.api.getDashboardStats()`

### Issue: Prisma schema changes not applied

**Solution:**
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Generate Prisma client
npx prisma generate

# Restart dev server
npm run dev
```

## Performance Optimization

### Build Size

```bash
# Analyze build size
npm run build -- --analyze

# Typical sizes:
# Uncompressed: 300-400 MB (includes Electron + node_modules)
# Installer: 150-200 MB
# Extracted: 300-400 MB
```

### Memory Usage

- Development: ~300-400 MB
- Production: ~200-300 MB

### Startup Time

- First launch: 2-3 seconds
- Subsequent: <1 second

## Release Checklist

Before building for distribution:

- [ ] Update version in `package.json`
- [ ] Update `README.md` with new features
- [ ] Run full test suite: `npm run test`
- [ ] Run linter: `npm run lint`
- [ ] Test build locally: `npm run build`
- [ ] Test packaged app: `npm run start`
- [ ] Generate sample PDFs for examples/
- [ ] Update CHANGELOG.md
- [ ] Tag release in git: `git tag v1.0.0`

## Distribution

### Code Signing (Windows)

```bash
# Get certificate for code signing
# Set in build configuration

# environment variable:
set CERTIFICATE_FILE=path/to/certificate.pfx
set CERTIFICATE_PASSWORD=your_password

npm run build
```

### Code Signing (macOS)

```bash
# Set environment variables
export APPLE_ID=your@email.com
export APPLE_PASSWORD=your_app_password
export APPLE_TEAM_ID=XXXXXXXXXX

npm run build
```

### Notarization (macOS)

Automatic via electron-builder if code signing credentials are set.

## Resources

- [Electron Docs](https://www.electronjs.org/docs)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

Happy coding! 🚀
