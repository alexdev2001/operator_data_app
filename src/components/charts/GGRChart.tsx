import React, { useEffect, useState } from "react";
import { BarChart2 } from "lucide-react"

interface GGRTrendChartProps {
    fileUploaded: boolean;
    selectedSheet: string | null;
}

const GGRTrendChart: React.FC<GGRTrendChartProps> = ({ fileUploaded, selectedSheet }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChart = async () => {
            if (!fileUploaded || !selectedSheet) return;

            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `https://data-analysis-api-eii1.onrender.com/analysis/timeseries?sheet_name=${encodeURIComponent(selectedSheet)}`
                );
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                setImageUrl(`https://data-analysis-api-eii1.onrender.com/plots/${data.plot_path.split('/').pop()}`);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChart();
    }, [fileUploaded, selectedSheet]);

    return (
        <div className="text-center">
            <h2 className="flex items-center justify-center text-xl font-semibold mb-2 gap-2">
                <BarChart2 className="w-6 h-6 text-indigo-600" />
                GGR Trend Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
                This chart shows daily GGR trends and performance changes over time.
            </p>

            {loading && <p className="text-gray-500">Generating chart...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {!loading && !error && imageUrl && (
                <img
                    src={imageUrl}
                    alt="GGR Trend"
                    className="w-full h-64 object-contain rounded-xl mt-3 border border-gray-200 dark:border-gray-700"
                />
            )}

            {!loading && !error && !imageUrl && (
                <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-xl mt-3 flex items-center justify-center">
                    <span className="text-gray-400">No chart yet. Upload a dataset first.</span>
                </div>
            )}
        </div>
    );
};

export default GGRTrendChart;