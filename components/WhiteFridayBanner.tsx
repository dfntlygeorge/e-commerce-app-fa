import { COUPON_CODES } from "@/sanity/lib/sales/couponCodes";
import { getActiveSaleByCouponCode } from "@/sanity/lib/sales/getActiveSaleByCouponCode";

async function WhiteFridayBanner() {
  const sale = await getActiveSaleByCouponCode(COUPON_CODES.WFRIDAY);
  console.log("WhiteFridayBanner", sale);
  //   if not active
  if (!sale?.isActive) return null;

  return (
    <div className="mx-4 mt-2 rounded-lg bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 px-6 py-10 text-zinc-100 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h2 className="mb-4 text-left text-3xl font-extrabold sm:text-5xl">
            {sale.title}
          </h2>
          <p className="mb-6 text-left text-xl font-semibold sm:text-3xl">
            {sale.description}
          </p>
          <div className="flex">
            <div className="transform rounded-full bg-zinc-800 px-6 py-4 text-zinc-100 shadow-md transition duration-300 hover:scale-105">
              <span className="text-base font-bold sm:text-xl">
                Use code:{" "}
                <span className="text-red-500">{sale.couponCode}</span>
              </span>
              <span className="ml-2 text-base font-bold sm:text-xl">
                for {sale.discountAmount}% OFF
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhiteFridayBanner;
