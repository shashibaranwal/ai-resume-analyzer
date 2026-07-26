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
    <div className="flex flex-row gap-4 items-center py-2">
        <p className="text-2xl font-semibold">{title}</p>
        <ScoreBadge score={score} />
    </div>
);

const CategoryContent = ({ tips }: { tips: Tip[] }) => (
    <div className="flex flex-col gap-4 items-center w-full">
        <div className="bg-gray-50 w-full rounded-2xl px-5 py-4 grid grid-cols-2 gap-4 max-md:grid-cols-1">
            {tips.map((tip, index) => (
                <div className="flex flex-row gap-2 items-center" key={index}>
                    <img
                        src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                        alt={tip.type === "good" ? "good" : "improve"}
                        className="w-5 h-5"
                    />
                    <p className="text-xl text-gray-500">{tip.tip}</p>
                </div>
            ))}
        </div>

        <div className="flex flex-col gap-4 w-full">
            {tips.map((tip, index) => (
                <div
                    key={index}
                    className={cn(
                        "flex flex-col gap-2 rounded-2xl p-4",
                        tip.type === "good"
                            ? "bg-green-50 border border-green-200 text-green-700"
                            : "bg-yellow-50 border border-yellow-200 text-yellow-700"
                    )}
                >
                    <div className="flex flex-row gap-2 items-center">
                        <img
                            src={
                                tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"
                            }
                            alt={tip.type === "good" ? "good" : "improve"}
                            className="w-5 h-5"
                        />
                        <p className="text-xl font-semibold">{tip.tip}</p>
                    </div>
                    <p>{tip.explanation}</p>
                </div>
            ))}
        </div>
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
        <div className="flex flex-col gap-4 w-full">
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
