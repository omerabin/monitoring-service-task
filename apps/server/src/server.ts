import { initExpress } from './app';

const PORT = Number(process.env['PORT']) || 3000;

// TODO: Build the DI composition root before calling initExpress:
//
//   1. const factory = createProviderFactory();         // from factories/providerFactory
//   2. const sessions = new Map();                      // SseSessionMap from types/sse
//   3. const errorMiddleware = createErrorMiddleware({  // from middleware/error
//          logger: factory.getLoggerDataProvider().getLogger()
//      });
//
// Then pass factory and errorMiddleware into initExpress:
//   const app = initExpress({ factory, errorMiddleware });

const app = initExpress({
    factory: undefined as never,       // TODO: replace with createProviderFactory()
    errorMiddleware: undefined as never, // TODO: replace with createErrorMiddleware(...)
});

app.listen(PORT, () => {
    process.stdout.write(`Server running on port ${PORT}\n`);
});
