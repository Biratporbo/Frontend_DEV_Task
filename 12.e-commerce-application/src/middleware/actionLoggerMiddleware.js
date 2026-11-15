/**
 * Custom Redux Middleware: Action Logger & Execution Telemetry
 * Inspects dispatched actions, timestamps, and state transitions
 */
export const actionLoggerMiddleware = (storeAPI) => (next) => (action) => {
  const startTime = performance.now();
  const prevState = storeAPI.getState();

  // Pass action through the middleware chain
  const result = next(action);

  const duration = (performance.now() - startTime).toFixed(2);
  const nextState = storeAPI.getState();

  // Graceful structured console log for developers/evaluators
  if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined' && console.groupCollapsed) {
    try {
      console.groupCollapsed(`%cRedux Action: ${action.type} %c(${duration}ms)`, 'color: #2563eb; font-weight: bold;', 'color: #64748b;');
      console.log('%cAction Payload:', 'color: #0284c7;', action.payload);
      console.log('%cPrevious State:', 'color: #64748b;', prevState);
      console.log('%cNext State:', 'color: #16a34a; font-weight: bold;', nextState);
      console.groupEnd();
    } catch (e) {}
  }

  return result;
};

export default actionLoggerMiddleware;
