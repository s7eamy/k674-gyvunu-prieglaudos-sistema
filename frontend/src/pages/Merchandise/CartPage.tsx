import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import * as merchandiseService from '../../services/merchandiseService';
import type { Merchandise } from '../../types/Merchandise';
import type { CartItem } from '../../types/CartItem';
import { useEnumLabel } from '../../i18n/useEnumLabel';
import { useFormatters } from '../../i18n/formatters';
import './MerchandisePage.css';

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
  const { t } = useTranslation('merchandise');
  const enumLabel = useEnumLabel();
  const { formatCurrency, formatDate } = useFormatters();
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
      setError(t('cart.loadOrdersFailed'));
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
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    saveCartItems(updatedCart);
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setCheckoutMessage(t('cart.addBeforeCheckout'));
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
          price: item.price,
        });
      }

      const updatedCart: CartItem[] = [];
      setCartItems(updatedCart);
      saveCartItems(updatedCart);
      await fetchOrders();
      setCheckoutMessage(t('cart.checkoutSuccess'));
    } catch (err) {
      setError(t('cart.checkoutFailed'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCartItemImage = (designId: string, color: string) => {
    const shirtImages: Record<string, Record<string, string>> = {
      'shelter-love': {
        white: '/images/merch/white_shirt_cat.png',
        black: '/images/merch/black_shirt_cat.png',
      },
      'rescue-me': {
        white: '/images/merch/white_shirt_dog.png',
        black: '/images/merch/black_shirt_dog.png',
      },
      mix: {
        white: '/images/merch/white_shirt_mix.png',
        black: '/images/merch/black_shirt_mix.png',
      },
      plain: {
        white: '/images/merch/white_shirt.jpg',
        black: '/images/merch/black_shirt.png',
      },
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
            <div className="cart-count-pill">{t('cart.itemCount', { count: cartItems.length })}</div>
            {!isLoggedIn && (
              <div className="auth-buttons">
                <button type="button" className="btn-secondary" onClick={() => navigate('/login')}>
                  {t('cart.login')}
                </button>
                <button type="button" className="btn-primary" onClick={() => navigate('/register')}>
                  {t('cart.register')}
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
                <h2>{t('cart.myCart')}</h2>
                <p className="panel-subtitle">{t('cart.subtitle')}</p>
              </div>
              <button type="button" className="btn-secondary" onClick={() => navigate('/merchandise')}>
                {t('cart.continueShopping')}
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-state-card">
                <p className="no-orders">{t('cart.empty')}</p>
                <p className="empty-state-text">{t('cart.emptyHint')}</p>
                <button type="button" className="btn-primary" onClick={() => navigate('/merchandise')}>
                  {t('cart.browse')}
                </button>
              </div>
            ) : (
              <div className="cart-item-list">
                {cartItems.map((item) => (
                  <article key={item.id} className="cart-item-card">
                    <img
                      src={getCartItemImage(item.design, item.color)}
                      alt={enumLabel('merch_design', item.design)}
                      className="cart-item-image"
                    />
                    <div className="cart-item-body">
                      <div className="order-header">
                        <h3>{enumLabel('merch_design', item.design)}</h3>
                        <span className="badge-pending">{t('cart.inCart')}</span>
                      </div>
                      <div className="cart-item-details">
                        <p><strong>{t('cart.colorLabel')}</strong> {enumLabel('merch_color', item.color)}</p>
                        <p><strong>{t('cart.sizeLabel')}</strong> {item.size}</p>
                        <p><strong>{t('cart.qtyLabel')}</strong> {item.quantity}</p>
                      </div>
                      <div className="cart-item-footer">
                        <p className="cart-item-price">{formatCurrency(item.price)}</p>
                        <button type="button" className="btn-delete" onClick={() => handleRemoveCartItem(item.id)}>
                          {t('cart.remove')}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="cart-summary panel-card panel-shadow">
              <h3>{t('cart.summary')}</h3>
              <div className="summary-line">
                <span>{t('cart.itemsTotal')}</span>
                <strong>{formatCurrency(cartTotal)}</strong>
              </div>
              <div className="summary-line summary-note">
                <span>{t('cart.summaryNote')}</span>
              </div>
              {isLoggedIn ? (
                <button type="button" className="btn-primary btn-block" onClick={handleCheckout} disabled={loading}>
                  {loading ? t('cart.processing') : t('cart.checkout')}
                </button>
              ) : (
                <button type="button" className="btn-secondary btn-block" onClick={() => navigate('/login')}>
                  {t('cart.loginToCheckout')}
                </button>
              )}
            </div>
          </section>

          <aside className="history-panel panel-card">
            <div className="panel-header">
              <div>
                <h2>{t('history.title')}</h2>
                <p className="panel-subtitle">{t('history.subtitle')}</p>
              </div>
            </div>

            {isLoggedIn ? (
              <>
                <div className="history-summary-row">
                  <p className="panel-summary-text">
                    {historyFetched
                      ? orders.length === 0
                        ? t('history.noOrders')
                        : t('history.count', { count: orders.length })
                      : t('history.hiddenNote')}
                  </p>
                  <button type="button" className="btn-secondary btn-sm" onClick={handleToggleHistory}>
                    {showHistory ? t('history.hideHistory') : t('history.viewHistory')}
                  </button>
                </div>

                {showHistory && (
                  loading ? (
                    <p className="loading">{t('history.loading')}</p>
                  ) : orders.length === 0 ? (
                    <div className="empty-state-card">
                      <p className="no-orders">{t('history.noPrevious')}</p>
                      <p className="empty-state-text">{t('history.futurePurchases')}</p>
                    </div>
                  ) : (
                    <>
                      <div className="orders-list orders-history-list">
                        {(showAllHistory ? orders : orders.slice(0, 5)).map((order) => (
                          <div key={order.id} className="order-card">
                            <div className="order-header">
                              <h3>{t('history.order', { id: order.id })}</h3>
                              <span className={`status-badge ${order.order_status}`}>
                                {enumLabel('order_status', order.order_status)}
                              </span>
                            </div>
                            <div className="order-details order-details-grid">
                              <p><strong>{t('history.designLabel')}</strong> {enumLabel('merch_design', order.design)}</p>
                              <p><strong>{t('history.colorLabel')}</strong> {enumLabel('merch_color', order.color)}</p>
                              <p><strong>{t('history.sizeLabel')}</strong> {order.size}</p>
                              <p><strong>{t('history.qtyLabel')}</strong> {order.quantity}</p>
                              <p><strong>{t('history.priceLabel')}</strong> {formatCurrency(order.price)}</p>
                              <p className="donation-points"><strong>{t('history.donationPointsLabel')}</strong> {order.donation_points}</p>
                              <p className="order-date">{t('history.orderedDate', { date: formatDate(order.created_at) })}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {orders.length > 5 && (
                        <button type="button" className="btn-secondary btn-sm history-toggle" onClick={() => setShowAllHistory((prev) => !prev)}>
                          {showAllHistory ? t('history.showFewer') : t('history.showAll', { count: orders.length })}
                        </button>
                      )}
                    </>
                  )
                )}
              </>
            ) : (
              <div className="empty-state-card">
                <p className="no-orders">{t('history.loginPrompt')}</p>
                <button type="button" className="btn-primary btn-block" onClick={() => navigate('/login')}>
                  {t('history.loginButton')}
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
