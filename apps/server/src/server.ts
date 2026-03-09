import { initExpress } from './app';
import { createProviderFactory } from './factories/providerFactory';
import { createErrorMiddleware } from './middleware/error';
import { SseSessionMap } from './types/sse';

const PORT = Number(process.env['PORT']) || 3000;

// Build the DI composition root
const factory  = createProviderFactory();
const sessions: SseSessionMap = new Map();
const errorMiddleware = createErrorMiddleware({
    logger: factory.getLoggerDataProvider().getLogger(),
});

const app = initExpress({ factory, sessions, errorMiddleware });

app.listen(PORT, () => {
    process.stdout.write(`Server running on port ${PORT}\n`);
});
