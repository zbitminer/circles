import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { jsPDF } from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { user_name, total_hours, start_date, end_date } = await req.json();

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Background color
    doc.setFillColor(26, 39, 68);
    doc.rect(0, 0, 297, 210, 'F');

    // Border
    doc.setDrawColor(201, 168, 76);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    // Title
    doc.setTextColor(201, 168, 76);
    doc.setFontSize(48);
    doc.setFont(undefined, 'bold');
    doc.text('Certificate of Achievement', 148, 60, { align: 'center' });

    // Subtitle
    doc.setFontSize(14);
    doc.setTextColor(245, 230, 192);
    doc.text('Circles of Giving', 148, 75, { align: 'center' });

    // Name
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(user_name, 148, 110, { align: 'center' });

    // Recognition text
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(245, 230, 192);
    doc.text('This certifies that the above named person has volunteered', 148, 130, { align: 'center' });
    doc.text(`${total_hours} hours of service in our community`, 148, 140, { align: 'center' });

    // Date
    doc.setFontSize(10);
    doc.text(`Awarded: ${new Date().toLocaleDateString()}`, 148, 165, { align: 'center' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(201, 168, 76);
    doc.text('www.circlesofgiving.org', 148, 195, { align: 'center' });

    const pdf = doc.output('arraybuffer');
    const uint8 = new Uint8Array(pdf);
    let binary = '';
    for (let i = 0; i < uint8.length; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    const pdfBase64 = btoa(binary);
    return Response.json({ pdf_base64: pdfBase64, filename: 'volunteer-certificate.pdf' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});