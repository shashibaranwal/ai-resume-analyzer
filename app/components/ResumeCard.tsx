import React from 'react';
import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";

const ResumeCard = ( { resume: {id, companyName, jobTitle, feedback, imagePath} }: { resume: Resume })=> {
    return (
            <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-300">
                <div className="resume-card-header">
                    <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-base font-semibold text-ink-900 truncate">{companyName}</p>
                        <p className="text-sm text-ink-500 truncate">{jobTitle}</p>
                    </div>

                    <ScoreCircle score={feedback.overallScore} />
                </div>

                <div className="overflow-hidden rounded-xl border border-line bg-canvas">
                    <img
                        src={imagePath}
                        alt="resume"
                        className="w-full h-56 object-cover object-top"
                    />
                </div>
            </Link>
    );
}

export default ResumeCard;
