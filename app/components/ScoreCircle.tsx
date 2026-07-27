const ScoreCircle = ({ score = 75 }: { score: number }) => {
    const radius = 40;
    const stroke = 6;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = Math.min(Math.max(score, 0), 100) / 100;
    const strokeDashoffset = circumference * (1 - progress);

    const color = score > 69 ? "#10b981" : score > 49 ? "#f59e0b" : "#ef4444";

    return (
        <div className="relative w-14 h-14 shrink-0">
            <svg
                height="100%"
                width="100%"
                viewBox="0 0 100 100"
                className="transform -rotate-90"
            >
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="#e8ebf1"
                    strokeWidth={stroke}
                    fill="transparent"
                />
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke={color}
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-ink-900">{score}</span>
            </div>
        </div>
    );
};

export default ScoreCircle;
