// Modified from:  https://hrishikeshpathak.com/tips/convert-svg-to-png-cloudflare-worker/
// ? Rendering SVG to a png in the worker as the API seems to struggle doing it
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import resvgwasm from './resvg.wasm';

try {
  await initWasm(resvgwasm);
} catch (error) {
  console.error('Resvg wasm not initialized');
}

/**
 * @param {string} url 
 * @returns {Promise<Blob>}
 */
export async function generate(url) {
  const svg = await (await fetch(url)).text();
  const resvg = new Resvg(svg, {
    font: {
      loadSystemFonts: false
    }
  });
  const pngData = resvg.render();

  //  pngData.asPng();
  // Convert to blob
  const blobData = new Blob([pngData.asPng()], { type: 'image/png' });
  return blobData;
}