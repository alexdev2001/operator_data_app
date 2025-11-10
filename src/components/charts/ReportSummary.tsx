import { useState } from "react";
import { FileText, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportSummaryProps {
    fileUploaded: boolean;
    allSheets: string[]; // All sheet names, not just selected
    fileName?: string;
}

export default function ReportSummary({ fileUploaded, allSheets, fileName }: ReportSummaryProps) {
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateReport = async () => {
        if (!fileUploaded || allSheets.length === 0 || !fileName) {
            setError("Please upload a file first.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 🔹 Include all sheet names in the query
            const sheetParams = allSheets.map(
                (s) => `sheets=${encodeURIComponent(s)}`
            ).join("&");

            const url = `https://data-analysis-api-8l1t.onrender.com/report/full?file_name=${encodeURIComponent(
                fileName
            )}&${sheetParams}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            // Convert response to blob and create object URL for inline display
            const blob = await response.blob();
            const pdfBlobUrl = URL.createObjectURL(blob);
            setPdfUrl(pdfBlobUrl);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-center w-full flex flex-col items-center">
            <h2 className="flex items-center justify-center text-xl font-semibold mb-2 gap-2">
                <FileText className="w-6 h-6 text-indigo-600" />
                Full Report Summary
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
                Automatically generates a detailed PDF report comparing all operator sheets.
            </p>

            <Button
                onClick={handleGenerateReport}
                disabled={loading}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Report...
                    </div>
                ) : (
                    "Generate Full Report"
                )}
            </Button>

            {error && <p className="text-red-500 mt-3">{error}</p>}

            {/* Inline PDF viewer */}
            {!loading && pdfUrl && (
                <div className="mt-6 w-full flex flex-col items-center">
                    <iframe
                        src={pdfUrl}
                        title="Report Preview"
                        className="w-full h-[600px] border border-gray-300 dark:border-gray-700 rounded-lg"
                    />
                    <a
                        href={pdfUrl}
                        download="full_report.pdf"
                        className="mt-3 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                    >
                        <Download className="w-4 h-4" />
                        Download Report
                    </a>
                </div>
            )}
        </div>
    );
}