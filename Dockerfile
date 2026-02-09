FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
COPY shared/package.json shared/
COPY server/package.json server/

RUN npm install --legacy-peer-deps

COPY shared/ shared/
COPY server/ server/
COPY tsconfig.base.json ./

RUN npm run build:shared && npm run build:server

FROM node:22-alpine

WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared/package.json ./shared/
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/server/src/db ./server/src/db

EXPOSE 3000

CMD ["node", "server/dist/index.js"]
