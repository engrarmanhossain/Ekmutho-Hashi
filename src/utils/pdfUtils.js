import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/**
 * Capture an HTML DOM element and download it as a high-resolution PDF.
 * Preserves all Bengali fonts, SVG icons, logos, barcodes, and Tailwind styles.
 */
export const downloadElementAsPDF = async (elementOrId, filename = 'document.pdf', options = {}) => {
  try {
    const element = typeof elementOrId === 'string'
      ? document.getElementById(elementOrId)
      : elementOrId;

    if (!element) {
      console.error('Target element not found for PDF export:', elementOrId);
      return false;
    }

    const scale = options.scale || 2.5;
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      ...options.canvasOptions
    });

    const imgData = canvas.toDataURL('image/png');
    const widthPx = canvas.width / scale;
    const heightPx = canvas.height / scale;

    const pdf = new jsPDF({
      orientation: widthPx > heightPx ? 'landscape' : 'portrait',
      unit: 'px',
      format: [widthPx, heightPx]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, widthPx, heightPx, undefined, 'FAST');
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  }
};
