import { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  returnPath: string | null;
  setReturnPath: (path: string | null) => void;
  isProfileComplete: boolean;
  setIsProfileComplete: (value: boolean) => void;
  checkProfileCompletion: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [returnPath, setReturnPath] = useState<string | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // This would typically be an API call to check profile completion
  const checkProfileCompletion = async () => {
    if (!user) return false;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // This is where you'd make the actual API call to check profile completion
      // For now, we'll just check localStorage as a simulation
      const isComplete = localStorage.getItem(`profile_complete_${user.uid}`) === 'true';
      setIsProfileComplete(isComplete);
      return isComplete;
    } catch (error) {
      console.error("Error checking profile completion:", error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await checkProfileCompletion();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        returnPath, 
        setReturnPath, 
        isProfileComplete, 
        setIsProfileComplete,
        checkProfileCompletion 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useRequireAuth = (requireComplete = false) => {
  const { user, isProfileComplete, setReturnPath } = useAuth();
  const navigate = useNavigate();

  const requireAuth = (path: string) => {
    if (!user) {
      setReturnPath(path);
      navigate("/signin");
      return false;
    }

    if (requireComplete && !isProfileComplete) {
      navigate("/complete-profile", { state: { from: path } });
      return false;
    }

    return true;
  };

  return requireAuth;
}; 