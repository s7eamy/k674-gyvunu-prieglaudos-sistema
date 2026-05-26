import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import * as merchandiseService from '../../services/merchandiseService';
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

export default function MerchandisePage() {
  const { t } = useTranslation('merchandise');
  const enumLabel = useEnumLabel();
  const { formatCurrency } = useFormatters();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadCartItems());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [showCartModal, setShowCartModal] = useState(false);

  const [formData, setFormData] = useState({
    color: 'black',
    size: 'M',
    design: 'shelter-love',
    quantity: 1,
    price: merchandiseService.MERCHANDISE_PRICE,
  });

  const isLoggedIn = Boolean(localStorage.getItem('access_token'));

  const selectedDesign =
    merchandiseService.AVAILABLE_DESIGNS.find((d) => d.id === formData.design) ||
    merchandiseService.AVAILABLE_DESIGNS[0];

  const handleDesignSelect = (designId: string) => {
    setFormData((prev) => ({ ...prev, design: designId }));
  };

  const getProductImage = (designId = formData.design) => {
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
    return colors[formData.color] || colors.black;
  };

  const donationPoints = Math.floor(formData.price * 0.1 * 10);
  const totalPrice = formData.price * formData.quantity;

  useEffect(() => {
    setCartItems(loadCartItems());
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value,
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
        created_at: new Date().toISOString(),
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
        price: merchandiseService.MERCHANDISE_PRICE,
      });
    } catch (err) {
      setError(t('shop.errorAdd'));
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
      <section className="merchandise-page__hero">
        <div className="merchandise-page__hero-content">
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.subtitle')}</p>
          <div className="merchandise-page__stats">
            <div className="stat-item">
              <span className="stat-number">2,500+</span>
              <span className="stat-label">{t('hero.stats.sold')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">€15K</span>
              <span className="stat-label">{t('hero.stats.raised')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">{t('hero.stats.toCare')}</span>
            </div>
          </div>
        </div>
      </section>
      <div className="merchandise-page">
        {error && <div className="error-message">{error}</div>}
        {cartMessage && <div className="success-message">{cartMessage}</div>}
        {showCartModal && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="cart-confirmation-modal">
              <h2>{t('modal.title')}</h2>
              <p>{isLoggedIn ? t('modal.subtitleLoggedIn') : t('modal.subtitleLoggedOut')}</p>
              <div className="modal-buttons">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  {t('modal.continue')}
                </button>
                <button type="button" className="btn-primary" onClick={handleGoToCheckout}>
                  {t('modal.checkout')}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="merchandise-container">
          <div className="shop-view">
            <div className="product-preview">
              <h2>{t('shop.chooseTshirt')}</h2>
              <img
                src={getProductImage()}
                alt={enumLabel('merch_design', selectedDesign.id)}
                className="main-product-image"
              />
              <p className="selected-design-name">{enumLabel('merch_design', selectedDesign.id)}</p>
              <p className="selected-design-desc">{t(`designDescriptions.${selectedDesign.id}` as never)}</p>

              <div className="design-thumbnail-list">
                {merchandiseService.AVAILABLE_DESIGNS.map((design) => (
                  <button
                    key={design.id}
                    type="button"
                    className={`design-thumb ${formData.design === design.id ? 'active' : ''}`}
                    onClick={() => handleDesignSelect(design.id)}
                  >
                    <img src={design.image} alt={enumLabel('merch_design', design.id)} width={80} height={80} />
                    <small>{enumLabel('merch_design', design.id)}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="product-options">
              <form onSubmit={handleOrderSubmit} className="merchandise-form">
                <h2>{t('shop.customize')}</h2>

                <div className="form-group">
                  <label htmlFor="color">{t('shop.color')}</label>
                  <div className="color-options">
                    {merchandiseService.AVAILABLE_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`color-swatch ${formData.color === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color === 'black' ? '#111' : '#fff', borderColor: '#999' }}
                        onClick={() => setFormData((prev) => ({ ...prev, color }))}
                      >
                        {enumLabel('merch_color', color)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="size">{t('shop.size')}</label>
                  <select id="size" name="size" value={formData.size} onChange={handleFormChange}>
                    {merchandiseService.AVAILABLE_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">{t('shop.quantity')}</label>
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
                  <p>{t('shop.unitPrice', { price: formatCurrency(formData.price) })}</p>
                  <p>{t('shop.totalLabel', { price: formatCurrency(totalPrice) })}</p>
                  <p>{t('shop.donationPoints', { count: donationPoints * formData.quantity })}</p>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? t('shop.adding') : t('shop.addToCart')}
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
