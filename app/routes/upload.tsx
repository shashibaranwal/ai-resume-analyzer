import React, { type FormEvent, useState} from 'react';
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from '~/lib/pdf2img';
import { generateUUID, parseFeedback } from '~/lib/utils';
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

        const data: {
            id: string;
            resumePath: string;
            imagePath: string;
            companyName: string;
            jobTitle: string;
            jobDescription: string;
            feedback: Feedback | null;
        } = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: null,
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

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

        try {
            data.feedback = parseFeedback(feedbackText);
        } catch (err) {
            console.error("Could not parse AI feedback:", err, feedbackText);
            return setStatusText("Error: The analysis came back in an unexpected format.");
        }

        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText("Analysis complete! Redirecting...");

        navigate(`/resume/${uuid}`);
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
        <main>
            <Navbar/>

            <section className="main-section max-w-2xl!">
                <div className="page-heading">
                    <h1>Smart feedback for your dream job</h1>
                    <h2>
                        {isProcessing
                            ? statusText
                            : "Drop your resume in for an ATS score and improvement tips."}
                    </h2>
                </div>

                {isProcessing ? (
                    <div className="card w-full flex flex-col items-center gap-4 px-6 py-14">
                        <img
                            src="/images/resume-scan.gif"
                            alt="resume scan"
                            className="w-40 opacity-90"
                        />
                        <p className="text-sm text-ink-500">{statusText}</p>
                    </div>
                ) : (
                    <form
                        id="upload-form"
                        onSubmit={handleSubmit}
                        className="card w-full flex flex-col gap-6 p-6"
                    >
                        <div className="form-div">
                            <label htmlFor="company-name">Company name</label>
                            <input type="text" name="company-name" placeholder="e.g. Acme Inc." id="company-name"/>
                        </div>
                        <div className="form-div">
                            <label htmlFor="job-title">Job title</label>
                            <input type="text" name="job-title" placeholder="e.g. Frontend Engineer" id="job-title"/>
                        </div>
                        <div className="form-div">
                            <label htmlFor="job-description">Job description</label>
                            <textarea
                                name="job-description"
                                id="job-description"
                                rows={5}
                                placeholder="Paste the job description here…"
                            ></textarea>
                        </div>
                        <div className="form-div">
                            <label htmlFor="uploader">Resume</label>
                            <FileUploader onFileSelect={handleFileSelect} />
                        </div>
                        <button type="submit" className="primary-button">Analyze Resume</button>
                    </form>
                )}
            </section>
        </main>
    );
}

export default Upload;