import { useState } from "react";
import { useLocation } from "react-router-dom";
import { generateResultsPDF } from "../../../utils/pdfGenerator.js";

export function useResult() {
    const location = useLocation();
    const { results } = location.state || { results: [] };
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const handleDownloadPDF = async () => {
        setIsGeneratingPDF(true);

        try {
            await generateResultsPDF(results);
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    return {
        results,
        isGeneratingPDF,
        handleDownloadPDF
    };
}
