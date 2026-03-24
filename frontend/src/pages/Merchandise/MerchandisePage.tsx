import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import * as merchandiseService from '../../services/merchandiseService';
import type { Merchandise, CreateMerchandiseRequest } from '../../types/Merchandise';
import './MerchandisePage.css';

export default function MerchandisePage() {
  const [orders, setOrders] = useState<Merchandise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    color: 'black',
    size: 'M',
    design: 'shelter-love',
    quantity: 1,
    price: merchandiseService.MERCHANDISE_PRICE
  });

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
      setShowOrderForm(false);
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
          {/* Order Form Section */}
          <div className="order-form-section">
            {!showOrderForm ? (
              <button
                className="btn-primary btn-large"
                onClick={() => setShowOrderForm(true)}
                disabled={loading}
              >
                + Order T-Shirt
              </button>
            ) : (
              <form onSubmit={handleOrderSubmit} className="merchandise-form">
                <h2>Customize Your T-Shirt</h2>

                {/* Color Selection */}
                <div className="form-group">
                  <label htmlFor="color">Color:</label>
                  <select
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleFormChange}
                  >
                    {merchandiseService.AVAILABLE_COLORS.map(color => (
                      <option key={color} value={color}>
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Size Selection */}
                <div className="form-group">
                  <label htmlFor="size">Size:</label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleFormChange}
                  >
                    {merchandiseService.AVAILABLE_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                {/* Design Selection */}
                <div className="form-group">
                  <label htmlFor="design">Design:</label>
                  <select
                    id="design"
                    name="design"
                    value={formData.design}
                    onChange={handleFormChange}
                  >
                    {merchandiseService.AVAILABLE_DESIGNS.map(design => (
                      <option key={design.id} value={design.id}>
                        {design.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="form-group">
                  <label htmlFor="quantity">Quantity:</label>
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

                {/* Price Info */}
                <div className="price-info">
                  <p>Price per item: €{formData.price.toFixed(2)}</p>
                  <p>Total price: €{totalPrice.toFixed(2)}</p>
                  <p className="donation-points">
                     Donation points earned: {donationPoints * formData.quantity}
                  </p>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Order'}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowOrderForm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Orders List Section */}
          <div className="orders-section">
            <h2>Your Orders ({orders.length})</h2>

            {loading && !showOrderForm ? (
              <p className="loading">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="no-orders">No orders yet. Create your first one!</p>
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
                      <p className="donation-points">
                         <strong>Donation Points:</strong> {order.donation_points}
                      </p>
                      <p className="order-date">
                        Ordered: {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {order.order_status === 'pending' && (
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={loading}
                      >
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
