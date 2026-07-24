import React, { type FormEvent, useState} from 'react';
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from '~/lib/pdf2img';
import { generateUUID } from '~/lib/utils';
import { prepareInstructions } from '../../constants';
import { extractPdfText } from "../lib/pdf";


const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null)

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalyzer = async ({companyName, jobTitle, jobDescription, file} : {companyName: string, jobTitle: string, jobDescription: string, file: File}) => {
        setIsProcessing(true);
        setStatusText("Uploading the file...");

        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText("Error: Failed to upload the file.");

        setStatusText("Reading resume...");
        const resumeText = await extractPdfText(file);
        console.log(resumeText);

        setStatusText("Converting to image...");

        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText("Error: Failed to convert the file to image.");

        setStatusText("Uploading the image...");
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText("Error: Failed to upload the image.");

        setStatusText("Preparing data...");

        const uuid = generateUUID();

        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: '',

        }
        await kv.set(`resume: ${uuid}`, JSON.stringify(data));

        setStatusText("Analyzing...");

        console.log("Calling AI...");
        const start = Date.now();

        const feedback = await ai.chat(`
            ${prepareInstructions({
                jobTitle,
                jobDescription,
            })}

            Resume:
            ${resumeText}
        `);

        console.log("AI finished in", Date.now() - start, "ms");
        console.log(feedback);

        if(!feedback) return setStatusText("Error: Failed to analyze the resume.");

        const feedbackText = typeof feedback.message.content === 'string' ? feedback.message.content : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume: ${uuid}`, JSON.stringify(data));
        setStatusText("Analysis complete!");

        console.log(data);
        // navigate(`/results/${uuid}`);

    }


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        
        if(!form) return;

        const formData = new FormData(form);
       
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyzer({companyName, jobTitle, jobDescription, file});
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