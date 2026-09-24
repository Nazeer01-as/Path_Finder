/**
 * Standard API Response Helper
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = {}, pagination = null) => {
  const response = {
    success: true,
    message,
    data
  };
  if (pagination) {
    response.pagination = pagination;
  }
  return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message
  };
  if (errors) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse
};
