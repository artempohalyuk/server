const handleResponse = (req, res, next) => {
  res.formatResponse = (status, statusMessage, payload) => {
    res.json({
      status,
      statusMessage,
      payload,
    });
  };

  res.formatError = (status, statusMessage, payload) => {
    res.status(status).json({
      error: {
        status: status,
        statusMessage,
        payload,
      },
    });
  };

  next();
};

module.exports = handleResponse;