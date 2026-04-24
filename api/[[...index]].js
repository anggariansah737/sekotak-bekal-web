export default async function handler(req, res) {
  const { default: serverHandler } = await import('../dist/server/index.js');

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const response = await serverHandler.fetch(
      new Request(url.href, {
        method: req.method,
        headers: req.headers,
        body: ['POST', 'PUT', 'PATCH'].includes(req.method)
          ? JSON.stringify(req.body)
          : undefined,
      })
    );

    res.status(response.status);

    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    const text = await response.text();
    res.send(text);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
