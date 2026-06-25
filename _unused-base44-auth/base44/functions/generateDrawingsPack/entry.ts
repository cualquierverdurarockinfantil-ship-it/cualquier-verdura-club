import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { PDFDocument } from 'npm:pdf-lib@1.17.1';

const COVER_URL = "https://media.base44.com/images/public/6a32cbca81d13185387f7ab2/6e66b18c7_IMG-20260614-WA0004.jpg";

const DRAWING_URLS = [
  "https://media.base44.com/files/public/6a32cbca81d13185387f7ab2/b51789afa_tomatebyn.pdf",
  "https://media.base44.com/files/public/6a32cbca81d13185387f7ab2/ae5dd5c40_berenjena.pdf",
  "https://media.base44.com/files/public/6a32cbca81d13185387f7ab2/948add9ed_zanahoria.pdf",
  "https://media.base44.com/files/public/6a32cbca81d13185387f7ab2/856c86b64_brocoli.pdf",
  "https://media.base44.com/files/public/6a32cbca81d13185387f7ab2/aaf75a01d_cebolla.pdf",
  "https://media.base44.com/files/public/6a32cbca81d13185387f7ab2/7460c6df2_choclo.pdf",
  "https://media.base44.com/files/public/6a32cbca81d13185387f7ab2/5189134d3_calabaza.pdf",
  "https://media.base44.com/files/public/6a32cbca81d13185387f7ab2/c7e5336fc_rabanito.pdf",
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const mergedPdf = await PDFDocument.create();

    // Page 1: Cover in grayscale
    const coverRes = await fetch(COVER_URL);
    const coverBytes = await coverRes.arrayBuffer();
    const coverPage = mergedPdf.addPage([595, 842]); // A4
    const jpgImage = await mergedPdf.embedJpg(new Uint8Array(coverBytes));
    const { width, height } = jpgImage.scale(1);
    const scale = Math.min(595 / width, 842 / height);
    const scaledW = width * scale;
    const scaledH = height * scale;
    // Draw image with grayscale effect by drawing it via a grayscale color filter isn't possible in pdf-lib directly,
    // so we embed and note it's the cover page
    coverPage.drawImage(jpgImage, {
      x: (595 - scaledW) / 2,
      y: (842 - scaledH) / 2,
      width: scaledW,
      height: scaledH,
      opacity: 0.25, // light so it reads as near-BW coloring page style
    });

    // Pages 2-9: Drawing PDFs
    for (const url of DRAWING_URLS) {
      const res = await fetch(url);
      const pdfBytes = await res.arrayBuffer();
      const srcPdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const finalBytes = await mergedPdf.save();
    const bytes = new Uint8Array(finalBytes);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    const base64 = btoa(binary);

    return Response.json({ pdf: base64 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});