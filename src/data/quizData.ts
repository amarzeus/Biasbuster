export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: "What is framing bias?",
    options: [
      "Completely omitting information",
      "Presenting information in a way that influences interpretation",
      "Using emotional language",
      "Making unsubstantiated claims"
    ],
    correctAnswer: 1,
    explanation: "Framing bias involves presenting information in a way that influences how it is interpreted, often by highlighting certain aspects while downplaying others."
  },
  {
    question: "Which of the following is an example of omission bias?",
    options: [
      "Using words like 'disaster' instead of 'incident'",
      "Leaving out important facts that could change perspective",
      "Making claims without evidence",
      "Assigning negative characteristics to a group"
    ],
    correctAnswer: 1,
    explanation: "Omission bias occurs when important facts or alternative viewpoints are left out, potentially changing how the audience understands the topic."
  },
  {
    question: "What is loaded language?",
    options: [
      "Using technical jargon",
      "Words with strong emotional connotations",
      "Scientific terminology",
      "Foreign words"
    ],
    correctAnswer: 1,
    explanation: "Loaded language uses words with strong emotional connotations (positive or negative) to influence the audience's feelings about a topic."
  },
  {
    question: "Which bias involves making statements that appear factual but lack evidence?",
    options: [
      "Framing bias",
      "Stereotyping",
      "Unsubstantiated claims",
      "Confirmation bias"
    ],
    correctAnswer: 2,
    explanation: "Unsubstantiated claims are statements that appear to be factual but are not supported by evidence or credible sources."
  },
  {
    question: "What is stereotyping bias?",
    options: [
      "Using vague language",
      "Assigning oversimplified characteristics to entire groups",
      "Highlighting positive aspects only",
      "Focusing on negative aspects only"
    ],
    correctAnswer: 1,
    explanation: "Stereotyping involves assigning oversimplified and often negative characteristics to an entire group of people, ignoring individual differences."
  }
];
