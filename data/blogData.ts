import { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: "The Subtle Art of Framing: How Media Shapes Your Reality",
        author: "Dr. Evelyn Reed",
        date: "2024-05-15",
        summary: "Framing isn't just about what is said, but how it's said. We dive deep into how media outlets use framing to influence public perception and what you can do to spot it.",
        content: `
### What is Framing?

Framing is one of the most powerful and subtle forms of media bias. It refers to the way information is presented to an audience, including the angle of a story, the details that are included or excluded, and the language used. By controlling the 'frame' of a story, media can influence how you interpret events, people, and policies.

### Real-World Example

Consider two headlines about the same economic report:

1.  **"Unemployment Rate Falls to 5-Year Low"**: This frame is positive, focusing on the success of job creation.
2.  **"Despite Job Growth, Underemployment for Graduates Hits Record High"**: This frame is negative, focusing on the challenges within the job market despite the positive headline number.

Both headlines can be factually correct, but they create vastly different impressions of the economy.

### How Biasbuster Detects Framing

Our AI is trained to look for specific patterns associated with framing, such as:
*   **Selective Emphasis**: Highlighting positive or negative data disproportionately.
*   **Causal Oversimplification**: Attributing complex outcomes to single, simple causes.
*   **Metaphorical Framing**: Using metaphors (e.g., "war on drugs," "tax relief") to evoke specific emotional and cognitive responses.

By understanding these patterns, you can begin to see the frame and look for the bigger picture that might be missing.
        `,
        image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=2070&auto=format&fit=crop",
        tags: ["Framing", "Media Literacy", "Research"]
    },
    {
        id: 2,
        title: "Bias in AI: A Challenge We Must Overcome",
        author: "Marcus Thorne",
        date: "2024-05-28",
        summary: "Artificial Intelligence is a mirror reflecting the data it's trained on—biases and all. This post explores the technical and ethical challenges of creating fair AI.",
        content: `
### The Root of AI Bias

AI models, especially large language models (LLMs) like the one powering Biasbuster, learn from vast amounts of text and data from the internet. This data contains the collective knowledge, creativity, and unfortunately, the biases of humanity. If a model is trained on biased data, it will learn to replicate, and sometimes amplify, those biases.

### Types of AI Bias

*   **Historical Bias**: Reflecting stereotypes that were present in historical data (e.g., associating certain jobs with a specific gender).
*   **Representation Bias**: When the training data does not accurately represent the diversity of the real world, leading to poorer performance for underrepresented groups.
*   **Measurement Bias**: When the data is collected or labeled in a flawed way, skewing the model's understanding.

### Our Commitment to Fairness

At Biasbuster, we are actively working to mitigate these biases through:
1.  **Careful Data Curation**: Selecting and cleaning our training data to be as diverse and representative as possible.
2.  **Fairness Audits**: Regularly testing our model against fairness metrics to identify and correct for demographic disparities.
3.  **Transparency**: Openly discussing our methods and performance, as seen in our Transparency section.

Building truly fair AI is an ongoing journey, not a destination. We are committed to this challenge.
        `,
        image: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop",
        tags: ["AI Ethics", "Fairness", "Technology"]
    },
    {
        id: 3,
        title: "Case Study: Analyzing the Skyscraper Project News Coverage",
        author: "Priya Singh",
        date: "2024-06-05",
        summary: "We used Biasbuster to analyze our 'Try an Example' text. The results reveal how multiple bias types can work together to create a powerful, one-sided narrative.",
        content: `
### The Original Text

Our example text about the 'controversial new skyscraper project' is a perfect miniature case study. Let's break down the findings.

> A recent city council meeting to discuss the controversial new skyscraper project descended into chaos. Proponents, backed by powerful corporations, argued that the project is a beacon of progress that will bring much-needed jobs. However, a small group of hysterical residents, clearly resistant to any change, claimed it would destroy the neighborhood's character. One council member, who is known for his radical ideas, made an unsubstantiated claim that the tower would cause massive traffic problems, a classic fear-mongering tactic. It's obvious to any reasonable person that this development is a win for the city.

### Biasbuster's Findings

1.  **Loaded Language**: Words like "chaos," "hysterical," and "fear-mongering" are used to evoke emotion rather than present a neutral account.
2.  **Stereotyping**: "Hysterical residents, clearly resistant to any change" paints a picture of a group of people as irrational and anti-progress, a common stereotype.
3.  **Spin**: The phrase "It's obvious to any reasonable person" is a classic spin technique used to dismiss dissent and create a false consensus.
4.  **Unsubstantiated Claim**: The article labels the traffic concern as an "unsubstantiated claim" without providing any evidence to prove or disprove it.

This example shows how different biases can be layered into a short text to strongly favor one side of an argument.
        `,
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop",
        tags: ["Case Study", "Bias Types", "Education"]
    }
];