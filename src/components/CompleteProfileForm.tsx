import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface CompleteProfileFormProps {
  onSkip?: () => void;
  redirectPath?: string;
  showSkip?: boolean;
}

export const CompleteProfileForm = ({ 
  onSkip, 
  redirectPath = "/", 
  showSkip = true 
}: CompleteProfileFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    address: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // This would typically be an API call to update the user's profile
      // For now, we'll just simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully completed.",
        duration: 3000,
      });

      // Redirect to the specified path
      navigate(redirectPath);
    } catch (error) {
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
        <label htmlFor="address" className="text-sm font-medium text-gray-700">
          Delivery Address
        </label>
        <Textarea
          id="address"
          placeholder="Enter your delivery address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
          className="h-24"
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