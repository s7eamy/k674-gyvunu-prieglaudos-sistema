import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import * as merchandiseService from '../../services/merchandiseService';
import type { CreateMerchandiseRequest } from '../../types/Merchandise';
import './MerchandisePage.css';

type CartItem = CreateMerchandiseRequest & {
  id: string;
  created_at: string;
};

const MERCH_CART_STORAGE_KEY = 'merchandise_cart_items';

const loadCartItems = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(MERCH_CART_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const saveCartItems = (items: CartItem[]) => {
  localStorage.setItem(MERCH_CART_STORAGE_KEY, JSON.stringify(items));
};

export default function MerchandisePage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadCartItems());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [showCartModal, setShowCartModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    color: 'black',
    size: 'M',
    design: 'shelter-love',
    quantity: 1,
    price: merchandiseService.MERCHANDISE_PRICE
  });

  const isLoggedIn = Boolean(localStorage.getItem('access_token'));

  const selectedDesign =
    merchandiseService.AVAILABLE_DESIGNS.find(d => d.id === formData.design) ||
    merchandiseService.AVAILABLE_DESIGNS[0];

  const handleDesignSelect = (designId: string) => {
    setFormData(prev => ({ ...prev, design: designId }));
  };

  // Get product image based on selected design and color
  const getProductImage = (designId = formData.design) => {
    const shirtImages: Record<string, Record<string, string>> = {
      'shelter-love': {
        white: '/images/merch/white_shirt_cat.png',
        black: '/images/merch/black_shirt_cat.png'
      },
      'rescue-me': {
        white: '/images/merch/white_shirt_dog.png',
        black: '/images/merch/black_shirt_dog.png'
      },
      mix: {
        white: '/images/merch/white_shirt_mix.png',
        black: '/images/merch/black_shirt_mix.png'
      },
      plain: {
        white: '/images/merch/white_shirt.jpg',
        black: '/images/merch/black_shirt.png'
      }
    };

    const colors = shirtImages[designId] || shirtImages.plain;
    return colors[formData.color] || colors.black;
  };

  // Donation points calculation
  const donationPoints = Math.floor(formData.price * 0.1 * 10);
  const totalPrice = formData.price * formData.quantity;

  useEffect(() => {
    setCartItems(loadCartItems());
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }));
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const newItem: CartItem = {
        id: `${formData.design}-${formData.color}-${formData.size}-${Date.now()}`,
        color: formData.color,
        size: formData.size,
        design: formData.design,
        quantity: formData.quantity,
        price: totalPrice,
        created_at: new Date().toISOString()
      };

      const updatedCart = [...cartItems, newItem];
      setCartItems(updatedCart);
      saveCartItems(updatedCart);
      setShowCartModal(true);
      setCartMessage('');
      setError('');

      setFormData({
        color: 'black',
        size: 'M',
        design: 'shelter-love',
        quantity: 1,
        price: merchandiseService.MERCHANDISE_PRICE
      });
    } catch (err) {
      setError('Failed to add item to cart.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowCartModal(false);
  };

  const handleGoToCheckout = () => {
    setShowCartModal(false);
    navigate('/cart');
  };

  return (
    <>
      <Navbar />
      <div className="merchandise-page">
        <h1> Support Our Shelter - Merchandise Shop</h1>
        <p className="merchandise-tagline">All profits go directly to animal rescue</p>

        {error && <div className="error-message">{error}</div>}
        {cartMessage && <div className="success-message">{cartMessage}</div>}
        {showCartModal && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="cart-confirmation-modal">
              <h2>Item added to cart</h2>
              <p>
                Your selection has been saved. {isLoggedIn ? 'Proceed to checkout now or continue shopping.' : 'Continue shopping now, and log in later to checkout.'}
              </p>
              <div className="modal-buttons">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Continue shopping
                </button>
                <button type="button" className="btn-primary" onClick={handleGoToCheckout}>
                  Go to checkout
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="merchandise-container">
          <div className="shop-view">
            <div className="product-preview">
              <h2>Choose Your T-Shirt</h2>
              <img
                src={getProductImage()}
                alt={selectedDesign.name}
                className="main-product-image"
              />
              <p className="selected-design-name">{selectedDesign.name}</p>
              <p className="selected-design-desc">{selectedDesign.description}</p>

              <div className="design-thumbnail-list">
                {merchandiseService.AVAILABLE_DESIGNS.map(design => (
                  <button
                    key={design.id}
                    type="button"
                    className={`design-thumb ${formData.design === design.id ? 'active' : ''}`}
                    onClick={() => handleDesignSelect(design.id)}
                  >
                    <img
                      src={design.image}
                      alt={design.name}
                      width={80}
                      height={80}
                    />
                    <small>{design.name}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="product-options">
              <form onSubmit={handleOrderSubmit} className="merchandise-form">
                <h2>Customize & Buy</h2>

                <div className="form-group">
                  <label htmlFor="color">Color</label>
                  <div className="color-options">
                    {merchandiseService.AVAILABLE_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`color-swatch ${formData.color === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color === 'black' ? '#111' : '#fff', borderColor: '#999' }}
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="size">Size</label>
                  <select id="size" name="size" value={formData.size} onChange={handleFormChange}>
                    {merchandiseService.AVAILABLE_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max="10"
                    value={formData.quantity}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="price-info">
                  <p>Unit price: €{formData.price.toFixed(2)}</p>
                  <p>Total: €{totalPrice.toFixed(2)}</p>
                  <p>Donation points: {donationPoints * formData.quantity}</p>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
