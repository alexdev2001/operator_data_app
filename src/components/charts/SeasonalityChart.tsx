import React, {useEffect, useState} from "react";
import { Calendar } from "lucide-react";
interface SeasonalityChartProps {
    fileUploaded: boolean;
    selectedSheet: string | null;
}

const SeasonalityChart: React.FC<SeasonalityChartProps> = ({ fileUploaded, selectedSheet }) => {
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
                    `https://data-analysis-api-eii1.onrender.com/analysis/seasonality?sheet_name=${encodeURIComponent(selectedSheet)}`
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
                <Calendar className="w-6 h-6 text-indigo-600" />
                Seasonality Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
                Shows weekly or daily patterns and recurring trends in the data.
            </p>

            {loading && <p className="text-gray-500 dark:text-gray-400">Generating chart...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && imageUrl && (
                <img
                    src={imageUrl}
                    alt="Seasonality Chart"
                    className="w-full h-64 object-contain rounded-xl mt-3 border border-gray-200 dark:border-gray-700"
                />
            )}

            {!loading && !error && !imageUrl && (
                <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-xl mt-3 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500">No chart yet. Upload a dataset first.</span>
                </div>
            )}
        </div>
    );
}

export default SeasonalityChart;