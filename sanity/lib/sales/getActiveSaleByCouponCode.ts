import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";
import { CouponCode } from "./couponCodes";

export const getActiveSaleByCouponCode = async (couponCode: CouponCode) => {
  const ACTIVE_SALE_BY_COUPON_CODE_QUERY = defineQuery(`
    *[_type == "sale" && isActive==true && couponCode==$couponCode] | order(validFrom desc)[0]`);

  try {
    const activeSale = await sanityFetch({
      query: ACTIVE_SALE_BY_COUPON_CODE_QUERY,
      params: { couponCode },
    }); // pass the coupon code as a parameter to the query
    return activeSale ? activeSale.data : null;
  } catch (err) {
    console.error("Error fetching active sale by coupon code", err);
    return null;
  }
};
