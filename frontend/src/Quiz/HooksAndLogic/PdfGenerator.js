import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generateResultsPDF = async (results) => {
  try {
    console.log("Generating PDF...");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    pdf.setProperties({
      title: "MyOS Results",
      subject: "Operating System Recommendations",
      author: "MyOS App",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    let currentY = margin;

    // Add header
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("Your Recommendations", margin, currentY);
    currentY += 10;

    // Add date
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    pdf.text(`Generated on ${date}`, margin, currentY);
    currentY += 15;

    // Add separator line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    // Loop through each distribution
    for (let i = 0; i < results.length; i++) {
      const distro = results[i];

      // Check if new page needed
      if (currentY > pageHeight - 60) {
        pdf.addPage();
        currentY = margin;
      }

      // Distro number and name
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${i + 1}. ${distro.name}`, margin, currentY);
      currentY += 8;

      pdf.setFillColor("royalblue"); // Green
      pdf.roundedRect(margin, currentY - 4, 35, 7, 2, 2, "F");
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`Match: ${distro.match_score}%`, margin + 3, currentY);
      currentY += 10;

      // Description
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);
      const descriptionLines = pdf.splitTextToSize(
        distro.description || "No description available",
        contentWidth
      );
      pdf.text(descriptionLines, margin, currentY);
      currentY += descriptionLines.length * 5 + 5;

      // Details section
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      // Category
      if (distro.category) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Category: ", margin, currentY);
        pdf.setFont("helvetica", "normal");
        const categoryText = distro.category.split(",").join(", ");
        pdf.text(categoryText, margin + 22, currentY);
        currentY += 5;
      }

      // Price
      if (distro.price) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Price: ", margin, currentY);
        pdf.setFont("helvetica", "normal");
        pdf.text(distro.price, margin + 15, currentY);
        currentY += 5;
      }

      // Installation Video
      if (distro.install_video) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Installation Guide: ", margin, currentY);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(0, 0, 255);
        pdf.textWithLink("Watch on YouTube", margin + 38, currentY, {
          url: distro.install_video,
        });
        pdf.setTextColor(0, 0, 0);
        currentY += 5;
      }

      // Add separator between distros (except for last one)
      if (i < results.length - 1) {
        pdf.setDrawColor(220, 220, 220);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 10;
      }
    }

    // footer
    const footerY = pageHeight - 10;
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text("MyOS", margin, footerY);
    pdf.text(
      `Page ${pdf.internal.getNumberOfPages()}`,
      pageWidth - margin - 15,
      footerY
    );

    // Open PDF in new tab instead of auto-downloading
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");

    console.log("PDF generated successfully!");
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
    return false;
  }
};
