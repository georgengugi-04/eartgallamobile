# E-ArtGalla Mobile — Full Setup Procedure

Two folders: `eartgalla-backend` (Node/Express/Prisma/MySQL) and `eartgalla-mobile` (React Native/Expo).

## 1. Backend setup

```bash
cd eartgalla-backend
npm install

# Copy env file and fill in real values
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` → your MySQL connection string (local or hosted, e.g. PlanetScale, Railway, or your own MySQL server)
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` → any long random strings
- `CLOUDINARY_*` → create a free account at cloudinary.com and grab these from your dashboard

Then run migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the dev server:

```bash
npm run dev
```

Server runs at `http://localhost:5000`. Test it: `curl http://localhost:5000/health` should return `{"status":"ok"}`.

**Deploying:** Push to Railway or Render the same way you deployed Ikonex SMS — set the env vars there, point `DATABASE_URL` at a hosted MySQL instance (PlanetScale or Railway MySQL plugin both work).

## 2. Mobile app setup

```bash
cd eartgalla-mobile
npm install
```

Open `api/client.ts` and change `BASE_URL`:
- **Local testing on your phone (Expo Go):** use your computer's local IP, e.g. `http://192.168.x.x:5000/api` (find it with `ipconfig getifaddr en0` on Mac or `ipconfig` on Windows). `localhost` will NOT work from a physical device.
- **Once backend is deployed:** use the live URL, e.g. `https://eartgalla-api.up.railway.app/api`

Start the app:

```bash
npx expo start
```

Scan the QR code with the Expo Go app (iOS/Android) or press `a`/`i` for emulator.

## 3. What's wired up vs what's left

**Done and working end-to-end:**
- Signup/login/JWT refresh flow
- Artwork feed with pagination, search, category filter
- Artwork detail, artist profiles, follow/unfollow
- Upload artwork (image → Cloudinary) for artist accounts
- Cart → order creation → **M-Pesa STK Push payment** (Daraja sandbox)
- Order history with live payment status
- Messaging (polling-based, not real-time sockets yet) **+ push notifications on new message**
- **Push notifications** for new messages and sales (Expo push, registered automatically on login)
- **Avatar upload** on Edit Profile screen (Cloudinary)

**Still left as TODOs:**
- Real-time chat — currently polls every 5s; swap for Socket.io or Pusher if you want true real-time
- Admin moderation dashboard (could be a tiny separate web app)
- M-Pesa: you need real Daraja sandbox credentials (developer.safaricom.co.ke) and a publicly reachable `MPESA_CALLBACK_URL` — use ngrok while testing locally, since Safaricom can't call `localhost`
- Going live with M-Pesa requires Safaricom's go-live process (separate from sandbox) — do this only once the app is otherwise ready to ship

## 4. M-Pesa specific setup notes

1. Register at https://developer.safaricom.co.ke, create an app, get `Consumer Key` / `Consumer Secret`
2. Use the sandbox shortcode `174379` and the sandbox passkey provided in their docs (already the default in `.env.example`)
3. Since Safaricom needs to reach your callback URL from the internet, run `ngrok http 5000` while developing locally and set `MPESA_CALLBACK_URL` to the ngrok HTTPS URL + `/api/orders/mpesa/callback`
4. Test phone numbers in sandbox: use `2547XXXXXXXX` format — Safaricom's sandbox doesn't charge real money

## 5. Quick sanity test order

1. `npm run dev` in backend
2. `npx expo start` in mobile
3. Sign up as an artist account
4. Upload an artwork (needs Cloudinary keys filled in)
5. Sign up a second buyer account, browse feed, add to cart, checkout
6. Check order shows up in Profile → Order History
7. Message the artist from the artwork detail page
