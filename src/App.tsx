import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import GGRTrendChart from "@/components/charts/GGRChart.tsx";
import SeasonalityChart from "@/components/charts/SeasonalityChart.tsx";
import ForecastChart from "@/components/charts/ForecastChart.tsx";
import ReportSummary from "@/components/charts/ReportSummary.tsx";
import FileUpload from "@/components/upload/FileUpload.tsx";
import { Sun, Moon } from "lucide-react";
import './App.css';

function App() {
    const [selectedGraph, setSelectedGraph] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [fileUploaded, setFileUploaded] = useState(false);

    const [sheets, setSheets] = useState<string[]>([]);
    const [selectedSheet, setSelectedSheet] = useState<string | null>(null);

    // Detect system dark mode preference by default
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        const fetchSheets = async () => {
            if (!fileUploaded) return;
            try {
                const res = await fetch("https://data-analysis-api-znaa.onrender.com/upload/sheets");
                const data = await res.json();
                setSheets(data.sheets);
                if (data.sheets.length > 0) setSelectedSheet(data.sheets[0]);
            } catch (err) {
                console.error("Error fetching sheets", err);
            }
        };
        fetchSheets();
    }, [fileUploaded]);

    // Apply dark class to <html> for full-page dark mode
    useEffect(() => {
        const root = window.document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [darkMode]);

    const handleGenerateReport = () => {
        setSelectedGraph("report");
    };

    const renderGraph = () => {
        switch (selectedGraph) {
            case "ggr":
                return <GGRTrendChart fileUploaded={fileUploaded} selectedSheet={selectedSheet} />;
            case "seasonality":
                return <SeasonalityChart fileUploaded={fileUploaded} selectedSheet={selectedSheet} />;
            case "forecast":
                return <ForecastChart fileUploaded={fileUploaded} selectedSheet={selectedSheet} />;
            case "report":
                return <ReportSummary fileUploaded={fileUploaded} allSheets={sheets} fileName={file?.name} />;
            default:
                return <p className="text-gray-500 dark:text-gray-400 italic">
                    Select a graph or generate a report to get started.
                </p>;
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 flex justify-between items-center">
                <h1 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    📊 Data Insights Dashboard
                </h1>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleGenerateReport}
                        className="bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                         Report
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setDarkMode(!darkMode)}
                        className="bg-gray-200 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-full"
                    >
                        {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-black" />}
                    </Button>
                </div>
            </header>

            {/* Content */}
            <main className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar */}
                <aside className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow md:col-span-1">
                    <FileUpload
                        onFileSelect={(uploadedFile) => {
                            setFile(uploadedFile);
                            setFileUploaded(true);
                        }}
                    />

                    {/* Dropdown for sheet selection */}
                    {fileUploaded && sheets.length > 0 && (
                        <div className="mt-4">
                            <label className="text-gray-700 dark:text-gray-300 font-semibold mb-1">
                                Select Operator Sheet:
                            </label>
                            <select
                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                value={selectedSheet ?? ""}
                                onChange={(e) => setSelectedSheet(e.target.value)}
                            >
                                {sheets.map((sheet) => (
                                    <option key={sheet} value={sheet}>
                                        {sheet}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="mt-6">
                        <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Generate Graphs
                        </h2>
                        <div className="flex flex-col space-y-2">
                            <Button variant="outline" onClick={() => setSelectedGraph("ggr")}>
                                GGR Trend
                            </Button>
                            <Button variant="outline" onClick={() => setSelectedGraph("seasonality")}>
                                Seasonality Analysis
                            </Button>
                            <Button variant="outline" onClick={() => setSelectedGraph("forecast")}>
                                Forecast Chart
                            </Button>
                        </div>
                    </div>
                </aside>

                {/* Main Display */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow md:col-span-3 flex flex-col items-center">
                    {renderGraph()}
                </section>
            </main>

            {/* Footer */}
            <footer className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} Data Insights Dashboard
            </footer>
        </div>
    );
}

export default App;