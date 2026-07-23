import pdfParse from 'pdf-parse/lib/pdf-parse.js';

export const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text || '';
  } catch (error) {
    console.error('PDF text extraction error:', error.message);
    throw new Error('Failed to parse PDF document content');
  }
};

export default extractTextFromPDF;
