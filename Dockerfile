FROM node:24-alpine AS build

WORKDIR /app
COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:stable-alpine-otel AS vts-build
# nginx-module-vts is a different situation from otel above: it isn't one
# of nginx.org's own pkg-oss dynamic modules (that set is
# njs/xslt/image-filter/geoip/geoip2/otel/opentracing only), so there's no
# nginx.org-published build of it at all. The closest prebuilt package is
# Alpine's own `nginx-mod-http-vts` — but that .so is compiled against
# Alpine's *distro* nginx package, a different build (different configure
# arguments, possibly a different patch version) than this image's nginx.org
# build, and nginx refuses to load a dynamic module whose build signature
# doesn't match the running binary ("... is not binary compatible"). So this
# is the one module in this file actually compiled from source — against the
# exact nginx version and configure arguments already running in this image
# (captured via `nginx -V`, with any pre-existing --add-dynamic-module paths
# stripped since those built-in modules aren't being rebuilt), which is what
# makes the result binary-compatible instead of a shot in the dark. Pinned to
# v0.2.5, the release the module's own README lists as last tested against
# (nginx 1.30.2/1.27.3) closest to this image's actual nginx version.
RUN apk add --no-cache gcc make musl-dev pcre-dev pcre2-dev zlib-dev openssl-dev linux-headers curl tar \
  && NGINX_VERSION="$(nginx -V 2>&1 | sed -n 's#^nginx version: nginx/##p')" \
  && CONFIG_ARGS="$(nginx -V 2>&1 | sed -n 's/^configure arguments: //p' | sed -E 's/--add-dynamic-module=[^ ]+//g')" \
  && mkdir -p /tmp/build /tmp/vts \
  && curl -fsSL "https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz" | tar -xz -C /tmp/build --strip-components=1 \
  && curl -fsSL "https://github.com/vozlt/nginx-module-vts/archive/refs/tags/v0.2.5.tar.gz" | tar -xz -C /tmp/vts --strip-components=1 \
  && cd /tmp/build \
  && eval "./configure ${CONFIG_ARGS} --add-dynamic-module=/tmp/vts" \
  && make modules \
  && cp objs/ngx_http_vhost_traffic_status_module.so /tmp/ngx_http_vhost_traffic_status_module.so

FROM nginx:stable-alpine-otel
# Base image kept as -otel purely because it's already proven to build vts
# successfully against it (binary-compatibility, see the block above) — the
# otel module itself is not loaded below. This stage is metrics-only: no
# traces, no otel-collector, so nginx.conf has no otel_* directives or
# /otel/ location for it to matter to. load_module here is for vts only.
RUN sed -i '1i load_module modules/ngx_http_vhost_traffic_status_module.so;' /etc/nginx/nginx.conf
COPY --from=vts-build /tmp/ngx_http_vhost_traffic_status_module.so /usr/lib/nginx/modules/ngx_http_vhost_traffic_status_module.so
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 8080
