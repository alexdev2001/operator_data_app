import { Activity } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ForecastChartProps {
    fileUploaded: boolean;
    selectedSheet: string | null;
}

const ForecastChart: React.FC<ForecastChartProps> = ({ fileUploaded, selectedSheet }) => {
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
                    `http://localhost:8000/analysis/forecast?sheet_name=${encodeURIComponent(selectedSheet)}`
                );
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                setImageUrl(`http://localhost:8000/plots/${data.plot_path.split('/').pop()}`);
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
                <Activity className="w-6 h-6 text-indigo-600" />
                Forecast
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
                Predict future values using historical trends.
            </p>

            {loading && <p className="text-gray-500 dark:text-gray-400">Generating chart...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && imageUrl && (
                <img
                    src={imageUrl}
                    alt="Forecast Chart"
                    className="w-full h-64 object-contain rounded-xl mt-3 border border-gray-200 dark:border-gray-700"
                />
            )}

            {!loading && !error && !imageUrl && (
                <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-xl mt-3 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500">
                        No chart yet. Upload a dataset first.
                    </span>
                </div>
            )}
        </div>
    );
};

export default ForecastChart;