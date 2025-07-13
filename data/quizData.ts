export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
    {
        question: "A news headline reads: 'Brave Rescuers Save Family, Ignoring Own Safety.' Which type of bias is most evident?",
        options: ["Omission", "Loaded Language", "Stereotyping"],
        correctAnswer: "Loaded Language",
        explanation: "Words like 'Brave' and 'Ignoring Own Safety' are emotionally charged (loaded) to create a heroic impression, rather than just stating the facts."
    },
    {
        question: "An article about a new tax plan only interviews people who will benefit from it, without mentioning those who will be negatively affected. This is an example of:",
        options: ["Framing", "Omission", "Spin"],
        correctAnswer: "Omission",
        explanation: "By leaving out the perspectives of those negatively impacted, the article presents a one-sided and incomplete picture of the tax plan's effects."
    },
    {
        question: "A politician is described as a 'radical extremist' by an opponent. This is an example of:",
        options: ["Unsubstantiated Claim", "Spin", "Framing"],
        correctAnswer: "Spin",
        explanation: "'Radical extremist' is sensational language used to negatively shape opinion (spin) without necessarily providing evidence to support the label."
    },
    {
        question: "A report states, 'Everyone knows that young people are irresponsible with money.' This is a clear example of:",
        options: ["Loaded Language", "Omission", "Stereotyping"],
        correctAnswer: "Stereotyping",
        explanation: "This assigns a negative financial trait to an entire generation, ignoring individual differences and responsible behavior among many young people."
    },
    {
        question: "A company's press release says a new product is 'revolutionary' and 'world-changing' before it has been reviewed by any independent sources. This is an example of:",
        options: ["Unsubstantiated Claim", "Framing", "Omission"],
        correctAnswer: "Unsubstantiated Claim",
        explanation: "The claims 'revolutionary' and 'world-changing' are presented as facts but are not yet supported by any external evidence or proof."
    }
];