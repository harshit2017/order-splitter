export const config = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  defaultPrice: parseFloat(process.env.DEFAULT_PRICE ?? '100'),
  shareDecimalPlaces: parseInt(process.env.SHARE_DECIMAL_PLACES ?? '3', 10),
  weightSumTolerance: 0.01,
};
