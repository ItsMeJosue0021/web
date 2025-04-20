import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateMembersListPdf(data) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 size

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();

  const margin = 40;
  const top = height - 60;
  const rowHeight = 26;
  const cellPadding = 8;

  const columns = [
    { title: 'First Name', width: 100 },
    { title: 'Last Name', width: 100 },
    { title: 'Nick Name', width: 100 },
    { title: 'Contact', width: 100 },
    { title: 'Added On', width: 100 },
  ];

  let y = top;

  // Draw header row
  let x = margin;
  columns.forEach(col => {
    // Background
    page.drawRectangle({
      x,
      y: y,
      width: col.width,
      height: rowHeight,
      color: rgb(0.95, 0.95, 0.95),
      borderColor: rgb(0.7, 0.7, 0.7),
      borderWidth: 0.5,
    });

    // Text
    page.drawText(col.title, {
      x: x + cellPadding,
      y: y + 8,
      size: 11,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    x += col.width;
  });

  y -= rowHeight;

  // Draw data rows
  data.forEach((row, index) => {
    x = margin;

    // Alternate background
    if (index % 2 === 0) {
      page.drawRectangle({
        x,
        y,
        width: columns.reduce((sum, col) => sum + col.width, 0),
        height: rowHeight,
        color: rgb(0.98, 0.98, 0.98),
      });
    }

    const values = [
      row.first_name,
      row.last_name,
      row.nick_name,
      row.contact_number,
      new Date(row.created_at).toLocaleDateString("en-US", { 
        month: "long", 
        day: "numeric", 
        year: "numeric" 
    })
    ];

    values.forEach((text, i) => {
      // Text
      page.drawText(String(text ?? ''), {
        x: x + cellPadding,
        y: y + 8,
        size: 10,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });

      // Border
      page.drawRectangle({
        x,
        y,
        width: columns[i].width,
        height: rowHeight,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 0.5,
      });

      x += columns[i].width;
    });

    y -= rowHeight;

    // Handle page overflow
    if (y < margin + rowHeight) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = top;

      // Redraw header on new page
      x = margin;
      columns.forEach(col => {
        page.drawRectangle({
          x,
          y: y - rowHeight,
          width: col.width,
          height: rowHeight,
          color: rgb(0.95, 0.95, 0.95),
          borderColor: rgb(0.7, 0.7, 0.7),
          borderWidth: 0.5,
        });

        page.drawText(col.title, {
          x: x + cellPadding,
          y: y - 19,
          size: 12,
          font: boldFont,
          color: rgb(0, 0, 0.6),
        });

        x += col.width;
      });

      y -= rowHeight;
    }
  });

  return await pdfDoc.save();
}
