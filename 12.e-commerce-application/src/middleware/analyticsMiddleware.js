/**
 * Custom Redux Middleware: E-Commerce Analytics Tracker
 * Demonstrates analytics interception for business events (Cart additions, Coupon usage, Checkout)
 */
export const analyticsMiddleware = () => (next) => (action) => {
  const result = next(action);

  try {
    switch (action.type) {
      case 'cart/addToCart':
        if (typeof window !== 'undefined') {
          // Record analytics telemetry event
          const event = {
            eventName: 'ecom_add_to_cart',
            productId: action.payload.id,
            productName: action.payload.title,
            price: action.payload.price,
            timestamp: new Date().toISOString()
          };
          window.__LATEST_ECOM_EVENT__ = event;
        }
        break;

      case 'cart/applyCoupon':
        if (typeof window !== 'undefined') {
          window.__LATEST_ECOM_EVENT__ = {
            eventName: 'ecom_coupon_applied',
            code: action.payload,
            timestamp: new Date().toISOString()
          };
        }
        break;

      case 'orders/processCheckout/fulfilled':
        if (typeof window !== 'undefined') {
          window.__LATEST_ECOM_EVENT__ = {
            eventName: 'ecom_purchase_completed',
            orderId: action.payload.id,
            finalPrice: action.payload.financials?.finalPrice,
            timestamp: new Date().toISOString()
          };
        }
        break;

      case 'auth/login':
      case 'auth/loginWithDemo':
        if (typeof window !== 'undefined') {
          window.__LATEST_ECOM_EVENT__ = {
            eventName: 'user_authenticated',
            timestamp: new Date().toISOString()
          };
        }
        break;

      default:
        break;
    }
  } catch (e) {}

  return result;
};

export default analyticsMiddleware;
