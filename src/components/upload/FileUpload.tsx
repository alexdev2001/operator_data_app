import React from "react";
import type { ChangeEvent } from "react";

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        onFileSelect(file);
    };

    return (
        <div className="flex flex-col space-y-2">
            <label className="font-semibold text-black dark:text-white">Upload Dataset</label>
            <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleFileChange}
                className="border border-gray-300 rounded-lg p-2"
            />
        </div>
    );
};

export default FileUpload;