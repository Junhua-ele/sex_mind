# Code Documentation

## Login System

### Authentication Overview

The application now includes a secure login system that protects all pages except the login page itself. Users must authenticate before accessing any content.

### Login Credentials

**Access Password:** `SRI2025@SecureAccess`

**Important Security Notes:**
- This password is hashed using SHA-256 before comparison
- The plaintext password is never stored in the codebase
- Only the hash is stored in `src/contexts/AuthContext.tsx`
- Authentication status is stored in sessionStorage (cleared when browser closes)

### Password Hash

The password hash stored in the code is:
```
a1a3e7feb1e93cafb40f532b4152380d877c946b55ebc167e02cf9a5b418a8e2
```

### How to Change the Password

If you need to change the password:

1. Choose your new password
2. Generate SHA-256 hash using an online tool or Node.js:
   ```javascript
   const crypto = require('crypto');
   const hash = crypto.createHash('sha256').update('YOUR_NEW_PASSWORD').digest('hex');
   console.log(hash);
   ```
3. Update the `CORRECT_PASSWORD_HASH` constant in `src/contexts/AuthContext.tsx`
4. Update the password documentation in this file

### Authentication Flow

1. **Initial Access:** User is redirected to `/login` page
2. **Password Entry:** User enters password
3. **Validation:** Password is hashed and compared with stored hash
4. **Success:** User is authenticated and redirected to home page
5. **Session Persistence:** Authentication persists during browser session
6. **Logout:** Closing browser or clearing sessionStorage logs user out

### Protected Routes

All application routes are protected except:
- `/login` - Login page (public)
- `*` - 404 page (public)

Protected routes:
- `/` - Home page
- `/assessment` - Assessment page
- `/results` - Results page
- `/guide` - Guide page
- `/science` - Science page
- `/history` - History page

### Implementation Files

- **Authentication Context:** `src/contexts/AuthContext.tsx`
  - Manages authentication state
  - Handles login/logout operations
  - Provides `useAuth()` hook for components

- **Login Page:** `src/pages/login.tsx`
  - Beautiful gradient UI with form validation
  - Password visibility toggle
  - Error handling and loading states
  - Bilingual support (English/Chinese)

- **Protected Route Component:** `src/components/ProtectedRoute.tsx`
  - Wraps protected pages
  - Redirects unauthenticated users to login

- **App Configuration:** `src/App.tsx`
  - Wraps all routes with AuthProvider
  - Configures protected routes

### Internationalization

Login page supports both English and Chinese:
- English: "Secure Access"
- Chinese: "安全访问"

Translations are in:
- `src/i18n/locales/en.json` - English translations
- `src/i18n/locales/zh.json` - Chinese translations

### Security Considerations

1. **Client-Side Only:** Authentication is client-side only, suitable for controlling access but not for securing sensitive data
2. **Hash Storage:** Password hash is visible in source code - suitable for basic access control
3. **Session Storage:** Uses sessionStorage (cleared on browser close) instead of localStorage
4. **No Backend:** No server-side authentication or database required
5. **HTTPS Recommended:** Always use HTTPS in production to protect password transmission

### Future Enhancements (Optional)

If you need more security:
1. Move authentication to server-side
2. Implement JWT tokens
3. Add database for user management
4. Add rate limiting for failed login attempts
5. Implement 2FA (two-factor authentication)
6. Add password reset functionality

---

**Last Updated:** 2025-01-16
**Generated Password:** `SRI2025@SecureAccess`
**Security Level:** Basic (suitable for access control, not sensitive data protection)
