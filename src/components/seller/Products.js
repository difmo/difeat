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
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
  
    if (!newProduct.name.trim()) newErrors.name = "Product name is required.";
    if (!newProduct.description.trim()) newErrors.description = "Description is required.";
    if (!newProduct.price || isNaN(newProduct.price) || newProduct.price <= 0) {
      newErrors.price = "Enter a valid price.";
    }
    if (!newProduct.category.trim()) newErrors.category = "Category is required.";
    if (!newProduct.quantity || isNaN(newProduct.quantity) || newProduct.quantity <= 0) {
      newErrors.quantity = "Enter a valid quantity.";
    }
    if (!newProduct.SKU.trim()) newErrors.SKU = "SKU is required.";
    if (!logoFile) newErrors.logoFile = "Product image is required.";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  
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
    if (validateForm()) {
      const createdBy = auth ? auth.currentUser.uid : null;
  
      try {
        const logoUrl = await uploadLogo();
        const productData = {
          ...newProduct,
          createdBy,
          productImageUrl: logoUrl,
          price: parseFloat(newProduct.price),
          quantity: parseInt(newProduct.quantity, 10),
        };
  
        const productCollectionRef = collection(firestore, "stores", storeId, "products");
        const docRef = await addDoc(productCollectionRef, productData);
  
        await updateDoc(docRef, { productId: docRef.id });
        setProducts([...products, { productId: docRef.id, ...productData }]);
  
        setNewProduct({
          name: "",
          description: "",
          price: "",
          category: "",
          quantity: "",
          SKU: "",
          productImageUrl: "",
        });
        setLogoFile(null);
  
        alert("Product added successfully.");
      } catch (error) {
        console.error("Error adding product:", error);
      }
    } else {
      console.error("Validation failed:", errors);
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
        quantity: parseInt(isEditingProduct.quantity, 10)
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

      <div className="w-full overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-sm md:text-base">Product Name</th>
              <th className="border px-4 py-2 text-sm md:text-base">Description</th>
              <th className="border px-4 py-2 text-sm md:text-base">Price</th>
              <th className="border px-4 py-2 text-sm md:text-base">Category</th>
              <th className="border px-4 py-2 text-sm md:text-base">Quantity</th>
              <th className="border px-4 py-2 text-sm md:text-base">SKU</th>
              <th className="border px-4 py-2 text-sm md:text-base">Image</th>
              <th className="border px-4 py-2 text-sm md:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td className="border px-4 py-2 text-sm md:text-base">
                  {isEditingProduct && isEditingProduct.productId === product.productId ? (
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={isEditingProduct.name}
                      onChange={(e) =>
                        setIsEditingProduct({ ...isEditingProduct, name: e.target.value })
                      }
                      placeholder="Product Name"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td className="border px-4 py-2 text-sm md:text-base">
                  {isEditingProduct && isEditingProduct.productId === product.productId ? (
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={isEditingProduct.description}
                      onChange={(e) =>
                        setIsEditingProduct({ ...isEditingProduct, description: e.target.value })
                      }
                      placeholder="Description"
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td className="border px-4 py-2 text-sm md:text-base">
                  {isEditingProduct && isEditingProduct.productId === product.productId ? (
                    <input
                      type="number"
                      className="border p-2 rounded w-full"
                      value={isEditingProduct.price}
                      onChange={(e) =>
                        setIsEditingProduct({ ...isEditingProduct, price: e.target.value })
                      }
                      placeholder="Price"
                    />
                  ) : (
                    `$${product.price}`
                  )}
                </td>
                <td className="border px-4 py-2 text-sm md:text-base">
                  {isEditingProduct && isEditingProduct.productId === product.productId ? (
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={isEditingProduct.category}
                      onChange={(e) =>
                        setIsEditingProduct({ ...isEditingProduct, category: e.target.value })
                      }
                      placeholder="Category"
                    />
                  ) : (
                    product.category
                  )}
                </td>
                <td className="border px-4 py-2 text-sm md:text-base">
                  {isEditingProduct && isEditingProduct.productId === product.productId ? (
                    <input
                      type="number"
                      className="border p-2 rounded w-full"
                      value={isEditingProduct.quantity}
                      onChange={(e) =>
                        setIsEditingProduct({ ...isEditingProduct, quantity: e.target.value })
                      }
                      placeholder="Quantity"
                    />
                  ) : (
                    product.quantity
                  )}
                </td>
                <td className="border px-4 py-2 text-sm md:text-base">
                  {isEditingProduct && isEditingProduct.productId === product.productId ? (
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={isEditingProduct.SKU}
                      onChange={(e) =>
                        setIsEditingProduct({ ...isEditingProduct, SKU: e.target.value })
                      }
                      placeholder="SKU"
                    />
                  ) : (
                    product.SKU
                  )}
                </td>
                <td className="border px-4 py-2">
                  {product.productImageUrl && (
                    <img
                      src={product.productImageUrl}
                      alt="Product Logo"
                      className="w-16 h-16"
                    />
                  )}
                </td>
                <td className="border px-4 py-2">
                  {isEditingProduct && isEditingProduct.productId === product.productId ? (
                    <div className="flex flex-col md:flex-row gap-2">
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
                  ) : (
                    <div className="flex flex-col md:flex-row gap-2">
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
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div>
      <h3 className="mt-6 text-xl font-semibold">Add New Product</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <input
            type="text"
            className={`border p-2 rounded w-full ${errors.name ? "border-red-500" : ""}`}
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="Product Name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div>
          <input
            type="text"
            className={`border p-2 rounded w-full ${errors.description ? "border-red-500" : ""}`}
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            placeholder="Description"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>
        <div>
          <input
            type="text"
            className={`border p-2 rounded w-full ${errors.price ? "border-red-500" : ""}`}
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            placeholder="Enter Price"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>
        <div>
          <input
            type="text"
            className={`border p-2 rounded w-full ${errors.category ? "border-red-500" : ""}`}
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            placeholder="Category"
          />
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>
        <div>
          <input
            type="number"
            className={`border p-2 rounded w-full ${errors.quantity ? "border-red-500" : ""}`}
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            placeholder="Enter Quantity"
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </div>
        <div>
          <input
            type="text"
            className={`border p-2 rounded w-full ${errors.SKU ? "border-red-500" : ""}`}
            value={newProduct.SKU}
            onChange={(e) => setNewProduct({ ...newProduct, SKU: e.target.value })}
            placeholder="SKU"
          />
          {errors.SKU && <p className="text-red-500 text-sm">{errors.SKU}</p>}
        </div>
        <div>
          <input
            type="file"
            className={`border p-2 rounded w-full ${errors.logoFile ? "border-red-500" : ""}`}
            onChange={(e) => setLogoFile(e.target.files[0])}
          />
          {errors.logoFile && <p className="text-red-500 text-sm">{errors.logoFile}</p>}
        </div>
        <div className="col-span-1 md:col-span-3">
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-blue-500 text-white p-2 rounded w-full md:w-auto"
          >
            <FaPlusCircle /> Add Product
          </button>
        </div>
      </div>
    </div> */}
    <div>
    <h3 className="mt-6 text-xl font-semibold">Add New Product</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {[
        { field: "name", placeholder: "Product Name" },
        { field: "description", placeholder: "Description" },
        { field: "price", placeholder: "Enter Price", type: "number" },
        { field: "category", placeholder: "Category" },
        { field: "quantity", placeholder: "Enter Quantity", type: "number" },
        { field: "SKU", placeholder: "SKU" },
      ].map(({ field, placeholder, type = "text" }) => (
        <div key={field}>
          <input
            type={type}
            className={`border p-2 rounded w-full ${errors[field] ? "border-red-500" : ""}`}
            value={newProduct[field]}
            onChange={(e) =>
              setNewProduct({ ...newProduct, [field]: type === "number" ? +e.target.value : e.target.value })
            }
            placeholder={placeholder}
          />
          {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
        </div>
      ))}
      <div>
        <input
          type="file"
          className={`border p-2 rounded w-full ${errors.logoFile ? "border-red-500" : ""}`}
          onChange={(e) => setLogoFile(e.target.files[0])}
        />
        {errors.logoFile && <p className="text-red-500 text-sm">{errors.logoFile}</p>}
      </div>
      <div className="col-span-1 md:col-span-3">
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 bg-blue-500 text-white p-2 rounded w-full md:w-auto"
        >
          <FaPlusCircle /> Add Product
        </button>
      </div>
    </div>
  </div>
    </div>
  );
};

export default Products;
