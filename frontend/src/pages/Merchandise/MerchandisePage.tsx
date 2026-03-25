import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import * as merchandiseService from '../../services/merchandiseService';
import type { Merchandise, CreateMerchandiseRequest } from '../../types/Merchandise';
import './MerchandisePage.css';

export default function MerchandisePage() {
  const [orders, setOrders] = useState<Merchandise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    color: 'black',
    size: 'M',
    design: 'shelter-love',
    quantity: 1,
    price: merchandiseService.MERCHANDISE_PRICE
  });

  const selectedDesign =
    merchandiseService.AVAILABLE_DESIGNS.find(d => d.id === formData.design) ||
    merchandiseService.AVAILABLE_DESIGNS[0];

  const handleDesignSelect = (designId: string) => {
    setFormData(prev => ({ ...prev, design: designId }));
  };

  // Get product image based on selected design and color
  const getProductImage = () => {
    // Shelter Love - cat design
    if (formData.design === 'shelter-love') {
      const catShirtImages: Record<string, string> = {
        white: '/images/merch/white_shirt_cat.png',
        black: '/images/merch/black_shirt_cat.png'
      };
      return catShirtImages[formData.color] || '/images/merch/black_shirt_cat.png';
    }

    // Rescue Me - dog/puppy design
    if (formData.design === 'rescue-me') {
      const dogShirtImages: Record<string, string> = {
        white: '/images/merch/white_shirt_dog.png',
        black: '/images/merch/black_shirt_dog.png'
      };
      return dogShirtImages[formData.color] || '/images/merch/black_shirt_dog.png';
    }

    // Mix Animals design
    if (formData.design === 'mix') {
      const mixShirtImages: Record<string, string> = {
        white: '/images/merch/white_shirt_mix.png',
        black: '/images/merch/black_shirt_mix.png'
      };
      return mixShirtImages[formData.color] || '/images/merch/black_shirt_mix.png';
    }

    // Plain - no design, just colored shirts
    if (formData.design === 'plain') {
      const plainShirtImages: Record<string, string> = {
        white: '/images/merch/white_shirt.jpg',
        black: '/images/merch/black_shirt.png'
      };
      return plainShirtImages[formData.color] || '/images/merch/black_shirt.png';
    }

    // Fallback for other designs
    const colorImages: Record<string, string> = {
      white: '/images/merch/white_shirt.jpg',
      black: '/images/merch/black_shirt.png'
    };
    return colorImages[formData.color] || '/images/merch/black_shirt.png';
  };

  // Donation points calculation
  const donationPoints = Math.floor(formData.price * 0.1 * 10);
  const totalPrice = formData.price * formData.quantity;

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const data = await merchandiseService.getUserOrders();
      setOrders(data);
      setError('');
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }));
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const orderData: CreateMerchandiseRequest = {
        color: formData.color,
        size: formData.size,
        design: formData.design,
        quantity: formData.quantity,
        price: totalPrice
      };
      await merchandiseService.createOrder(orderData);

      // Reset form and refresh orders
      setFormData({
        color: 'black',
        size: 'M',
        design: 'shelter-love',
        quantity: 1,
        price: merchandiseService.MERCHANDISE_PRICE
      });
      await fetchUserOrders();
      setError('');
    } catch (err) {
      setError('Failed to create order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await merchandiseService.deleteOrder(orderId);
        await fetchUserOrders();
        setError('');
      } catch (err) {
        setError('Failed to delete order');
        console.error(err);
      }
    }
  };

  const getDesignName = (designId: string) => {
    const design = merchandiseService.AVAILABLE_DESIGNS.find(d => d.id === designId);
    return design?.name || designId;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge-pending';
      case 'paid':
        return 'badge-paid';
      case 'shipped':
        return 'badge-shipped';
      case 'delivered':
        return 'badge-delivered';
      case 'cancelled':
        return 'badge-cancelled';
      default:
        return 'badge-default';
    }
  };

  return (
    <>
      <Navbar />
      <div className="merchandise-page">
        <h1> Support Our Shelter - Merchandise Shop</h1>
        <p className="merchandise-tagline">All profits go directly to animal rescue</p>

        {error && <div className="error-message">{error}</div>}

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

          <div className="orders-section">
            <h2>Your Orders ({orders.length})</h2>

            {loading ? (
              <p className="loading">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="no-orders">No orders yet. Once you buy, it shows here.</p>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <h3>Order #{order.id}</h3>
                      <span className={`status-badge ${getStatusBadgeClass(order.order_status)}`}>
                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                      </span>
                    </div>

                    <div className="order-details">
                      <p><strong>Design:</strong> {getDesignName(order.design)}</p>
                      <p><strong>Color:</strong> {order.color.charAt(0).toUpperCase() + order.color.slice(1)}</p>
                      <p><strong>Size:</strong> {order.size}</p>
                      <p><strong>Quantity:</strong> {order.quantity}</p>
                      <p><strong>Price:</strong> €{order.price.toFixed(2)}</p>
                      <p className="donation-points"><strong>Donation Points:</strong> {order.donation_points}</p>
                      <p className="order-date">Ordered: {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>

                    {order.order_status === 'pending' && (
                      <button className="btn-delete" onClick={() => handleDeleteOrder(order.id)} disabled={loading}>
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
