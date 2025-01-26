import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Cart } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import "../model.css";

const categories = [
  'Beauty', 'Fragrances', 'Furniture', 'Groceries',
  'Laptops', 'Motorcycle', 'Smartphones',
  'Sunglasses', 'Tablets', 'Tops', 'Vehicle'
];

const Navbarcomponent = () => {
  const navigate = useNavigate();

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cart state
  const [totalItemsInCart, setTotalItemsInCart] = useState(0);

  // Modal states
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    // Check the cart item count from localStorage if logged in
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = storedCart.reduce((total, item) => total + item.quantity, 0);
    setTotalItemsInCart(totalItems);

  }, []);

  // Login handlers
  const handleShowLogin = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);

  // Register handlers
  const handleShowRegister = () => setShowRegister(true);
  const handleCloseRegister = () => setShowRegister(false);

 const handleLogin = async (e) => {
    e.preventDefault();

    // Validate the email and password input
    if (!email || !password) {
        alert('Email and password are required.');
        return;
    }

    try {
        const response = await axios.post('https://e-commerce-mernstack-bqpi.onrender.com/api/auth/login', {
            email,
            password,
        });

        if (response.data.token && response.data.userId) {
            // Store token and userId in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId); // Save the userId

            setIsLoggedIn(true);
            setShowLogin(false);
            navigate('/'); 
        } else {
            alert('Login failed: Missing token or userId');
        }
    } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed: ' + error.message);
    }
};

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || password !== confirmPassword) {
      alert('Please fill out the form correctly.');
      return;
    }

    try {
      const response = await axios.post('https://e-commerce-mernstack-bqpi.onrender.com/api/auth/register', {
        email,
        password,
      });

      if (response.data.message === 'User registered successfully') {
        alert('Registration successful. You can now log in.');
        setShowLogin(true);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setTotalItemsInCart(0); // Reset cart count on logout
    navigate('/');
  };

  return (
    <>
      <Navbar expand="lg" className="bg-light text-dark mb-3 fixed-top">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="text-dark">OfferZone</Navbar.Brand>
          <div className="d-flex justify-content-end">
            <Navbar.Toggle aria-controls="offcanvasNavbar" />
          </div>
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
            className="bg-light text-dark"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link as={Link} to="/" className="text-dark">Home</Nav.Link>
                <NavDropdown title="Categories" id="navbarScrollingDropdown" className="dropdown-title">
                  {categories.map((category) => (
                    <NavDropdown.Item
                      as={Link}
                      key={category}
                      to={`/products/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-dark"
                    >
                      {category}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
                <Nav.Link as={Link} to='/cart' className="position-relative text-dark">
                  <Cart size={24} aria-label="Cart" />
                  {totalItemsInCart > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {totalItemsInCart}
                      <span className="visually-hidden">items in cart</span>
                    </span>
                  )}
                </Nav.Link>
                {isLoggedIn ? (
                  <Nav.Link onClick={handleLogout} className="text-dark">Logout</Nav.Link>
                ) : (
                  <>
                    <Nav.Link onClick={handleShowLogin} className="text-dark">Login</Nav.Link>
                    <Nav.Link onClick={handleShowRegister} className="text-dark">Register</Nav.Link>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* Login Modal */}
      <Modal show={showLogin} onHide={handleCloseLogin} className="custom-modal">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                className="custom-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                className="custom-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="custom-button">
              Login
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer className="custom-modal-footer">
          <Button variant="secondary" onClick={handleCloseLogin} className="custom-button">
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Register Modal */}
      <Modal show={showRegister} onHide={handleCloseRegister} className="custom-modal">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <Form onSubmit={handleRegister}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                className="custom-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                className="custom-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                className="custom-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="custom-button">
              Register
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer className="custom-modal-footer">
          <Button variant="secondary" onClick={handleCloseRegister} className="custom-button">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Navbarcomponent;
