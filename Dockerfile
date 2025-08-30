# 1️⃣ Base image
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./

# 2️⃣ Install dependencies
FROM base AS deps
RUN yarn install --frozen-lockfile

# 3️⃣ Build the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# 4️⃣ Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Copy only necessary build files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
