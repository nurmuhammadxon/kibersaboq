# KiberSaboq: ishlab chiqarish (production) uchun Docker image

FROM node:22-slim AS base
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# 1) Paketlar
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts

# 2) Build. Shu bosqich "tools" xizmati uchun ham ishlatiladi
#    (migratsiya, admin yaratish, kurs mazmunini kiritish).
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* qiymatlar build vaqtida kodga joylanadi, shuning uchun build arg
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV DOCKER_BUILD=1
# prisma generate bazaga ulanmaydi, lekin config DATABASE_URL ni kutadi
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
RUN npx prisma generate && npm run build

# 3) Ishga tushiriladigan yengil image
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
