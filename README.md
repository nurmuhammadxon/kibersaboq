# KiberSaboq

KiberSaboq - tashkilotlar xodimlarini kiberxavfsizlik bo'yicha o'qitish platformasi. Direktor tashkilot yaratadi va korxona kodini oladi, xodimlar shu kod bilan qo'shilib kurslarni o'qiydi, testlarni topshiradi va QR kodli sertifikat oladi. Direktor xodimlarining natijasini hisobotda ko'radi.

## Imkoniyatlar

- Uch rol: super admin, direktor, xodim.
- Kurs, modul, dars (matn va video) va har dars uchun test. Test o'tish bali 70 foiz.
- Darsni yakunlash uchun minimal o'qish vaqti serverda tekshiriladi (soniyada).
- Kursni tugatganda PDF sertifikat. Sertifikatda QR kod va noyob raqam bor (`CERT-YYYY-XXXXXXXXXX`).
- Ochiq tekshiruv sahifasi `/verify/<raqam>`: kirish talab qilinmaydi, ism qisqartirib ko'rsatiladi. Sertifikat muddati yo'q, bekor qilishni faqat super admin qiladi.
- Hisobotlar (admin va direktor uchun), CSV va PDF yuklab olish.

## Texnologiyalar

- Next.js 16 (App Router), React 19, TypeScript
- Prisma 7 + PostgreSQL (`@prisma/adapter-pg`)
- NextAuth v5 (Credentials, JWT sessiya)
- Tailwind CSS 4 + shadcn/ui
- jsPDF va qrcode (sertifikat)

## Lokal ishga tushirish

1. Paketlarni o'rnating:

```bash
npm install
```

2. `.env` fayl yarating va qiymatlarni kiriting (faylni GitHub'ga yuklamang):

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/kibersaboq
AUTH_SECRET=uzun_tasodifiy_qator
NEXTAUTH_SECRET=xuddi_shu_qator
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
EMAIL_USER=pochta@gmail.com
EMAIL_PASSWORD=gmail_app_password
```

Kalitni shunday yaratish mumkin: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.

3. Migratsiyalarni qo'llang:

```bash
npx prisma migrate dev
```

4. Birinchi super adminni yarating (parol kamida 12 belgi):

```bash
set ADMIN_EMAIL=admin@example.com
set ADMIN_PASSWORD=kamida12belgiliparol
npx tsx prisma/create-admin.ts
```

Linux/macOS'da `set` o'rniga `export` ishlating.

5. Kurs mazmunini kiriting va dev serverni yoqing:

```bash
npx tsx prisma/seed-content.ts --publish
npm run dev
```

## Muhim: baza manzili

`.env` dagi `DATABASE_URL` qaysi bazaga qarasa, `prisma migrate reset` va boshqa buyruqlar o'sha bazaga ta'sir qiladi. `.env` ni lokal bazaga qaratib qo'ying, haqiqiy (Supabase) bazaga esa faqat vaqtincha, cmd oynasida `set DATABASE_URL=...` bilan ulaning. `migrate reset` ni haqiqiy bazada hech qachon ishlatmang: u butun bazani o'chiradi.

## Skriptlar

npm:

- `npm run dev` - development server
- `npm run build` - production build
- `npm run start` - production server
- `npm run lint` - ESLint tekshiruvi

`prisma/` papkasidagi skriptlar (`npx tsx prisma/<fayl>`):

- `create-admin.ts` - birinchi super adminni yaratadi (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).
- `seed-content.ts` - "Kiberxavfsizlik asoslari" kursini kiritadi (`--publish` nashr qiladi, `--replace` qayta yaratadi, bunda kursning obuna, progress va sertifikatlari o'chadi). Matn `prisma/seed-data/cybersecurity-course.json` faylida.
- `seed-demo.ts` - demo tashkilotlar, xodimlar, kurslar va progress (`DEMO_PASSWORD` kerak, `--remove` bilan tozalanadi). Haqiqiy ishga tushishdan oldin tozalang.
- `dev-complete-module.ts` - sinov uchun xodimning modulini tugatilgan qilib belgilaydi. Faqat lokal bazada ishlaydi.

## Internetga joylash (Vercel va Supabase)

1. Supabase'da loyiha yarating. Ulanish manzillari: Session pooler (5432-port) migratsiya uchun, Transaction pooler (6543-port) Vercel uchun. Manzilda `sslmode` yozmang, parolda faqat harf va raqam bo'lsin.
2. Migratsiya, admin va kursni o'z kompyuteringizdan, `DATABASE_URL` ni Session pooler manziliga vaqtincha qo'yib bajaring: `npx prisma migrate deploy`, `create-admin.ts`, `seed-content.ts --publish`.
3. Vercel'da GitHub ombori bilan loyiha yarating va muhit o'zgaruvchilarini kiriting:
   - `DATABASE_URL` - Transaction pooler manzili
   - `AUTH_SECRET` va `NEXTAUTH_SECRET` - bir xil tasodifiy qator
   - `AUTH_URL`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL` - saytning aniq manzili (`https://...`)
   - `AUTH_TRUST_HOST=true`
   - `EMAIL_USER`, `EMAIL_PASSWORD`
4. `NEXT_PUBLIC_APP_URL` build vaqtida kodga joylanadi va sertifikatdagi QR havolasi shundan olinadi. Uni o'zgartirsangiz, yangi deployment qiling. Sayt manzili (domen) keyin o'zgarsa, chop etilgan sertifikatlardagi QR ishlamay qoladi, shuning uchun doimiy domenni oldindan tanlang.
5. `.npmrc` dagi `legacy-peer-deps=true` Vercel'dagi `npm install` uchun kerak, o'chirmang.

Vercel'ning bepul (Hobby) rejasi tijoratsiz foydalanish uchun, Supabase bepul rejasi esa 1 hafta faolsizlikdan keyin bazani to'xtatadi. Haqiqiy ishlatish uchun pullik reja yoki o'z serveringiz kerak bo'ladi.

Docker bilan o'z serveringizga joylash uchun `Dockerfile`, `docker-compose.yml`, `Caddyfile` va `deploy.env.example` fayllari bor (hali sinalmagan).

## Asosiy tuzilma

- `app/` - sahifalar va API route'lar (`/admin`, `/director`, `/dashboard`, `/verify`)
- `components/` - UI va feature komponentlar
- `hooks/` - client hook'lar
- `lib/` - auth, prisma, sertifikat va util helperlar
- `prisma/` - schema, migratsiyalar va skriptlar
- `middleware.ts` - rollar bo'yicha sahifalarni himoyalash

## Xavfsizlik eslatmalari

- `.env` va parollarni GitHub'ga, chatga yoki skrinshotga qo'ymang.
- `NEXTAUTH_SECRET` uzun va tasodifiy bo'lishi shart: oson qiymat bo'lsa, sessiyani soxtalashtirib admin sifatida kirish mumkin.
- Gmail bilan yuborishda oddiy parol emas, app password ishlatiladi.
- Parol sizib ketgan bo'lsa, darrov almashtiring (Supabase, Gmail, `NEXTAUTH_SECRET`) va Vercel'da yangilang.