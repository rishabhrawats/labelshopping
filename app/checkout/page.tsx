export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isRazorpayConfigured, isStripeConfigured } from "@/lib/payments";
import { CheckoutClient } from "@/components/CheckoutClient";

export default async function CheckoutPage() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/auth/signin");

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true }
  });
  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
  });

  if (!items.length) redirect("/cart");

  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const shipping = subtotal >= 2999 ? 0 : 149;

  return (
    <div className="container-page py-10">
      <h1 className="mb-2 font-display text-h1 text-maroon">Secure Checkout</h1>
      <p className="mb-6 text-small text-muted">Complete your order with trusted payment options and premium order care by Label Saumya.</p>
      <CheckoutClient
        subtotal={subtotal}
        shipping={shipping}
        availablePaymentMethods={[
          "COD",
          ...(isRazorpayConfigured ? (["RAZORPAY"] as const) : []),
          ...(isStripeConfigured ? (["STRIPE"] as const) : [])
        ]}
        savedAddresses={addresses.map((address) => ({
          id: address.id,
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2 || "",
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country
        }))}
      />
    </div>
  );
}
