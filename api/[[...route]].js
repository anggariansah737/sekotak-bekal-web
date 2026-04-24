import handler from '../dist/server/server.js';

export default async function vercelHandler(req, res) {
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const url = new URL(req.url, `${protocol}://${host}`);

    let body = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await new Promise((resolve) => {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
      });
      if (body.length === 0) body = undefined;
    }

    const webRequest = new Request(url.toString(), {
      method: req.method,
      headers: new Headers(req.headers),
      body: body || undefined,
    });

    const webResponse = await handler.fetch(webRequest);

    res.statusCode = webResponse.status;
    res.statusMessage = webResponse.statusText;

    for (const [key, value] of webResponse.headers.entries()) {
      if (key.toLowerCase() === 'set-cookie') continue;
      res.setHeader(key, value);
    }

    if (webResponse.headers.getSetCookie) {
      for (const cookie of webResponse.headers.getSetCookie()) {
        res.appendHeader('set-cookie', cookie);
      }
    }

    if (webResponse.body) {
      const reader = webResponse.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }

    res.end();
  } catch (error) {
    console.error('SSR handler error:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
