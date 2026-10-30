// Preserve the app's precompressed engine files, including its .data filesystem.
const binaries = __MANIFEST__;
const policy = __CSP__;

function encoding(header) {
  const qualities = new Map((header || '').toLowerCase().split(',').map((entry) => {
    const [name, ...parameters] = entry.trim().split(';');
    const quality = parameters.find((value) => value.trim().startsWith('q='));
    return [name, quality ? Number(quality.trim().slice(2)) : 1];
  }));
  const br = qualities.get('br') ?? qualities.get('*') ?? 0;
  const gzip = qualities.get('gzip') ?? qualities.get('*') ?? 0;
  return br > 0 && br >= gzip ? 'br' : gzip > 0 ? 'gzip' : 'identity';
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const asset = binaries[url.pathname];
    if (!asset) return env.ASSETS.fetch(request);
    if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
    const selected = encoding(request.cf?.clientAcceptEncoding ?? request.headers.get('Accept-Encoding'));
    url.pathname += selected === 'br' ? '.br' : selected === 'gzip' ? '.gz' : '';
    const result = await env.ASSETS.fetch(new Request(url, { method: request.method, headers: { 'Accept-Encoding': 'identity' } }));
    if (!result.ok) return result;
    const headers = new Headers(result.headers);
    headers.set('Content-Type', asset.type);
    headers.set('Content-Length', String(asset.sizes[selected]));
    headers.set('Cache-Control', `${asset.cache}, no-transform`);
    headers.set('Vary', 'Accept-Encoding');
    headers.set('Content-Security-Policy', policy);
    headers.set('Strict-Transport-Security', 'max-age=31536000');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
    headers.delete('Content-Encoding');
    if (selected !== 'identity') headers.set('Content-Encoding', selected);
    const body = request.method === 'HEAD' ? null : new Uint8Array(await result.arrayBuffer());
    return new Response(body, { status: result.status, headers, encodeBody: 'manual' });
  },
};
