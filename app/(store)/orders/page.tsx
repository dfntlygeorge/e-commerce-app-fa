import { formatCurrency } from "@/lib/formatCurrency";
import { imageUrl } from "@/lib/imageUrl";
import { getMyOrders } from "@/sanity/lib/orders/getMyOrders";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

async function OrderPage() {
  const { userId } = await auth();

  if (!userId) return redirect("/");

  const orders = await getMyOrders(userId);

  // console.log(orders.length);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <div className="bg-card w-full max-w-4xl rounded-xl p-4 shadow-lg sm:p-8">
        <h1 className="text-foreground mb-8 text-4xl font-bold tracking-tight">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-muted-foreground text-center">
            <p>You have not placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {orders.map((order) => (
              <div
                key={order.orderNumber}
                className="border-border bg-card overflow-hidden rounded-lg border shadow-sm"
              >
                <div className="border-border border-b p-4 sm:p-6">
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-bold">
                        Order Number
                      </p>
                      <p className="text-primary font-mono text-sm break-all">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-muted-foreground mb-1 text-sm">
                        Order Date
                      </p>
                      <p className="font-medium">
                        {order.orderDate
                          ? new Date(order.orderDate).toDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <span className="mr-2 text-sm">Status:</span>
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          order.status === "paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-muted-foreground mb-1 text-sm">
                        Total Amount
                      </p>
                      <p className="text-lg font-bold">
                        {formatCurrency(order.totalPrice ?? 0, order.currency)}
                      </p>
                    </div>
                  </div>

                  {order.amountDiscount ? (
                    <div className="bg-destructive/10 mt-4 rounded-lg p-3 sm:p-4">
                      <p className="text-destructive mb-1 text-sm font-medium sm:text-base">
                        Discount Applied:{" "}
                        {formatCurrency(order.amountDiscount, order.currency)}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Original Subtotal:{" "}
                        {formatCurrency(
                          (order.totalPrice ?? 0) + order.amountDiscount,
                          order.currency,
                        )}
                      </p>
                    </div>
                  ) : null}
                </div>
                <div className="px-4 py-3 sm:px-6 sm:py-4">
                  <p className="text-muted-foreground mb-3 text-sm font-semibold sm:mb-4">
                    Order Items
                  </p>
                  <div className="space-y-3">
                    {order.products?.map((product) => (
                      <div
                        key={product.product?._id}
                        className="border-border flex flex-col gap-3 border-b py-2 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          {product.product?.image && (
                            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md sm:h-16 sm:w-16">
                              <Image
                                src={imageUrl(product.product?.image).url()}
                                alt={product.product?.name || "Product Image"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}

                          <div>
                            <p className="text-sm font-medium sm:text-base">
                              {product.product?.name}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              Quantity: {product.quantity ?? "N/A"}
                            </p>
                          </div>
                        </div>
                        <p className="text-right font-medium">
                          {product.product?.price && product.quantity
                            ? formatCurrency(
                                product.product.price * product.quantity,
                                order.currency,
                              )
                            : "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderPage;
