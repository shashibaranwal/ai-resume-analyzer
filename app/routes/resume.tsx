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
            <nav className="resume-nav sticky top-0 z-20 bg-white">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">
                        Back to Homepage
                    </span>
                </Link>

                <Link to="/upload" className="primary-button w-fit px-4">
                    Analyze another resume
                </Link>
            </nav>

            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="w-1/2 max-lg:w-full bg-[url('/images/bg-small.svg')] bg-cover h-screen sticky top-0 items-center justify-center flex max-lg:h-auto max-lg:py-10">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    alt="resume"
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="Open the original PDF"
                                />
                            </a>
                        </div>
                    )}
                </section>

                <section className="feedback-section items-center">
                    {/* Inner wrapper keeps the feedback centred in its half of the page
                        instead of hugging the left edge on wide screens. */}
                    <div className="w-full max-w-3xl flex flex-col gap-8">
                        <h2 className="text-4xl text-black! font-bold text-center">
                            Resume Review
                        </h2>

                        {feedback ? (
                            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                                <Summary feedback={feedback} />
                                <ATS
                                    score={feedback.ATS.score}
                                    suggestions={feedback.ATS.tips}
                                />
                                <Details feedback={feedback} />
                            </div>
                        ) : notFound ? (
                            <div className="flex flex-col items-center gap-4">
                                <h3 className="text-xl text-dark-200">
                                    We couldn't find that resume.
                                </h3>
                                <Link to="/upload" className="primary-button w-fit px-6">
                                    Analyze a resume
                                </Link>
                            </div>
                        ) : (
                            <img src="/images/resume-scan-2.gif" className="w-full" alt="loading" />
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Resume;
