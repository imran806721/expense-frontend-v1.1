import { WebTracerProvider, BatchSpanProcessor } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

// Exports over the same origin nginx already serves the app from — proxied
// to otel-collector by nginx.conf's /otel/ location, so this never needs a
// publicly exposed collector port or CORS config.
const provider = new WebTracerProvider({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'expense-frontend-browser',
  }),
  spanProcessors: [
    new BatchSpanProcessor(new OTLPTraceExporter({ url: '/otel/v1/traces' })),
  ],
});

provider.register({ contextManager: new ZoneContextManager() });

registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation({
      // Every fetch() call this app makes targets '/api/...' on the same
      // origin the page was served from, so traceparent is already attached
      // automatically (same-origin requests always get it) — nothing here
      // needs to opt in a third-party domain.
      propagateTraceHeaderCorsUrls: [],
    }),
  ],
});
