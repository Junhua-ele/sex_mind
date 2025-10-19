import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: 'sri' | 'rebirth' | null; // Track which feature user should access
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Secure passwords - hashed for security
// Original password for SRI: SRI2025@SecureAccess
const SRI_PASSWORD_HASH = 'a1a3e7feb1e93cafb40f532b4152380d877c946b55ebc167e02cf9a5b418a8e2';

// Original password for Rebirth: Rebirth2025@Access
const REBIRTH_PASSWORD_HASH = '855d6e1410635e28291ca182ee38fae4f689f3e6a5deea69a672cb736fa87f76';

// Simple SHA-256 hash function (for browser)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<'sri' | 'rebirth' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('authenticated');
    const savedUserType = sessionStorage.getItem('user_type') as 'sri' | 'rebirth' | null;
    if (authStatus === 'true' && savedUserType) {
      setIsAuthenticated(true);
      setUserType(savedUserType);
    }
    setIsLoading(false);
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const hashedInput = await hashPassword(password);

      // Check against SRI password
      if (hashedInput === SRI_PASSWORD_HASH) {
        setIsAuthenticated(true);
        setUserType('sri');
        sessionStorage.setItem('authenticated', 'true');
        sessionStorage.setItem('user_type', 'sri');
        return true;
      }

      // Check against Rebirth password
      if (hashedInput === REBIRTH_PASSWORD_HASH) {
        setIsAuthenticated(true);
        setUserType('rebirth');
        sessionStorage.setItem('authenticated', 'true');
        sessionStorage.setItem('user_type', 'rebirth');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    sessionStorage.removeItem('authenticated');
    sessionStorage.removeItem('user_type');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
