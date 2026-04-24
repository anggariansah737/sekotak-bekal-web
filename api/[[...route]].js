import { createServerEntry } from '../dist/server/index.js';

const handler = createServerEntry();

export default async function (req, res) {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);

    const response = await handler.fetch(
      new Request(url.toString(), {
        method: req.method,
        headers: new Headers(req.headers),
        body: req.method !== 'GET' && req.method !== 'HEAD' && req.body
          ? typeof req.body === 'string'
            ? req.body
            : JSON.stringify(req.body)
          : undefined,
      })
    );

    res.status(response.status);

    for (const [key, val] of response.headers) {
      res.setHeader(key, val);
    }

    res.send(await response.text());
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).send('Internal Server Error');
  }
}
