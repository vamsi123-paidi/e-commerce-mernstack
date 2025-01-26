import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProductsByCategory } from '../Redux/productsSlice'; // Adjust path as necessary
import '../App.css';
import axios from 'axios';

const ProductsPage = ({ searchQuery }) => {
  const dispatch = useDispatch();
  const { categories, productsByCategory, loading, error } = useSelector((state) => state.products);
  const { category } = useParams();
  const [sortOrder, setSortOrder] = useState('lowToHigh');

  // Fetch products by category using Redux
  useEffect(() => {
    if (categories.length > 0) {
      categories.forEach((cat) => {
        if (!productsByCategory[cat]) {
          dispatch(fetchProductsByCategory(cat)); // Dispatch Redux action
        }
      });
    }
  }, [categories, dispatch, productsByCategory]);

 const handleAddToCart = async (product) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Ensure userId is in localStorage

    // Check if token and userId are available
    if (!token) {
      alert('You must be logged in to add items to the cart');
      return;
    }

    if (!userId) {
      alert('User ID is missing! Please log in first.');
      return;
    }

    try {
      // Send the add-to-cart request to the backend
      const response = await axios.post(
        'https://e-commerce-mernstack-bqpi.onrender.com/api/cart/add',
        {
          userId: userId,
          productId: product.id,
          quantity: 1, // Or retrieve the quantity based on your use case
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authorization
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Handle the error gracefully (e.g., show error message to user)
      alert('Failed to add item to cart');
    }
};

  const sortProducts = (products) => {
    const sortedProducts = [...products];
    if (sortOrder === 'lowToHigh') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    return sortedProducts;
  };

  const filterProducts = (products) => {
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const formattedCategory = category ? category.replace(/-/g, ' ') : null;

  // Render products based on search query or category
  if (searchQuery) {
    const allProducts = categories.flatMap((cat) => productsByCategory[cat] || []);
    const filteredProducts = filterProducts(allProducts);

    return (
      <div>
        <h2>Search Results for "{searchQuery}"</h2>
        <div className="products-row">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.thumbnail} alt={product.title} />
                <h5>{product.title}</h5>
                <p className="price">Price: ${product.price}</p>
                <p className="brand">Brand: {product.brand}</p>
                <p className="rating">Rating: {product.rating} ⭐</p>
                <p className="stock">Stock: {product.stock}</p>
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to cart
                </button>
              </div>
            ))
          ) : (
            <p>No products found for the search "{searchQuery}".</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {formattedCategory ? (
        <div className="category-section">
          <div className="category-header">
            <h2>{formattedCategory.toUpperCase()}</h2>
            <div className="filter-container">
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>
          </div>
          <div className="products-row">
            {sortProducts(productsByCategory[formattedCategory] || []).map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.thumbnail} alt={product.title} />
                <h5>{product.title}</h5>
                <p className="price">Price: ${product.price}</p>
                <p className="brand">Brand: {product.brand}</p>
                <p className="rating">Rating: {product.rating} ⭐</p>
                <p className="stock">Stock: {product.stock}</p>
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        categories.map((cat) => (
          <div key={cat} className="category-section">
            <h2>{cat.replace(/-/g, ' ').toUpperCase()}</h2>
            <div className="products-row">
              {sortProducts(productsByCategory[cat] || []).map((product) => (
                <div key={product.id} className="product-card">
                  <img src={product.thumbnail} alt={product.title} />
                  <h5>{product.title}</h5>
                  <p className="price">Price: ${product.price}</p>
                  <p className="brand">Brand: {product.brand}</p>
                  <p className="rating">Rating: {product.rating} ⭐</p>
                  <p className="stock">Stock: {product.stock}</p>
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductsPage;
