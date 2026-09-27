export default async function printWorkshopFlyer(element) {
  const frame = document.createElement('iframe');
  frame.title = 'Printable workshop flyer';
  frame.style.cssText = 'position:fixed;width:1px;height:1px;left:-10000px;top:0;border:0';
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  const styles = [...document.querySelectorAll('style, link[rel="stylesheet"]')].map(node => node.outerHTML).join('');
  const loaded = new Promise(resolve => { frame.onload = resolve; });
  doc.open();
  doc.write(`<!doctype html><html><head><title>Workshop flyer</title>${styles}<style>@page { margin: 14mm; } body { padding: 0; } img { max-height: 65mm; object-fit: cover; } article { break-inside: avoid; } * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }</style></head><body>${element.outerHTML}</body></html>`);
  doc.close();
  await loaded;
  await Promise.all([...doc.images].map(image => image.complete ? Promise.resolve() : new Promise(resolve => { image.onload = resolve; image.onerror = resolve; })));
  await doc.fonts.ready;
  frame.contentWindow.addEventListener('afterprint', () => frame.remove(), { once: true });
  frame.contentWindow.focus();
  frame.contentWindow.print();
}