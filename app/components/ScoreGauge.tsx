const ScoreGauge = ({ score = 0 }: { score: number }) => {
    // Half-doughnut: a semicircle arc from left to right.
    const radius = 60;
    const stroke = 12;
    const circumference = Math.PI * radius; // half circumference
    const offset = circumference * (1 - Math.min(Math.max(score, 0), 100) / 100);

    return (
        <div className="flex flex-col items-center justify-center w-40">
            <div className="relative w-40 h-22.5">
                <svg viewBox="0 0 160 90" className="w-full h-full">
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#FF97AD" />
                            <stop offset="100%" stopColor="#5171FF" />
                        </linearGradient>
                    </defs>

                    <path
                        d="M 20 80 A 60 60 0 0 1 140 80"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                    />
                    <path
                        d="M 20 80 A 60 60 0 0 1 140 80"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                    <div className="text-2xl font-semibold leading-none">{score}/100</div>
                </div>
            </div>
        </div>
    );
};

export default ScoreGauge;
