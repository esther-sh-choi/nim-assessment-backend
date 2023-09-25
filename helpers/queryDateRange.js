const queryDateRange = (startDate, endDate) => {
  const query = {};
  if (startDate || endDate) {
    query.createdAt = {
      ...(startDate && { $gte: new Date(startDate) }),
      ...(endDate && { $lte: new Date(endDate) })
    };
  }
  return query;
};

module.exports = { queryDateRange };
