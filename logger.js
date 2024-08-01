// logger.js
const log = (message, data = null) => {
    const timestamp = new Date().toISOString();
    if (data) {
      console.log(`[${timestamp}] ${message}`, data);
    } else {
      console.log(`[${timestamp}] ${message}`);
    }
  };

  const error = (message, data = null) => {
    const timestamp = new Date().toISOString();
    if (data) {
      console.error(`[${timestamp}] ${message}`, data);
    } else {
      console.error(`[${timestamp}] ${message}`);
    }
  };

  export default {
    log,
    error,
  };