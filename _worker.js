export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Serve static assets from the assets namespace
    if (url.pathname.startsWith('/assets/')) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) {
        return asset;
      }
    }
    
    // Serve everything else from the pages namespace
    const page = await env.PAGES.fetch(request);
    return page;
  },
}; 