import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { _get } from '../../api';
import fallbackLogoImage from '../../assets/img/logo.png';
import { resolveWebsiteLogoImage } from '../../hooks/useWebsiteLogo';

const detectImageFormat = (src, contentType = '') => {
  const normalizedContentType = contentType.toLowerCase();
  const normalizedSrc = (src || '').split('?')[0].toLowerCase();

  if (normalizedContentType.includes('png') || normalizedSrc.endsWith('.png')) {
    return 'png';
  }

  if (
    normalizedContentType.includes('jpeg')
    || normalizedContentType.includes('jpg')
    || normalizedSrc.endsWith('.jpg')
    || normalizedSrc.endsWith('.jpeg')
  ) {
    return 'jpg';
  }

  return null;
};

const fetchLogoAsset = async (src) => {
  const response = await fetch(src);
  const bytes = await response.arrayBuffer();
  const format = detectImageFormat(src, response.headers.get('content-type') || '');

  return { bytes, format };
};

const loadWebsiteLogoAsset = async () => {
  let logoSrc = fallbackLogoImage;

  try {
    const response = await _get('/website-logo');
    logoSrc = resolveWebsiteLogoImage(response.data?.image_path);
  } catch (error) {
    logoSrc = fallbackLogoImage;
  }

  try {
    const asset = await fetchLogoAsset(logoSrc);
    if (asset.format) {
      return asset;
    }
  } catch (error) {
  }

  try {
    const fallbackAsset = await fetchLogoAsset(fallbackLogoImage);
    if (fallbackAsset.format) {
      return fallbackAsset;
    }
  } catch (error) {
  }

  return null;
};


export async function generateMembershipFormPdf(data) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points (72 PPI)

    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const logoAsset = await loadWebsiteLogoAsset();
    if (logoAsset) {
      const logoImg = logoAsset.format === 'jpg'
        ? await pdfDoc.embedJpg(logoAsset.bytes)
        : await pdfDoc.embedPng(logoAsset.bytes);

      page.drawImage(logoImg, {
          x: 30,
          y: height - 120,
          width: 90,
          height: 90,
      });
    }

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
