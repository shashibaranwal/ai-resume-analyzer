const ScoreGauge = ({ score = 0 }: { score: number }) => {
    // Half-doughnut: a semicircle arc from left to right.
    const radius = 60;
    const stroke = 10;
    const circumference = Math.PI * radius; // half circumference
    const clamped = Math.min(Math.max(score, 0), 100);
    const offset = circumference * (1 - clamped / 100);

    const color = score > 69 ? "#10b981" : score > 49 ? "#f59e0b" : "#ef4444";

    return (
        <div className="flex flex-col items-center justify-center w-40">
            <div className="relative w-40 h-22.5">
                <svg viewBox="0 0 160 90" className="w-full h-full">
                    <path
                        d="M 20 80 A 60 60 0 0 1 140 80"
                        fill="none"
                        stroke="#e8ebf1"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                    />
                    <path
                        d="M 20 80 A 60 60 0 0 1 140 80"
                        fill="none"
                        stroke={color}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                    <span className="text-3xl font-semibold leading-none tracking-tight">
                        {score}
                    </span>
                    <span className="text-xs text-ink-400 mt-1">out of 100</span>
                </div>
            </div>
        </div>
    );
};

export default ScoreGauge;
