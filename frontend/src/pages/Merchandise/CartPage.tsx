import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import * as merchandiseService from '../../services/merchandiseService';
import type { Merchandise } from '../../types/Merchandise';
import './MerchandisePage.css';

type CartItem = {
  id: string;
  color: string;
  size: string;
  design: string;
  quantity: number;
  price: number;
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

export default function CartPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Merchandise[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadCartItems());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyFetched, setHistoryFetched] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem('access_token'));

  useEffect(() => {
    setCartItems(loadCartItems());
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await merchandiseService.getUserOrders();
      setOrders(data);
      setHistoryFetched(true);
      setError('');
    } catch (err) {
      setError('Failed to load orders. Please log in to view your purchase history.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHistory = async () => {
    const nextValue = !showHistory;
    setShowHistory(nextValue);

    if (nextValue && isLoggedIn && !historyFetched) {
      await fetchOrders();
    }
  };

  const handleRemoveCartItem = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    saveCartItems(updatedCart);
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setCheckoutMessage('Add some items to the cart before checkout.');
      return;
    }

    setLoading(true);
    setError('');
    setCheckoutMessage('');

    try {
      for (const item of cartItems) {
        await merchandiseService.createOrder({
          color: item.color,
          size: item.size,
          design: item.design,
          quantity: item.quantity,
          price: item.price
        });
      }

      const updatedCart: CartItem[] = [];
      setCartItems(updatedCart);
      saveCartItems(updatedCart);
      await fetchOrders();
      setCheckoutMessage('Checkout completed successfully. Your orders are visible below.');
    } catch (err) {
      setError('Checkout failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDesignName = (designId: string) => {
    const design = merchandiseService.AVAILABLE_DESIGNS.find(d => d.id === designId);
    return design?.name || designId;
  };

  const getCartItemImage = (designId: string, color: string) => {
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
    return colors[color] || colors.black;
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <Navbar />
      <div className="merchandise-page cart-page">
        <div className="page-heading">
          <div className="cart-top-right">
            <div className="cart-count-pill">{cartItems.length} item{cartItems.length === 1 ? '' : 's'}</div>
            {!isLoggedIn && (
              <div className="auth-buttons">
                <button type="button" className="btn-secondary" onClick={() => navigate('/login')}>
                  Login
                </button>
                <button type="button" className="btn-primary" onClick={() => navigate('/register')}>
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {checkoutMessage && <div className="success-message">{checkoutMessage}</div>}

        <div className="merchandise-container cart-grid">
          <section className="cart-panel panel-card">
            <div className="panel-header">
              <div>
                <h2>My Cart</h2>
                <p className="panel-subtitle">Items waiting for checkout</p>
              </div>
              <button type="button" className="btn-secondary" onClick={() => navigate('/merchandise')}>
                Continue Shopping
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-state-card">
                <p className="no-orders">Your cart is empty.</p>
                <p className="empty-state-text">Choose a design on the merchandise page and add it to your cart.</p>
                <button type="button" className="btn-primary" onClick={() => navigate('/merchandise')}>
                  Browse Merchandise
                </button>
              </div>
            ) : (
              <div className="cart-item-list">
                {cartItems.map(item => (
                  <article key={item.id} className="cart-item-card">
                    <img
                      src={getCartItemImage(item.design, item.color)}
                      alt={`${getDesignName(item.design)} tee`}
                      className="cart-item-image"
                    />
                    <div className="cart-item-body">
                      <div className="order-header">
                        <h3>{getDesignName(item.design)}</h3>
                        <span className="badge-pending">In cart</span>
                      </div>
                      <div className="cart-item-details">
                        <p><strong>Color:</strong> {item.color.charAt(0).toUpperCase() + item.color.slice(1)}</p>
                        <p><strong>Size:</strong> {item.size}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                      </div>
                      <div className="cart-item-footer">
                        <p className="cart-item-price">€{item.price.toFixed(2)}</p>
                        <button type="button" className="btn-delete" onClick={() => handleRemoveCartItem(item.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="cart-summary panel-card panel-shadow">
              <h3>Order summary</h3>
              <div className="summary-line">
                <span>Items total</span>
                <strong>€{cartTotal.toFixed(2)}</strong>
              </div>
              <div className="summary-line summary-note">
                <span>Payment and shipping will be handled after login.</span>
              </div>
              {isLoggedIn ? (
                <button type="button" className="btn-primary btn-block" onClick={handleCheckout} disabled={loading}>
                  {loading ? 'Processing...' : 'Checkout'}
                </button>
              ) : (
                <button type="button" className="btn-secondary btn-block" onClick={() => navigate('/login')}>
                  Login to Checkout
                </button>
              )}
            </div>
          </section>

          <aside className="history-panel panel-card">
            <div className="panel-header">
              <div>
                <h2>Purchase history</h2>
                <p className="panel-subtitle">Completed orders appear here once you checkout.</p>
              </div>
            </div>

            {isLoggedIn ? (
              <>
                <div className="history-summary-row">
                  <p className="panel-summary-text">
                    {historyFetched
                      ? orders.length === 0
                        ? 'No completed orders yet.'
                        : `${orders.length} completed order${orders.length === 1 ? '' : 's'}`
                      : 'Purchase history is hidden. Expand to load your completed orders.'}
                  </p>
                  <button type="button" className="btn-secondary btn-sm" onClick={handleToggleHistory}>
                    {showHistory ? 'Hide history' : 'View history'}
                  </button>
                </div>

                {showHistory && (
                  loading ? (
                    <p className="loading">Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <div className="empty-state-card">
                      <p className="no-orders">No previous orders yet.</p>
                      <p className="empty-state-text">Your completed purchases will appear here.</p>
                    </div>
                  ) : (
                    <>
                      <div className="orders-list orders-history-list">
                        {(showAllHistory ? orders : orders.slice(0, 5)).map(order => (
                          <div key={order.id} className="order-card">
                            <div className="order-header">
                              <h3>Order #{order.id}</h3>
                              <span className={`status-badge ${order.order_status}`}>{order.order_status}</span>
                            </div>
                            <div className="order-details order-details-grid">
                              <p><strong>Design:</strong> {getDesignName(order.design)}</p>
                              <p><strong>Color:</strong> {order.color.charAt(0).toUpperCase() + order.color.slice(1)}</p>
                              <p><strong>Size:</strong> {order.size}</p>
                              <p><strong>Quantity:</strong> {order.quantity}</p>
                              <p><strong>Price:</strong> €{order.price.toFixed(2)}</p>
                              <p className="donation-points"><strong>Donation Points:</strong> {order.donation_points}</p>
                              <p className="order-date">Ordered: {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {orders.length > 5 && (
                        <button type="button" className="btn-secondary btn-sm history-toggle" onClick={() => setShowAllHistory(prev => !prev)}>
                          {showAllHistory ? 'Show fewer orders' : `Show all ${orders.length} orders`}
                        </button>
                      )}
                    </>
                  )
                )}
              </>
            ) : (
              <div className="empty-state-card">
                <p className="no-orders">Please log in to view order history.</p>
                <button type="button" className="btn-primary btn-block" onClick={() => navigate('/login')}>
                  Login
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
