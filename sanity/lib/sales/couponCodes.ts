export const COUPON_CODES = {
  WFRIDAY: "WFRIDAY",
  BF2021: "BF2021",
  CYBER2021: "CYBER2021",
  XMAS2021: "XMAS2021",
} as const;
export type CouponCode = (typeof COUPON_CODES)[keyof typeof COUPON_CODES];
