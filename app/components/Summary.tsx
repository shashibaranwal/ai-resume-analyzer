import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
    const textColor =
        score > 69 ? "text-badge-green-text" : score > 49 ? "text-badge-yellow-text" : "text-badge-red-text";

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-2.5 items-center">
                    <p className="text-sm font-medium text-ink-900">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className="text-sm text-ink-400 tabular-nums">
                    <span className={`text-base font-semibold ${textColor}`}>{score}</span>/100
                </p>
            </div>
        </div>
    );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="card w-full">
            <div className="flex flex-col items-center justify-center px-5 pt-8 pb-6 gap-1 text-center">
                <ScoreGauge score={feedback.overallScore} />

                <h3 className="text-lg font-semibold text-ink-900 mt-2">Your Resume Score</h3>
                <p className="text-sm text-ink-500 max-w-xs">
                    Calculated from the categories listed below.
                </p>
            </div>

            <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
            <Category title="Content" score={feedback.content.score} />
            <Category title="Structure" score={feedback.structure.score} />
            <Category title="Skills" score={feedback.skills.score} />
        </div>
    );
};

export default Summary;
