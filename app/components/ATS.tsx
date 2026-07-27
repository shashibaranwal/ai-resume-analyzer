const ATS = ({
                 score,
                 suggestions,
             }: {
    score: number;
    suggestions: { type: "good" | "improve"; tip: string }[];
}) => {
    const icon =
        score > 69
            ? "/icons/ats-good.svg"
            : score > 49
                ? "/icons/ats-warning.svg"
                : "/icons/ats-bad.svg";

    const subtitle =
        score > 69
            ? "Great Job!"
            : score > 49
                ? "Good Start"
                : "Needs Improvement";

    const scoreColor =
        score > 69
            ? "text-badge-green-text"
            : score > 49
                ? "text-badge-yellow-text"
                : "text-badge-red-text";

    return (
        <div className="card w-full p-6 flex flex-col gap-5">
            <div className="flex flex-row gap-3 items-center justify-between">
                <div className="flex flex-row gap-3 items-center">
                    <img src={icon} alt="" className="w-8 h-8" />
                    <div className="flex flex-col">
                        <p className="text-base font-semibold text-ink-900">ATS Score</p>
                        <p className="text-sm text-ink-500">{subtitle}</p>
                    </div>
                </div>
                <p className="text-sm text-ink-400 tabular-nums">
                    <span className={`text-2xl font-semibold ${scoreColor}`}>{score}</span>/100
                </p>
            </div>

            <p className="text-sm text-ink-500 leading-relaxed">
                This score represents how well your resume is likely to perform in
                Applicant Tracking Systems used by recruiters.
            </p>

            <div className="flex flex-col gap-2.5 border-t border-line pt-5">
                {suggestions.map((suggestion, index) => (
                    <div className="flex flex-row gap-2.5 items-start" key={index}>
                        <img
                            src={
                                suggestion.type === "good"
                                    ? "/icons/check.svg"
                                    : "/icons/warning.svg"
                            }
                            alt={suggestion.type === "good" ? "good" : "improve"}
                            className="w-4 h-4 mt-0.5 shrink-0"
                        />
                        <p className="text-sm text-ink-500 leading-relaxed">
                            {suggestion.tip}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ATS;
