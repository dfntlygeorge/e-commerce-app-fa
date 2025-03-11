import { COUPON_CODES } from "@/sanity/lib/sales/couponCodes";
import { getActiveSaleByCouponCode } from "@/sanity/lib/sales/getActiveSaleByCouponCode";

async function WhiteFridayBanner() {
  const sale = await getActiveSaleByCouponCode(COUPON_CODES.WFRIDAY);
  console.log("WhiteFridayBanner", sale);

  if (!sale?.isActive) return null;

  return (
    <div className="from-muted to-background text-foreground mx-4 mt-2 rounded-lg bg-gradient-to-r px-6 py-8 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h2 className="mb-2 text-left text-2xl font-bold sm:text-4xl">
            {sale.title}
          </h2>
          <p className="mb-4 text-left text-lg sm:text-xl">
            {sale.description}
          </p>
          <div className="bg-muted rounded-md px-4 py-2 text-sm font-semibold sm:text-lg">
            Use code:{" "}
            <span className="text-primary font-bold tracking-wide">
              {sale.couponCode}
            </span>{" "}
            for {sale.discountAmount}% OFF
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhiteFridayBanner;
