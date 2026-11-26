FROM node:24-bookworm-slim AS build

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
COPY patches/ ./patches/
RUN CI=true npm ci --include=dev --foreground-scripts

COPY . .
RUN npm run test:certificate-glyphs

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_KEY
ARG NEXT_PUBLIC_EXCEPTION_USER
ENV CIUNAC_DOCKER_STANDALONE=1 \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_API_KEY=${NEXT_PUBLIC_API_KEY} \
    NEXT_PUBLIC_EXCEPTION_USER=${NEXT_PUBLIC_EXCEPTION_USER}

RUN if [ -z "$NEXT_PUBLIC_API_URL" ] || [ -z "$NEXT_PUBLIC_API_KEY" ]; then \
      echo "Set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_KEY as build arguments." >&2; \
      exit 1; \
    fi \
    && npm run build

FROM node:24-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
