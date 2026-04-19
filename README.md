# KiberSaboq

KiberSaboq - Next.js asosida qurilgan onlayn ta'lim platformasi. Loyihada autentifikatsiya, kurslar boshqaruvi, dars/modul CRUD, testlar, sertifikatlar va admin panel mavjud.

## Texnologiyalar

- Next.js 16 (App Router)
- React 19 + TypeScript
- Prisma + PostgreSQL
- NextAuth (Credentials)
- Tailwind CSS 4 + shadcn/ui

## Ishga tushirish

1. Dependencyni o'rnating:

```bash
npm install
```

2. `.env` fayl yarating (`.env.local` ham bo'ladi) va kerakli qiymatlarni kiriting:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
```

3. Prisma migratsiyalarini ishga tushiring:

```bash
npx prisma migrate dev
```

4. Dev serverni yoqing:

```bash
npm run dev
```

5. Brauzerda oching: [http://localhost:3000](http://localhost:3000)

## Foydali skriptlar

- `npm run dev` - development server
- `npm run build` - production build
- `npm run start` - production server
- `npm run lint` - ESLint tekshiruvi

## Asosiy tuzilma

- `app/` - sahifalar va API route'lar
- `components/` - UI va feature komponentlar
- `hooks/` - client hook'lar
- `lib/` - auth, prisma va util helperlar
- `prisma/` - schema va migratsiyalar

## Eslatma

- `NEXTAUTH_SECRET` kuchli va tasodifiy bo'lishi kerak.
- Gmail bilan yuborishda odatda app password ishlatiladi (`EMAIL_PASSWORD`).
