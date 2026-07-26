const ATS = ({
                 score,
                 suggestions,
             }: {
    score: number;
    suggestions: { type: "good" | "improve"; tip: string }[];
}) => {
    const gradient =
        score > 69
            ? "from-green-100"
            : score > 49
                ? "from-yellow-100"
                : "from-red-100";

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

    return (
        <div
            className={`bg-gradient-to-b ${gradient} to-white rounded-2xl shadow-md w-full p-6 flex flex-col gap-4`}
        >
            <div className="flex flex-row gap-4 items-center">
                <img src={icon} alt="ATS score" className="w-10 h-10" />
                <p className="text-2xl font-semibold">ATS Score - {score}/100</p>
            </div>

            <div className="flex flex-col gap-2">
                <p className="font-medium text-xl">{subtitle}</p>
                <p className="text-gray-500">
                    This score represents how well your resume is likely to perform in
                    Applicant Tracking Systems used by recruiters.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                {suggestions.map((suggestion, index) => (
                    <div className="flex flex-row gap-2 items-start" key={index}>
                        <img
                            src={
                                suggestion.type === "good"
                                    ? "/icons/check.svg"
                                    : "/icons/warning.svg"
                            }
                            alt={suggestion.type === "good" ? "good" : "improve"}
                            className="w-5 h-5 mt-1"
                        />
                        <p
                            className={
                                suggestion.type === "good" ? "text-green-700" : "text-amber-700"
                            }
                        >
                            {suggestion.tip}
                        </p>
                    </div>
                ))}
            </div>

            <p className="text-gray-500 italic">
                Keep refining your resume to improve your chances of landing an interview.
            </p>
        </div>
    );
};

export default ATS;
