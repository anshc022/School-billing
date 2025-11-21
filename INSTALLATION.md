# Installation & First Run Guide

## System Requirements

### Minimum
- **RAM:** 4 GB
- **Storage:** 500 MB free space
- **OS:** Windows 7 SP1+, macOS 10.13+, Ubuntu 18.04+

### Recommended
- **RAM:** 8 GB+
- **Storage:** 2 GB free space
- **OS:** Windows 10+, macOS 12+, Ubuntu 22+

### Development Requirements (if building from source)
- **Node.js:** 18.0.0 or higher
- **npm:** 9.0.0 or higher
- **Git:** 2.0.0 or higher

---

## Installation Steps

### Step 1: Clone or Download Project

```bash
# Clone from git
git clone https://github.com/yourusername/school-billing.git
cd school-billing

# OR manually download and extract ZIP
# Then open terminal in the extracted folder
```

### Step 2: Install Dependencies

```bash
npm install

# This will:
# - Download and install all packages (~500 MB)
# - Create node_modules folder
# - Generate Prisma client
# - Set up git hooks
```

**Expected output:**
```
added 450+ packages in 2m
```

If you see errors:
- Try: `npm install --force`
- Or: Delete `node_modules/` and `package-lock.json`, then run `npm install` again

### Step 3: Create Database

```bash
npm run migrate

# This will:
# - Create database/school.db
# - Run database migrations
# - Seed sample data (1 admin, 5 students, 10 fees)
# - Display: "✅ Database seeded successfully!"
```

**Troubleshooting:**
- If error: `rm database/school.db` and run again
- If no output: Check that `prisma/schema.prisma` exists

### Step 4: Start Development Server

```bash
npm run dev

# This will:
# - Start Vite dev server on http://localhost:5173
# - Open Electron window automatically
# - Show console logs
# - Enable hot reload (HMR)
```

**Expected output:**
```
  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
[Electron] Starting app...
```

### Step 5: Login

1. Electron window opens automatically
2. Enter credentials:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Click "Login"
4. Dashboard loads with statistics

---

## Building for Production

### Build for Your Platform

```bash
# Windows/macOS/Linux (auto-detects)
npm run build

# This will:
# - Build React app (dist/renderer/)
# - Compile Electron main (dist/main/)
# - Generate installer/package
# - Takes 2-5 minutes
```

### Locate Built App

**Windows:**
```
dist/School Billing System Setup 1.0.0.exe
dist/School Billing System 1.0.0-portable.exe
```

**macOS:**
```
dist/School Billing System-1.0.0.dmg
dist/School Billing System-1.0.0.zip
```

**Linux:**
```
dist/School Billing System-1.0.0.AppImage
dist/school-billing_1.0.0_amd64.deb
```

### Install & Run

**Windows:**
- Double-click `.exe` file
- Follow installer wizard
- App starts automatically

**macOS:**
- Double-click `.dmg`
- Drag app to Applications folder
- Launch from Applications folder

**Linux:**
- `chmod +x School Billing System-1.0.0.AppImage`
- `./School Billing System-1.0.0.AppImage`
- Or: `sudo dpkg -i school-billing_1.0.0_amd64.deb`

---

## Running Packaged App

```bash
npm run start

# Or open installer/app directly
```

---

## First Time Setup

### Creating Backup

Before customizing, backup the database:

```bash
cp database/school.db database/school.db.backup
```

### Customizing School Information

1. Go to **Settings** page
2. Update:
   - School Name
   - Currency
   - Other settings
3. Click "Save Settings"

### Adding Real Students

1. Go to **Students** page
2. Click "Add Student"
3. Fill form:
   - Name
   - Class/Section
   - Roll Number
   - Parent info
   - Contact details
   - Address
4. Click "Create"

### Recording Fees

1. Go to **Fees** page
2. Click "Add Fee Record"
3. Select student
4. Choose month/year
5. Enter amount
6. Click "Create"

### Marking as Paid

1. Go to **Fees** page
2. Find fee record
3. Click status badge (Unpaid/Paid)
4. Status updates immediately

### Generating Reports

1. Go to **Reports** page
2. Select month and year
3. Click "Generate Report"
4. View or export data

---

## Troubleshooting Installation

### "npm: command not found"
- Node.js not installed
- **Fix:** Download from https://nodejs.org (18+)
- Restart terminal after installation

### "npm ERR! 404 Not Found"
- Package not found on npm registry
- **Fix:** 
  ```bash
  npm cache clean --force
  npm install
  ```

### "EACCES: permission denied"
- Permission issue (macOS/Linux)
- **Fix:**
  ```bash
  sudo chown -R $(whoami) ~/.npm
  npm install
  ```

### "Could not locate the bindings file"
- Native module compilation issue
- **Fix:**
  ```bash
  npm rebuild
  npm run dev
  ```

### "SQLITE_CANTOPEN"
- Database file can't be created
- **Fix:**
  - Ensure `database/` folder exists: `mkdir -p database`
  - Check folder permissions
  - Try: `npm run migrate`

### "Module not found" errors
- Incomplete installation
- **Fix:**
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npm run migrate
  ```

### Electron window doesn't open
- Port 5173 already in use
- **Fix:**
  ```bash
  # Kill process using 5173
  # Windows: netstat -ano | findstr :5173
  # macOS/Linux: lsof -i :5173
  # Then kill the process
  npm run dev
  ```

### "Context Isolation" errors
- IPC communication issue
- **Fix:**
  - Clear DevTools cache: `Ctrl+Shift+Delete`
  - Restart app: `npm run dev`
  - Check browser console for details

### Database locked error
- Another instance is using database
- **Fix:**
  - Close other instances
  - Or: Delete database and recreate
    ```bash
    rm database/school.db
    npm run migrate
    ```

---

## Verification Checklist

After installation, verify:

- [ ] `npm run dev` starts without errors
- [ ] Electron window opens
- [ ] Login works with admin/admin123
- [ ] Dashboard shows data
- [ ] Can navigate all pages
- [ ] Can add a test student
- [ ] Can create a test fee record
- [ ] Database file exists at `database/school.db`

---

## Running Tests

```bash
# Run all tests
npm run test

# Watch mode (re-run on file change)
npm run test -- --watch

# Generate coverage report
npm run test:coverage

# Open coverage report
npm run test:ui
```

---

## Code Quality Checks

```bash
# Check code quality
npm run lint

# Fix automatically
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

---

## Development Workflow

### Making Changes

```bash
# 1. Start dev server
npm run dev

# 2. Edit files in src/
# - Changes auto-reload
# - Hot reload works for React
# - Electron restarts for main process changes

# 3. Check console for errors
# - Open DevTools: Ctrl+Shift+I
# - Check Application tab
# - Check Console tab for IPC messages
```

### Testing Changes

```bash
# Run tests in watch mode
npm run test -- --watch

# Open test UI
npm run test:ui
```

### Building & Testing Package

```bash
# Build
npm run build

# Test packaged app
npm run start
```

---

## Configuration

### Environment Variables

Create `.env.local` in root:

```env
# Database path
DATABASE_URL=file:./database/school.db

# School info
VITE_SCHOOL_NAME=My School
VITE_CURRENCY=INR

# Features
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_EXPORT=true
```

Use in code:

```typescript
// Electron main
const db = process.env.DATABASE_URL

// React/Vite
const schoolName = import.meta.env.VITE_SCHOOL_NAME
```

### Changing Database Location

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./path/to/custom/database.db"
}
```

Then run:
```bash
npm run migrate
```

---

## Updating the App

### Check for Updates

```bash
git pull origin main
npm install
npm run migrate  # If schema changed
npm run dev
```

### Backup Before Updating

```bash
# Backup database
cp database/school.db database/school.db.backup

# Then update
git pull origin main
```

### Rollback if Issues

```bash
# Restore backup
cp database/school.db.backup database/school.db

# Revert code changes
git checkout HEAD~1
```

---

## Performance Optimization

### For Large Databases

```bash
# Add indexes if needed (edit prisma/schema.prisma)
# Then run:
npx prisma migrate dev --name add_indexes
```

### Clearing Cache

```bash
# Clear Vite cache
rm -rf dist node_modules/.vite

# Clear npm cache
npm cache clean --force

# Rebuild everything
npm install
npm run build
```

---

## Uninstallation

### Remove App

**Windows:**
- Control Panel → Programs → Programs and Features
- Find "School Billing System"
- Click Uninstall

**macOS:**
- Drag app from Applications to Trash
- Or: `rm -rf /Applications/School\ Billing\ System.app`

**Linux:**
- `sudo apt remove school-billing`
- Or: Remove AppImage: `rm ~/School\ Billing\ System.AppImage`

### Remove Development Files

```bash
# Delete project folder
rm -rf school-billing/

# Clean npm cache
npm cache clean --force
```

### Keep Database Backup

Before removing, backup important data:
```bash
cp database/school.db ~/backup/school.db.backup
```

---

## Getting Help

### Check Logs

```bash
# View console logs in DevTools
# Ctrl+Shift+I → Console tab

# Check app logs
tail -f logs/app.log  # If logging enabled
```

### Common Issues

| Problem | Solution |
|---------|----------|
| App won't start | Check Node version: `node -v` should be 18+ |
| Blank window | Clear cache: `rm -rf dist node_modules/.vite` |
| No data showing | Check database: `npm run migrate` |
| Search doesn't work | Check DevTools for IPC errors |
| Slow performance | Close other apps, increase RAM |

### Support Resources

- **SETUP.md** - Development setup
- **API.md** - API reference
- **CUSTOMIZATION.md** - Customization guide
- **README.md** - General documentation

---

## Next Steps

1. ✅ Installation complete
2. 📚 Read README.md for features overview
3. 🔧 Check SETUP.md for development
4. 📖 See API.md for available operations
5. 🎨 Review CUSTOMIZATION.md for customization
6. 🧪 Run tests: `npm run test`
7. 🚀 Build: `npm run build`

---

## Quick Reference

```bash
# Install
npm install

# Setup database
npm run migrate

# Develop
npm run dev

# Test
npm run test

# Build
npm run build

# Lint & format
npm run lint:fix
npm run format

# Start packaged app
npm run start
```

---

**Happy Billing! 🎓💰**

For issues or questions, review the documentation or check the troubleshooting section above.
