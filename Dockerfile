FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN pnpm build


FROM node:24-alpine AS development

WORKDIR /app
RUN corepack enable

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

COPY . .

EXPOSE 6500

CMD ["npm", "run", "start:dev"]

