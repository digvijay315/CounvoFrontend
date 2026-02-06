import { NAVIGATION_CONSTANTS } from "../_constants/navigationConstants";
import api from "../api";
import jsPDF from 'jspdf';


export const getRouteBasedOnUserType = (userType = "customer") => {
  switch (userType) {
    case "customer":
      return NAVIGATION_CONSTANTS.FIND_LAWYER_PATH;
    default:
      return NAVIGATION_CONSTANTS.DASHBOARD_PATH;
  }
};

/**
 * Upload a file to S3 via presigned URL
 * @param {File} file - The file to upload
 * @param {string} filename - Original filename
 * @param {string} folder - S3 folder path (e.g., 'chat', 'profiles', 'documents')
 * @returns {Promise<{success: boolean, fileKey?: string, publicUrl?: string, error?: string}>}
 */
export const uploadResource = async (file, filename, folder) => {
  try {
    // Step 1: Get presigned upload URL from backend
    const response = await api.post("/api/v2/resources/upload", {
      fileName: filename,
      folder: folder || "uploads",
    });

    if (!response.data.success) {
      return { success: false, error: "Failed to get upload URL" };
    }

    const { uploadUrl, fileKey, publicUrl, contentType } = response.data.data;

    // Step 2: Upload file directly to S3 using PUT request
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      return { success: false, error: "Failed to upload file to S3" };
    }

    return {
      success: true,
      fileKey,
      publicUrl,
    };
  } catch (error) {
    console.error("Error uploading resource:", error);
    return {
      success: false,
      error: error.message || "Upload failed",
    };
  }
};

/**
 * Get a signed download URL for a file stored in S3
 * @param {string} fileKey - The S3 file key
 * @returns {Promise<{success: boolean, signedUrl?: string, error?: string}>}
 */
export const getDownloadUrl = async (fileKey) => {
  try {
    const response = await api.get("/api/v2/resources/download", {
      params: { fileKey },
    });

    if (!response.data.success) {
      return { success: false, error: "Failed to get download URL" };
    }

    return {
      success: true,
      signedUrl: response.data.data.accessUrl,
    };
  } catch (error) {
    console.error("Error getting download URL:", error);
    return {
      success: false,
      error: error.message || "Failed to get download URL",
    };
  }
};




export const generateInvoicePDF = (invoiceData) => {
  const {
    invoiceNo,
    date,
    billedTo,
    transactionId,
    paymentMode = "Razorpay",
    paymentStatus = "Successful",
    consultationFee,
    recipientName,
    platformFee,
    gstPercent,
  } = invoiceData;

  // Calculate amounts
  const platformFeeAmount = consultationFee * platformFee;
  const gstAmount = (platformFeeAmount * gstPercent) / 100;
  const totalAmount = consultationFee + platformFeeAmount + gstAmount;

  // Create new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = margin;

  // Helper function to add text
  const addText = (text, x, y, options = {}) => {
    const {
      fontSize = 10,
      fontStyle = "normal",
      align = "left",
      color = [0, 0, 0],
    } = options;

    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    doc.setTextColor(...color);

    if (align === "center") {
      doc.text(text, x, y, { align: "center" });
    } else if (align === "right") {
      doc.text(text, x, y, { align: "right" });
    } else {
      doc.text(text, x, y);
    }
  };

  // Helper function to draw line
  const drawLine = (x1, y1, x2, y2, color = [200, 200, 200]) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(x1, y1, x2, y2);
  };

  // Helper function to draw rectangle
  const drawRect = (
    x,
    y,
    width,
    height,
    fillColor = null,
    borderColor = [200, 200, 200]
  ) => {
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.3);

    if (fillColor) {
      doc.setFillColor(...fillColor);
      doc.rect(x, y, width, height, "FD");
    } else {
      doc.rect(x, y, width, height);
    }
  };

  // ========== HEADER ==========
  addText("Invoice structure", margin, yPos, {
    fontSize: 12,
    fontStyle: "bold",
  });
  yPos += 8;

  addText("COUNVO", margin, yPos, { fontSize: 18, fontStyle: "bold" });
  yPos += 7;

  addText("Website: www.counvo.in", margin, yPos, {
    fontSize: 9,
    color: [80, 80, 80],
  });
  yPos += 5;
  addText("Email: admin@counvo.in", margin, yPos, {
    fontSize: 9,
    color: [80, 80, 80],
  });
  yPos += 8;

  addText("GSTIN: 07AAMCC8904A1ZT", margin, yPos, {
    fontSize: 9,
    fontStyle: "bold",
  });
  yPos += 5;

  addText(`Invoice No: ${invoiceNo}`, margin, yPos, { fontSize: 9 });
  yPos += 5;
  addText(`Date: ${date}`, margin, yPos, { fontSize: 9 });
  yPos += 10;

  // ========== BILLED TO ==========
  drawLine(margin, yPos, pageWidth - margin, yPos);
  yPos += 6;

  addText("Billed To", margin, yPos, { fontSize: 10, fontStyle: "bold" });
  yPos += 6;

  addText(`Name: ${billedTo.name}`, margin, yPos, { fontSize: 9 });
  yPos += 5;
  addText(`Email: ${billedTo.email}`, margin, yPos, { fontSize: 9 });
  yPos += 8;

  addText(`Transaction ID: ${transactionId}`, margin, yPos, { fontSize: 9 });
  yPos += 10;

  // ========== PAYMENT MODE ==========
  drawLine(margin, yPos, pageWidth - margin, yPos);
  yPos += 6;

  addText("Payment Mode", margin, yPos, { fontSize: 10, fontStyle: "bold" });
  yPos += 6;

  addText(paymentMode, margin, yPos, { fontSize: 9 });
  yPos += 5;
  addText(`Payment Status: ${paymentStatus}`, margin, yPos, {
    fontSize: 9,
    fontStyle: "bold",
    color: paymentStatus === "Successful" ? [0, 128, 0] : [255, 0, 0],
  });
  yPos += 10;

  // ========== PAYMENT SUMMARY ==========
  drawLine(margin, yPos, pageWidth - margin, yPos);
  yPos += 6;

  addText("Payment Summary", margin, yPos, { fontSize: 11, fontStyle: "bold" });
  yPos += 8;

  // Table dimensions
  const tableWidth = pageWidth - 2 * margin;
  const rowHeight = 8;
  const col1X = margin + 2;
  const col2X = margin + 80;
  const col3X = pageWidth - margin - 2;

  // Draw table header background
  drawRect(margin, yPos, tableWidth, rowHeight, [240, 240, 240]);

  addText("Particulars", col1X, yPos + 5.5, { fontSize: 9, fontStyle: "bold" });
  addText("Recipient", col2X, yPos + 5.5, { fontSize: 9, fontStyle: "bold" });
  addText("Amount (Rs.)", col3X, yPos + 5.5, {
    fontSize: 9,
    fontStyle: "bold",
    align: "right",
  });
  yPos += rowHeight;

  // Table rows
  const tableRows = [
    {
      particulars: "Legal Consultation Fee",
      recipient: recipientName,
      amount: convertToRuppee(consultationFee).toFixed(2),
    },
    {
      particulars: "Counvo Platform Usage Fee",
      recipient: "Counvo Sphere Pvt Ltd",
      amount: convertToRuppee(platformFeeAmount).toFixed(2),
    },
    {
      particulars: `GST @ ${gstPercent}% on Platform Fee`,
      recipient: "Government of India",
      amount: convertToRuppee(gstAmount).toFixed(2),
    },
  ];

  tableRows.forEach((row) => {
    drawRect(margin, yPos, tableWidth, rowHeight);

    addText(row.particulars, col1X, yPos + 5.5, { fontSize: 9 });
    addText(row.recipient, col2X, yPos + 5.5, { fontSize: 9 });
    addText(row.amount, col3X, yPos + 5.5, {
      fontSize: 9,
      align: "right",
    });

    yPos += rowHeight;
  });

  // Total row
  drawRect(margin, yPos, tableWidth, rowHeight, [245, 245, 245]);
  addText("Total Paid by Customer", col1X, yPos + 5.5, {
    fontSize: 10,
    fontStyle: "bold",
  });
  addText(convertToRuppee(totalAmount).toFixed(2), col3X, yPos + 5.5, {
    fontSize: 10,
    fontStyle: "bold",
    align: "right",
  });
  yPos += rowHeight + 10;

  // ========== LEGAL DISCLOSURE ==========
  drawLine(margin, yPos, pageWidth - margin, yPos);
  yPos += 6;

  addText("Important Legal Disclosure", margin, yPos, {
    fontSize: 10,
    fontStyle: "bold",
  });
  yPos += 6;

  const disclosureText = [
    "• Counvo is a technology platform that connects users with independent, verified lawyers.",
    "• Counvo does not provide legal advice.",
    "• The legal consultation fee is charged by the lawyer and is exempt from, GST under Indian law.",
    "• GST is charged only on Counvo's platform service fee.",
    "• This is a system-generated receipt. No signature is required.",
  ];

  disclosureText.forEach((line) => {
    addText(line, margin, yPos, { fontSize: 8, color: [60, 60, 60] });
    yPos += 4;
  });

  // ========== FOOTER ==========
  const footerY = pageHeight - 15;
  drawLine(margin, footerY - 5, pageWidth - margin, footerY - 5);
  addText("Thank you for using Counvo", pageWidth / 2, footerY, {
    fontSize: 9,
    align: "center",
    color: [100, 100, 100],
  });

  // Save the PDF
  const fileName = `Counvo_Invoice_${invoiceNo.replace(
    /\//g,
    "_"
  )}_${date.replace(/\s/g, "_")}.pdf`;
  doc.save(fileName);

  return fileName;
};

export const convertToRuppee = (amount) => {
  try {
    return amount / 100;
  } catch (error) {
    console.error("Error converting to ruppee:", error);
    return 0;
  }
};
