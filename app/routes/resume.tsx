import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => [
    { title: "Resumind | Review" },
    { name: "description", content: "Detailed overview of your resume" },
];

const Resume = () => {
    const { id } = useParams();
    const { auth, isLoading, fs, kv } = usePuterStore();
    const navigate = useNavigate();

    const [imageUrl, setImageUrl] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading, auth.isAuthenticated]);

    useEffect(() => {
        // Object URLs are revoked on unmount, so track them outside of state.
        let createdUrls: string[] = [];

        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);
            if (!resume) return setNotFound(true);

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if (resumeBlob) {
                const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
                const url = URL.createObjectURL(pdfBlob);
                createdUrls.push(url);
                setResumeUrl(url);
            }

            const imageBlob = await fs.read(data.imagePath);
            if (imageBlob) {
                const url = URL.createObjectURL(imageBlob);
                createdUrls.push(url);
                setImageUrl(url);
            }

            setFeedback(data.feedback);
        };

        loadResume();

        return () => createdUrls.forEach((url) => URL.revokeObjectURL(url));
    }, [id]);

    return (
        <main className="pt-0!">
            {/* Sticky + z-20 so the nav is never painted over by the sticky
                resume panel below it, which is a positioned sibling. */}
            <nav className="resume-nav sticky top-0 z-20 bg-surface/80 backdrop-blur-md">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="" className="w-2.5 h-2.5" />
                    <span className="text-sm font-medium">Back to homepage</span>
                </Link>

                <Link to="/upload" className="primary-button w-fit">
                    Analyze another resume
                </Link>
            </nav>

            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="w-1/2 max-lg:w-full bg-canvas border-r border-line max-lg:border-r-0 max-lg:border-t h-screen sticky top-0 items-center justify-center flex max-lg:h-auto p-10">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-700 gradient-border max-h-full w-fit shadow-[0_12px_40px_-16px_rgba(15,23,42,0.2)]">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    alt="resume"
                                    className="max-h-[75vh] w-auto object-contain rounded-xl"
                                    title="Open the original PDF"
                                />
                            </a>
                        </div>
                    )}
                </section>

                <section className="feedback-section items-center">
                    {/* Inner wrapper keeps the feedback centred in its half of the page
                        instead of hugging the left edge on wide screens. */}
                    <div className="w-full max-w-2xl flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl!">Resume review</h1>
                            <h2>A breakdown of how your resume performs.</h2>
                        </div>

                        {feedback ? (
                            <div className="flex flex-col gap-6 animate-in fade-in duration-700">
                                <Summary feedback={feedback} />
                                <ATS
                                    score={feedback.ATS.score}
                                    suggestions={feedback.ATS.tips}
                                />
                                <Details feedback={feedback} />
                            </div>
                        ) : notFound ? (
                            <div className="card flex flex-col items-center gap-4 px-6 py-16 text-center">
                                <p className="text-base font-medium text-ink-900">
                                    We couldn't find that resume.
                                </p>
                                <Link to="/upload" className="primary-button w-fit">
                                    Analyze a resume
                                </Link>
                            </div>
                        ) : (
                            <div className="card flex items-center justify-center px-6 py-16">
                                <img
                                    src="/images/resume-scan-2.gif"
                                    className="w-40 opacity-90"
                                    alt="loading"
                                />
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Resume;
