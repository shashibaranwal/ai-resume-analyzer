import {
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
} from "~/components/Accordion";
import ScoreBadge from "~/components/ScoreBadge";
import { cn } from "~/lib/utils";

type Tip = {
    type: "good" | "improve";
    tip: string;
    explanation: string;
};

const CategoryHeader = ({ title, score }: { title: string; score: number }) => (
    <div className="flex flex-row gap-3 items-center">
        <p className="text-sm font-semibold text-ink-900">{title}</p>
        <ScoreBadge score={score} />
    </div>
);

const CategoryContent = ({ tips }: { tips: Tip[] }) => (
    <div className="flex flex-col gap-3 w-full">
        {tips.map((tip, index) => (
            <div
                key={index}
                className={cn(
                    "flex flex-col gap-1.5 rounded-xl p-4 border",
                    tip.type === "good"
                        ? "bg-badge-green border-emerald-100"
                        : "bg-badge-yellow border-amber-100"
                )}
            >
                <div className="flex flex-row gap-2 items-center">
                    <img
                        src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                        alt={tip.type === "good" ? "good" : "improve"}
                        className="w-4 h-4 shrink-0"
                    />
                    <p
                        className={cn(
                            "text-sm font-semibold",
                            tip.type === "good"
                                ? "text-badge-green-text"
                                : "text-badge-yellow-text"
                        )}
                    >
                        {tip.tip}
                    </p>
                </div>
                <p className="text-sm text-ink-500 leading-relaxed">{tip.explanation}</p>
            </div>
        ))}
    </div>
);

const Details = ({ feedback }: { feedback: Feedback }) => {
    const sections = [
        { id: "tone-style", title: "Tone & Style", data: feedback.toneAndStyle },
        { id: "content", title: "Content", data: feedback.content },
        { id: "structure", title: "Structure", data: feedback.structure },
        { id: "skills", title: "Skills", data: feedback.skills },
    ];

    return (
        <div className="card w-full p-2">
            <Accordion>
                {sections.map((section) => (
                    <AccordionItem key={section.id}>
                        <AccordionHeader itemId={section.id}>
                            <CategoryHeader title={section.title} score={section.data.score} />
                        </AccordionHeader>
                        <AccordionContent itemId={section.id}>
                            <CategoryContent tips={section.data.tips} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default Details;
