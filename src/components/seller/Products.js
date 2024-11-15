import React, { useState, useEffect } from "react";
import {
  firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "../../../firebase";
import { FaTrashAlt, FaEdit, FaPlusCircle } from "react-icons/fa";

const Products = ({ storeId ,userId}) => {
  const [products, setProducts] = useState([]);
  const [isEditingProduct, setIsEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: 0,
    SKU: "",
    logo: ""
  });
  const [logoFile, setLogoFile] = useState(null);
console.log("storeId",storeId);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollectionRef = collection(firestore, "stores", storeId, "products");
      const productSnapshot = await getDocs(productsCollectionRef);
      const productsList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
    };
    fetchProducts();
  }, [storeId]);

  // Upload logo to Firebase Storage
  const uploadLogo = async () => {
    if (!logoFile) return "";
    const logoRef = ref(storage, `productLogos/${storeId}/${logoFile.name}`);
    const uploadTask = uploadBytesResumable(logoRef, logoFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // Add a new product
  const handleAddProduct = async () => {
    try {
      const logoUrl = await uploadLogo();
      const productData = { ...newProduct,createdBy:userId, logo: logoUrl };

      const productCollectionRef = collection(firestore, "stores", storeId, "products");
      const docRef = await addDoc(productCollectionRef, productData);

      setProducts([...products, { id: docRef.id, ...productData }]);
      setNewProduct({ name: "", description: "", price: "", category: "", stock: 0, SKU: "", logo: "" });
      setLogoFile(null);
      alert("Product added successfully.");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Update an existing product
  const handleSaveEdit = async (productId) => {
    try {
      let logoUrl = isEditingProduct.logo;
      if (logoFile) {
        logoUrl = await uploadLogo();
      }
      const productData = { ...isEditingProduct, logo: logoUrl };
      const productDocRef = doc(firestore, "stores", storeId, "products", productId);

      await updateDoc(productDocRef, productData);
      setProducts(products.map((product) =>
        product.id === productId ? productData : product
      ));
      setIsEditingProduct(null);
      setLogoFile(null);
      alert("Product updated successfully.");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete a product
  const handleDeleteProduct = async (productId) => {
    try {
      const productDocRef = doc(firestore, "stores", storeId, "products", productId);
      await deleteDoc(productDocRef);
      setProducts(products.filter((product) => product.id !== productId));
      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Manage Products</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-sm">
            {isEditingProduct && isEditingProduct.id === product.id ? (
              <div>
                <input
                  type="text"
                  className="border p-2 rounded mb-2 w-full"
                  value={isEditingProduct.name}
                  onChange={(e) =>
                    setIsEditingProduct({ ...isEditingProduct, name: e.target.value })
                  }
                  placeholder="Product Name"
                />
                <input
                  type="text"
                  className="border p-2 rounded mb-2 w-full"
                  value={isEditingProduct.description}
                  onChange={(e) =>
                    setIsEditingProduct({ ...isEditingProduct, description: e.target.value })
                  }
                  placeholder="Description"
                />
                <input
                  type="number"
                  className="border p-2 rounded mb-2 w-full"
                  value={isEditingProduct.price}
                  onChange={(e) =>
                    setIsEditingProduct({ ...isEditingProduct, price: e.target.value })
                  }
                  placeholder="Price"
                />
                <input
                  type="text"
                  className="border p-2 rounded mb-2 w-full"
                  value={isEditingProduct.category}
                  onChange={(e) =>
                    setIsEditingProduct({ ...isEditingProduct, category: e.target.value })
                  }
                  placeholder="Category"
                />
                <input
                  type="number"
                  className="border p-2 rounded mb-2 w-full"
                  value={isEditingProduct.stock}
                  onChange={(e) =>
                    setIsEditingProduct({ ...isEditingProduct, stock: e.target.value })
                  }
                  placeholder="Stock"
                />
                <input
                  type="text"
                  className="border p-2 rounded mb-2 w-full"
                  value={isEditingProduct.SKU}
                  onChange={(e) =>
                    setIsEditingProduct({ ...isEditingProduct, SKU: e.target.value })
                  }
                  placeholder="SKU"
                />
                <input
                  type="file"
                  className="border p-2 rounded mb-2 w-full"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                />
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => handleSaveEdit(product.id)}
                    className="text-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingProduct(null)}
                    className="text-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p>{product.description}</p>
                <p>${product.price}</p>
                <p>Category: {product.category}</p>
                <p>Stock: {product.stock}</p>
                <p>SKU: {product.SKU}</p>
                {product.logo && <img src={product.logo} alt="Product Logo" className="w-16 h-16 mt-2" />}
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => setIsEditingProduct(product)}
                    className="text-blue-600"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600"
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="mt-6 text-xl font-semibold">Add New Product</h3>
      <div className="flex flex-col md:flex-row gap-2 mt-2">
        <input
          type="text"
          className="border p-2 rounded mb-2 w-full"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          placeholder="Product Name"
        />
        <input
          type="text"
          className="border p-2 rounded mb-2 w-full"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          placeholder="Description"
        />
        <input
          type="number"
          className="border p-2 rounded mb-2 w-full"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          placeholder="Price"
        />
        <input
          type="text"
          className="border p-2 rounded mb-2 w-full"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          placeholder="Category"
        />
        <input
          type="number"
          className="border p-2 rounded mb-2 w-full"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          placeholder="Stock"
        />
        <input
          type="text"
          className="border p-2 rounded mb-2 w-full"
          value={newProduct.SKU}
          onChange={(e) => setNewProduct({ ...newProduct, SKU: e.target.value })}
          placeholder="SKU"
        />
        <input
          type="file"
          className="border p-2 rounded mb-2 w-full"
          onChange={(e) => setLogoFile(e.target.files[0])}
        />
        <button onClick={handleAddProduct} className="bg-blue-500 text-white p-2 rounded">
          <FaPlusCircle /> Add Product
        </button>
      </div>
    </div>
  );
};

export default Products;
