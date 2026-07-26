import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    loadPromise = import("pdfjs-dist").then((lib) => {
        lib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
        pdfjsLib = lib;
        return lib;
    });

    return loadPromise;
}

export const extractPdfText = async (file: File) => {
    const lib = await loadPdfJs();

    const buffer = await file.arrayBuffer();

    const pdf = await lib.getDocument({
        data: buffer,
    }).promise;

    let text = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);

        const content = await page.getTextContent();

        text +=
            content.items
                .map((item: any) => item.str)
                .join(" ") + "\n";
    }

    return text;
};
