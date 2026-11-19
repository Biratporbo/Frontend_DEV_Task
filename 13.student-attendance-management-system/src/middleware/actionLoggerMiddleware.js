/**
 * Custom Redux Middleware: Action Logger & Execution Duration Telemetry
 * Inspects dispatched actions, records performance metrics, and logs state transitions.
 */
export const actionLoggerMiddleware = (storeAPI) => (next) => (action) => {
  const startTime = performance.now();
  const prevState = storeAPI.getState();

  const result = next(action);

  const durationMs = Math.round((performance.now() - startTime) * 100) / 100;
  const nextState = storeAPI.getState();

  // Filter internal noisy actions
  if (
    typeof action.type === 'string' &&
    !action.type.startsWith('filters/setStudentSearch') &&
    process.env.NODE_ENV !== 'production'
  ) {
    console.groupCollapsed(
      `%c[Redux Action] %c${action.type} %c(${durationMs}ms)`,
      'color: #2563eb; font-weight: bold;',
      'color: #0f172a; font-weight: 600;',
      'color: #64748b; font-style: italic;'
    );
    console.log('%cPayload:', 'color: #059669; font-weight: bold;', action.payload);
    console.log('%cPrev State:', 'color: #dc2626;', prevState);
    console.log('%cNext State:', 'color: #16a34a;', nextState);
    console.groupEnd();
  }

  return result;
};

export default actionLoggerMiddleware;
