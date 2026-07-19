import React, { type FormEvent, useState} from 'react';
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";


const Upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null)

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        
        if(!form) return;

        const formData = new FormData(form);
       
        const companyName = formData.get('company-name');
        const jobTitle = formData.get('job-title');
        const jobDescription = formData.get('job-description');

        console.log({
            'Company Name': companyName,
            'Job Title': jobTitle,
            'Job Description': jobDescription,
            'File': file
        });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar/>

            <section className="main-section">
                <div className="page-heading py-4 w-full">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" alt="resume scan" className="w-1/2"/>
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS and improvement tips.</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white rounded-lg shadow-md p-4">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name:</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name"/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title:</label>
                                <input type="text" name="job-title" placeholder="Company Name" id="company-name"/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description:</label>
                                <textarea name="job-description" rows={5}></textarea>
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume:</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>
                            <button type="submit" className="primary-button">Analyze Resume</button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
}

export default Upload;