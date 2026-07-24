export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume_01.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume_02.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume_03.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
];

export const AIResponseFormat = `
{
  "overallScore": 0,
  "ATS": {
    "score": 0,
    "tips": [
      {
        "type": "good",
        "tip": ""
      }
    ]
  },
  "toneAndStyle": {
    "score": 0,
    "tips": [
      {
        "type": "good",
        "tip": "",
        "explanation": ""
      }
    ]
  },
  "content": {
    "score": 0,
    "tips": [
      {
        "type": "good",
        "tip": "",
        "explanation": ""
      }
    ]
  },
  "structure": {
    "score": 0,
    "tips": [
      {
        "type": "good",
        "tip": "",
        "explanation": ""
      }
    ]
  },
  "skills": {
    "score": 0,
    "tips": [
      {
        "type": "good",
        "tip": "",
        "explanation": ""
      }
    ]
  }
}
`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) => `
You are an expert ATS (Applicant Tracking System) and resume reviewer.

Analyze the attached resume thoroughly.

Job Title:
${jobTitle}

Job Description:
${jobDescription}

Return ONLY valid JSON matching this structure:

${AIResponseFormat}

Rules:
- Return ONLY the JSON object.
- No markdown.
- No backticks.
- No explanation.
- Fill every field.
- Every score must be between 0 and 100.
- Provide 3-4 tips for each section.
`;