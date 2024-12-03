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
  getDownloadURL,
  auth
} from "../../../firebase";
import { FaTrashAlt, FaEdit, FaPlusCircle } from "react-icons/fa";

const Products = ({ storeId, userId }) => {
  const [products, setProducts] = useState([]);
  const [isEditingProduct, setIsEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0.0,
    category: "",
    quantity: 0,
    SKU: "",
    productImageUrl: ""
  });
  const [logoFile, setLogoFile] = useState(null);

  console.log("storeId", storeId);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollectionRef = collection(firestore, "stores", storeId, "products");
      const productSnapshot = await getDocs(productsCollectionRef);
      const productsList = productSnapshot.docs.map((doc) => ({
        productId: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
    };
    fetchProducts();
  }, [storeId]);

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

  const handleAddProduct = async () => {
    const createdBy = auth ? auth.currentUser.uid : null;
    console.log(createdBy);
    console.log(storeId);
  
    try {
      const logoUrl = await uploadLogo();
  
      const productData = {
        ...newProduct,
        createdBy,
        productImageUrl: logoUrl,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity, 10) // Ensure quantity is an integer
      };
  
      // Reference to the product collection
      const productCollectionRef = collection(firestore, "stores", storeId, "products");
  
      // Add the new product
      const docRef = await addDoc(productCollectionRef, productData);
  
      // Optionally, update the document with the generated productId if you want it in the document itself
      await updateDoc(docRef, {
        productId: docRef.id
      });
  
      // Update state with new product including productId
      setProducts([...products, { productId: docRef.id, ...productData }]);
      
      // Clear input fields
      setNewProduct({ name: "", description: "", price: 0.0, category: "", quantity: 0, SKU: "", productImageUrl: "" });
      setLogoFile(null);
  
      // Notify user
      alert("Product added successfully.");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  

  const handleSaveEdit = async (productId) => {
    try {
      let logoUrl = isEditingProduct.productImageUrl;
      if (logoFile) {
        logoUrl = await uploadLogo();
      }

      const productData = {
        ...isEditingProduct,
        productImageUrl: logoUrl,
        price: parseFloat(isEditingProduct.price),
        quantity: parseInt(isEditingProduct.quantity, 10) // Ensure quantity is an integer
      };

      const productDocRef = doc(firestore, "stores", storeId, "products", productId);
      await updateDoc(productDocRef, productData);

      setProducts(products.map((product) =>
        product.productId === productId ? productData : product
      ));
      setIsEditingProduct(null);
      setLogoFile(null);
      alert("Product updated successfully.");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const productDocRef = doc(firestore, "stores", storeId, "products", productId);
      await deleteDoc(productDocRef);
      setProducts(products.filter((product) => product.productId !== productId));
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
          <div key={product.productId} className="border p-4 rounded-lg shadow-sm">
            {isEditingProduct && isEditingProduct.productId === product.productId ? (
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
                  value={isEditingProduct.quantity}
                  onChange={(e) =>
                    setIsEditingProduct({ ...isEditingProduct, quantity: e.target.value })
                  }
                  placeholder="Quantity"
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
                    onClick={() => handleSaveEdit(product.productId)}
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
                <p>Quantity: {product.quantity}</p>
                <p>SKU: {product.SKU}</p>
                {product.productImageUrl && (
                  <img
                    src={product.productImageUrl}
                    alt="Product Logo"
                    className="w-16 h-16 mt-2"
                  />
                )}
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => setIsEditingProduct(product)}
                    className="text-blue-600"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.productId)}
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
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          placeholder="Quantity"
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
        <button
          onClick={handleAddProduct}
          className="text-green-600 mt-2"
        >
          <FaPlusCircle /> Add Product
        </button>
      </div>
    </div>
  );
};

export default Products;
