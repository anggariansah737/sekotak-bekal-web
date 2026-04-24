export default async function handler(req, res) {
  try {
    const { default: serverHandler } = await import('../dist/server/index.js');

    const url = `http://${req.headers.host}${req.url}`;

    const response = await serverHandler.fetch(
      new Request(url, {
        method: req.method,
        headers: new Headers(req.headers),
        body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? req : undefined,
      })
    );

    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    res.status(response.status);
    res.send(await response.text());
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}
