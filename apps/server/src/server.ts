import { createApp } from './app';

const PORT = Number(process.env['PORT']) || 3000;

const app = createApp();

app.listen(PORT, () => {
    // Using process.stdout instead of console.log to respect no-console rule.
    // Swap with logger.info once the logger is wired at server level if desired.
    process.stdout.write(`Server running on port ${PORT}\n`);
});
