import {useState, useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {cn, formatSize} from "~/lib/utils";


interface FileUploaderProps {
    onFileSelect ? : (file: File | null) => void;
}

const FileUploader =({onFileSelect}: FileUploaderProps) => {

    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0] || null;
        setFile(selectedFile);
        onFileSelect?.(selectedFile);

    }, [onFileSelect])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf']},
        maxSize: 20*1024*1024,
    })

    const handleRemove = () => {
        setFile(null);
        onFileSelect?.(null);
    }

    if (file) {
        return (
            <div className="w-full uploader-selected-file border border-line">
                <img src="/images/pdf.png" alt="pdf" className="size-9 shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink-900 font-medium truncate">
                        {file.name}
                    </p>
                    <p className="text-xs text-ink-500">
                        {formatSize(file.size)}
                    </p>
                </div>
                <button
                    type="button"
                    aria-label="Remove file"
                    className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-line"
                    onClick={handleRemove}
                >
                    <img src="/icons/cross.svg" alt="" className="size-3.5" />
                </button>
            </div>
        )
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                "w-full rounded-xl border border-dashed px-6 py-10 text-center cursor-pointer transition-colors",
                isDragActive
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-white hover:border-accent/50 hover:bg-canvas"
            )}
        >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center gap-1">
                <img src="/icons/info.svg" alt="" className="size-8 opacity-40 mb-2" />
                <p className="text-sm text-ink-900">
                    <span className="font-medium text-accent">Click to upload</span>
                    {" "}or drag and drop
                </p>
                <p className="text-xs text-ink-400">PDF, up to 20 MB</p>
            </div>
        </div>
    )
}

export default FileUploader;
