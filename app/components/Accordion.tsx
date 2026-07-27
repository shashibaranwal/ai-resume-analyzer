import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import { cn } from "~/lib/utils";

interface AccordionContextType {
    activeItems: string[];
    toggleItem: (id: string) => void;
    isItemActive: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
    undefined
);

const useAccordion = () => {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error("Accordion components must be used within an Accordion");
    }
    return context;
};

interface AccordionProps {
    children: ReactNode;
    defaultOpen?: string;
    allowMultiple?: boolean;
    className?: string;
}

export const Accordion = ({
                              children,
                              defaultOpen,
                              allowMultiple = false,
                              className = "",
                          }: AccordionProps) => {
    const [activeItems, setActiveItems] = useState<string[]>(
        defaultOpen ? [defaultOpen] : []
    );

    const toggleItem = (id: string) => {
        setActiveItems((prev) => {
            if (allowMultiple) {
                return prev.includes(id)
                    ? prev.filter((item) => item !== id)
                    : [...prev, id];
            }
            return prev.includes(id) ? [] : [id];
        });
    };

    const isItemActive = (id: string) => activeItems.includes(id);

    return (
        <AccordionContext.Provider
            value={{ activeItems, toggleItem, isItemActive }}
        >
            <div className={`space-y-2 ${className}`}>{children}</div>
        </AccordionContext.Provider>
    );
};

export const AccordionItem = ({
                                 children,
                                 className = "",
                             }: {
    children: ReactNode;
    className?: string;
}) => <div className={`overflow-hidden ${className}`}>{children}</div>;

export const AccordionHeader = ({
                                    itemId,
                                    children,
                                    className = "",
                                }: {
    itemId: string;
    children: ReactNode;
    className?: string;
}) => {
    const { isItemActive, toggleItem } = useAccordion();
    const isActive = isItemActive(itemId);

    return (
        <button
            type="button"
            onClick={() => toggleItem(itemId)}
            aria-expanded={isActive}
            className={cn(
                "w-full px-4 py-3.5 text-left flex items-center justify-between cursor-pointer transition-colors hover:bg-canvas rounded-xl",
                className
            )}
        >
            <div className="flex items-center gap-3 w-full">{children}</div>
            <svg
                className={cn(
                    "w-4 h-4 shrink-0 text-ink-400 transition-transform duration-200",
                    isActive ? "rotate-180" : ""
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                />
            </svg>
        </button>
    );
};

export const AccordionContent = ({
                                     itemId,
                                     children,
                                     className = "",
                                 }: {
    itemId: string;
    children: ReactNode;
    className?: string;
}) => {
    const { isItemActive } = useAccordion();

    if (!isItemActive(itemId)) return null;

    return (
        <div className={cn("px-4 pb-4 pt-1 animate-in fade-in duration-200", className)}>
            {children}
        </div>
    );
};
