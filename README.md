# Label Saumya - Premium Saree Ecommerce (Next.js 14)

Production-style saree-only ecommerce storefront built with Next.js App Router, Prisma, NextAuth, Stripe, Razorpay, and Supabase/PostgreSQL.

## Functionality Audit and Fixes Completed

- Authentication hardening:
  - Secure credentials registration validation (strong password policy, duplicate email checks)
  - Safer NextAuth provider setup (Google/Email providers only enabled if configured)
  - Proper account/admin route protection
  - Logout flow fixed with `next-auth` `signOut`
- Cart and checkout reliability:
  - Strong server validation with Zod for cart, address, coupon, and checkout payloads
  - Quantity/stock enforcement in add/update cart actions
  - Duplicate-submit protection for checkout (`requestId` idempotency)
  - Saved-address selection support in checkout
  - Coupon validation and safer discount handling
  - Better user-facing checkout/cart errors and processing states
- Payment hardening:
  - Server-side amount integrity preserved (never trust client totals)
  - Razorpay signature verification hardened
  - Stripe/Razorpay API routes now validate payloads and return clean errors
  - Prevents marking already paid orders again
- Order lifecycle and inventory:
  - COD: stock decremented at order creation
  - Online payments: stock decremented only after payment finalization
  - Transactional order finalization with stock checks to prevent overselling
  - Failure path updates order status to `PAYMENT_FAILED` when stock is unavailable at confirmation
  - Order confirmation route added: `/order/success/[id]`
- Admin reliability:
  - Order status options aligned with schema (`CONFIRMED`, `PROCESSING`, `PAYMENT_FAILED`, etc.)
  - Product editing flow added on admin products page (not just add/delete)
- Notifications:
  - Order email sending now gracefully no-ops if SMTP is not configured (no crash)

## Schema Updates Applied

- `OrderStatus` enum extended with:
  - `CONFIRMED`
  - `PROCESSING`
  - `PAYMENT_FAILED`
- `Order` model extended with:
  - `requestId` (idempotency key)
  - `paymentFailureReason`

Because Supabase pooler setups can fail with `prisma db push`, this repo includes a safe schema sync script:

- `npm run schema:sync`

It applies required enum/column/index changes directly and idempotently.

## Required Environment Variables

Copy `.env.example` to `.env` and set at least:

- Database:
  - `DATABASE_URL` (Supabase pooler URL, usually port `6543`)
  - `DIRECT_URL` (prefer Supabase direct URL if DNS/network supports it)
- Auth:
  - `NEXTAUTH_URL`
  - `NEXTAUTH_SECRET`
- Optional OAuth:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
- Optional Email:
  - `EMAIL_SERVER_HOST`
  - `EMAIL_SERVER_PORT`
  - `EMAIL_SERVER_USER`
  - `EMAIL_SERVER_PASSWORD`
  - `EMAIL_FROM`
- Optional Payments:
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- Optional Cloudinary:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

## Local Run

```bash
npm install
npx prisma generate
npm run images:generate
npm run schema:sync
npm run seed
npm run dev
```

Open `http://localhost:3000`.

## Demo Imagery

- Client-provided saree images are consumed from:
  - `public/sarees/saree-upload-*.jpg`
- Image source/traceability manifest:
  - `public/sarees/asset-manifest.json`
- Optional generated fallback demo library remains available in:
  - `public/images/sarees`

## Seeded Admin

- Email: `admin@labelsaumya.com`
- Password: `Admin@123`

## Full Buying Journey Test Checklist

1. Register a new account and sign in.
2. Browse `/collection/all`, add sarees to cart from card and PDP.
3. Update cart quantities and apply coupon.
4. Proceed to checkout, select saved/new address, choose payment method.
5. Place COD order and verify:
   - order success page appears
   - order appears in `/account`
   - order appears in `/admin/orders`
6. For Razorpay/Stripe (if keys set), complete payment and verify paid status.
7. Check admin product edit flow in `/admin/products?edit=<id>`.

## Notes for Supabase Connectivity

- If `prisma db push` fails through pooler with schema-engine errors, use:
  - `npm run schema:sync`
- If direct host `db.<project-ref>.supabase.co` does not resolve on your network, keep runtime on pooler URL and use the sync script above.
