import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AddressInput } from "./AddressInput";
import { useAuth } from "@/lib/AuthContext";
import axios from "axios";

interface CompleteProfileFormProps {
  onSkip?: () => void;
  redirectPath?: string;
  showSkip?: boolean;
  initialValues?:any;
}

export const CompleteProfileForm = ({ 
  onSkip, 
  redirectPath = "/", 
  showSkip = true ,
  initialValues
}: CompleteProfileFormProps) => {
  console.log("initial vals",initialValues);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user,checkProfileCompletion } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getInitialAddress = () => {
    if (initialValues?.addresses && initialValues.addresses.length > 0) {
      const deliveryAddress = initialValues.addresses.find(
        (addr: any) => addr.type === 'DELIVERY'
      );
      return deliveryAddress || null;
    }
    return null;
  };

  const [formData, setFormData] = useState({
    phoneNumber: initialValues?.phone || "",
    address: getInitialAddress() || {
      pincode: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "India",
    },
  });

  const handleAddressChange = (address: any) => {
    setFormData(prev => ({
      ...prev,
      address
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const idToken = await user?.getIdToken();
      
      await axios.post(
        "http://40.81.226.49/api/user/complete-profile",
        {
          phoneNumber: formData.phoneNumber,
          address: formData.address
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      await checkProfileCompletion(user);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully completed.",
        duration: 3000,
      });

      navigate(redirectPath);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      navigate(redirectPath);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
          pattern="[0-9]{10}"
          className="w-full"
        />
        <p className="text-xs text-gray-500">Format: 10 digits without spaces or special characters</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Delivery Address
        </label>
        <AddressInput
          type="DELIVERY"
          onAddressChange={handleAddressChange}
          initialAddress={formData.address}
        />
      </div>

      <div className="flex items-center justify-between pt-4">
        {showSkip && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            disabled={isSubmitting}
          >
            Skip for now
          </Button>
        )}
        <Button
          type="submit"
          className="bg-skecho-coral hover:bg-skecho-coral-dark text-white ml-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Complete Profile"}
        </Button>
      </div>
    </form>
  );
}; 