import { useAuth } from "@/lib/AuthContext";
import { CompleteProfileForm } from "@/components/CompleteProfileForm";
import { SellerProfileForm } from "@/components/SellerProfileForm";
import { useEffect, useState } from "react";
import axios from "axios";

const EditProfile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [sellerProfile, setSellerProfile] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;
      const idToken = await user.getIdToken();

      // Fetch user profile
      const userRes = await axios.get("http://localhost:3000/api/user/profile", {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      setUserProfile(userRes.data);

      // Fetch seller profile (if user is a seller)
      if (userRes.data.isSeller) {
        const sellerRes = await axios.get("http://localhost:3000/api/seller/profile", {
          headers: { Authorization: `Bearer ${idToken}` }
        });
        setSellerProfile(sellerRes.data);
      }
    };
    fetchProfiles();
  }, [user]);

  if (!user) {
    return <div className="p-8 text-center">Please sign in to edit your profile.</div>;
  }

  if (!userProfile) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        <CompleteProfileForm
          initialValues={userProfile}
          showSkip={false}
          redirectPath="/edit-profile"
        />
      </section>
      {sellerProfile && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Seller Profile</h2>
          <SellerProfileForm
            initialValues={sellerProfile}
            redirectPath="/edit-profile"
          />
        </section>
      )}
    </div>
  );
};

export default EditProfile;