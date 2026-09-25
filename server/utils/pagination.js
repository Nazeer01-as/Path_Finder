/**
 * Pagination sanitizer for database queries
 * Prevents unreasonable or negative page/limit values, enforcing page >= 1, 1 <= limit <= maxLimit.
 */
const sanitizePagination = (page, limit, defaultLimit = 9, maxLimit = 50) => {
  const parsedPage = parseInt(page, 10);
  const pageNum = Number.isInteger(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const parsedLimit = parseInt(limit, 10);
  let limitNum = Number.isInteger(parsedLimit) && parsedLimit >= 1 ? parsedLimit : defaultLimit;
  if (limitNum > maxLimit) {
    limitNum = maxLimit;
  }

  const skip = (pageNum - 1) * limitNum;
  return { pageNum, limitNum, skip };
};

module.exports = {
  sanitizePagination
};
