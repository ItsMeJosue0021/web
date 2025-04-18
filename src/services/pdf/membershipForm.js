import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';


export async function generateMembershipFormPdf(data) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points (72 PPI)

    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const logoUrl = 'logo.png'; 
    const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());

    const logoImg = await pdfDoc.embedPng(logoBytes); // assuming PNG
    page.drawImage(logoImg, {
        x: 30,
        y: height - 120,
        width: 90,
        height: 90,
    });

//   if (pictureBytes) {
//     const pic = await pdfDoc.embedJpg(pictureBytes);
//     page.drawImage(pic, {
//       x: width - 100,
//       y: height - 130,
//       width: 70,
//       height: 70,
//     });
//   }

  const drawText = (text, x, y, size = 10, color = rgb(0, 0, 0)) => {
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color,
    });
  };

  drawText('MEMBERSHIP FORM', 200, height - 50, 14, rgb(1, 0.5, 0));

  // Personal Info Section
  drawText('FULLNAME: ' + data.fullname, 150, height - 110);
  drawText('NICKNAME: ' + data.nickname, 150, height - 130);
  drawText('ADDRESS: ' + data.address, 150, height - 150);
  drawText('BIRTHDATE: ' + data.birthdate, 150, height - 170);
  drawText('CIVIL STATUS: ' + data.status, 150, height - 190);
  drawText('CONTACT #: ' + data.contact, 150, height - 210);
  drawText('FB/MESSENGER: ' + data.facebook, 150, height - 230);

  // Emergency Contact
  drawText('CONTACT PERSON: ' + data.emergencyPerson, 150, height - 270);
  drawText('ADDRESS: ' + data.emergencyAddress, 150, height - 290);
  drawText('CONTACT #: ' + data.emergencyContact, 150, height - 310);
  drawText('FB/MESSENGER: ' + data.emergencyFacebook, 150, height - 330);
  drawText('RELATION: ' + data.relation, 150, height - 350);

  // Signature
  drawText('SIGNATURE: ___________________________', 150, height - 390);

  // Data Privacy
  drawText('DATA PRIVACY:', 50, height - 430, 11);
  drawText(
    'In compliance with R.A. 10173 (Data Privacy Act of 2012)...',
    50,
    height - 450,
    9
  );

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
