import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart data from the backend
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view the cart.');
        setLoading(false);
        return;
      }

      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = decoded?.id;

        if (!userId) {
          setError('Invalid token.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://e-commerce-mernstack-bqpi.onrender.com/api/cart/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.cart) {
          setCart(response.data.cart.items);
        } else {
          setError('Cart data is not available.');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Error fetching cart.');
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Handle quantity change in the cart
  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;

    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `https://e-commerce-mernstack-bqpi.onrender.com/api/cart/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart(response.data.cart.items);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error updating product quantity.');
    }
  };

  // Remove item from the cart
  const handleRemove = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found.');
      return;
    }

    try {
      const response = await axios.post(
        'https://e-commerce-mernstack-bqpi.onrender.com/api/cart/remove',
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data.items);
    } catch (error) {
      console.error('Error removing product:', error);
      alert('Error removing product.');
    }
  };

  // Clear the entire cart
  const handleClearCart = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete('https://e-commerce-mernstack-bqpi.onrender.com/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Error clearing cart.');
    }
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          <div className="products-row">
            {cart.map((item) => (
              <div key={item.id || item.productId} className="product-card">
                <img src={item.thumbnail} alt={item.title} />
                <h5>{item.title}</h5>
                <p className="price">Price: ${item.price}</p>
                <p className="brand">Brand: {item.brand}</p>
                <p className="rating">Rating: {item.rating} ⭐</p>
                <p className="availability">Availability: {item.availabilityStatus}</p>
                <p className="stock">Stock: {item.stock}</p>
                <div className="mb-2">
                  <label className="me-2">Quantity:</label>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item.id || item.productId, Number(e.target.value))}
                    className="form-control w-25"
                  />
                </div>
                <button
                  className="btn btn-outline-danger mb-2"
                  onClick={() => handleRemove(item.id || item.productId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-warning mb-3" onClick={handleClearCart}>
              Clear Cart
            </button>
            <h4 className="totalprice">Total Price: ${totalPrice}</h4>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
