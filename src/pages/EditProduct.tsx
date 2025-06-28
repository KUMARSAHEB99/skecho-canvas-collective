import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AddProductForm } from "@/components/AddProductForm";
import { useAuth } from "@/lib/AuthContext";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const idToken = await user?.getIdToken();
        const res = await axios.get(`http://40.81.226.49/api/products/${id}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        setProduct(res.data);
      } catch (err: any) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    if (id && user) fetchProduct();
  }, [id, user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!product) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-skecho-warm-gray/30 to-skecho-coral-light/20 py-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <AddProductForm
          initialData={product}
          isEdit
          onSuccess={() => navigate("/dashboard")}
          onClose={() => navigate("/dashboard")}
        />
      </div>
    </div>
  );
};

export default EditProduct; 