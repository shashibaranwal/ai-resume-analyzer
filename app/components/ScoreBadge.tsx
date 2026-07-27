const ScoreBadge = ({ score }: { score: number }) => {
    const { label, className } =
        score > 69
            ? { label: "Strong", className: "bg-badge-green text-badge-green-text" }
            : score > 49
                ? { label: "Good Start", className: "bg-badge-yellow text-badge-yellow-text" }
                : { label: "Needs Work", className: "bg-badge-red text-badge-red-text" };

    return (
        <span className={`score-badge ${className}`}>{label}</span>
    );
};

export default ScoreBadge;
