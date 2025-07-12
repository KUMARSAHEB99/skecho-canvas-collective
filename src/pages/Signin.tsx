import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/lib/AuthContext";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

const Signin = () => {
  const navigate = useNavigate();
  const { user, returnPath, setReturnPath } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect them
    if (user) {
      const redirectPath = returnPath || "/";
      setReturnPath(null);
      navigate(redirectPath);
    }
  }, [user, returnPath, navigate, setReturnPath]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get the ID token
      const idToken = await result.user.getIdToken();
      
      // Call backend to create/update user
      const response = await fetch('http://40.81.226.49/api/auth/create-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });

      // The redirect will be handled by the useEffect above
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-skecho-warm-gray/30 to-skecho-coral-light/20">
      <Navigation />
      
      <div className="flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-skecho-charcoal">Welcome Back</CardTitle>
            <p className="text-gray-600">Sign in to your Skecho account</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Button 
              onClick={handleGoogleSignIn}
              variant="outline" 
              className="w-full border-2 hover:bg-gray-50"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-skecho-coral-dark hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signin;
