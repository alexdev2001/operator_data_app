import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react"; // icons

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
    const [status, setStatus] = useState<string>("");
    const [statusType, setStatusType] = useState<"loading" | "success" | "error" | null>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        onFileSelect(file);

        if (!file) return;

        setStatus("Uploading and parsing file...");
        setStatusType("loading");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("https://data-analysis-api-znaa.onrender.com/upload/dataset", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setStatus(`${data.message} (${data.details})`);
                setStatusType("success");
            } else {
                const error = await response.json();
                setStatus(`Upload failed: ${error.detail}`);
                setStatusType("error");
            }
        } catch (err) {
            console.error(err);
            setStatus("Network or server error.");
            setStatusType("error");
        }
    };

    const renderStatusIcon = () => {
        switch (statusType) {
            case "loading":
                return <Loader2 className="w-10 h-10 animate-spin text-gray-600 dark:text-gray-300" />;
            case "success":
                return <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />;
            case "error":
                return <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            <label className="font-semibold text-black dark:text-white text-lg">Upload Dataset</label>
            <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleFileChange}
                className="border border-gray-300 rounded-lg p-3"
            />
            {status && (
                <div className="flex items-center gap-3 text-base mt-2">
                    {renderStatusIcon()}
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{status}</span>
                </div>
            )}
        </div>
    );
};

export default FileUpload;