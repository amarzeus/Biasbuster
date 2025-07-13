# Biasbuster

![Biasbuster](./public/favicon.svg)

Biasbuster is a gold-standard, AI-powered platform and Chrome extension for real-time, explainable bias detection and education. With a stunning, accessible website and seamless extension integration, Biasbuster empowers users to spot, understand, and mitigate bias in news and AI-generated content.

---

## ✨ Key Features

-   **🤖 AI-Powered Analysis**: Uses the Google Gemini API to detect 6 types of bias (Framing, Omission, Spin, etc.).
-   **📝 Explainable Insights**: Provides clear explanations and unbiased suggestions for each finding.
-   **🌐 Chrome Extension**: Analyze text on any webpage with a seamless, integrated popup UI.
-   **🎨 Customizable Experience**: Users can set custom keywords and highlight colors.
-   **📊 Analytics Dashboard**: Personalized, locally-stored stats on your analysis history.
-   **🎓 Education Hub**: Learn about bias types and test your knowledge with an interactive quiz.
-   **♿ Accessibility First**: WCAG 2.1 AA compliant, with features like high-contrast mode, resizable text, and full keyboard navigation.
-   ** TRANSPARENT**: Public-facing dashboards on model fairness and performance.

---

## 🚀 Tech Stack

-   **Frontend**: React, TypeScript, TailwindCSS
-   **Build Tool**: Vite
-   **AI**: Google Gemini API (`gemini-2.5-flash`)
-   **CI/CD**: GitHub Actions

---

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18 or newer recommended)
-   npm (or yarn/pnpm)
-   A Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/biasbuster.git
    cd biasbuster
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up your environment variables:**
    -   Create a new file named `.env` in the root of the project by copying the example:
        ```sh
        cp .env.example .env
        ```
    -   Add your Google Gemini API key to this new `.env` file:
        ```
        API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```

### Running the Development Server

To start the local development server with hot-reloading:

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view the application in your browser.

---

## 🔧 Building for Production

To create an optimized production build of the web application:

```sh
npm run build
```

The output will be in the `dist` directory. You can preview the production build locally with:

```sh
npm run preview
```

### Loading the Chrome Extension

The Chrome Extension is designed to be self-contained within the `extension/` directory and does not require a separate build step in its current form. To install it for development:

1.  Open Google Chrome and navigate to `chrome://extensions`.
2.  Enable "Developer mode" in the top right corner.
3.  Click "Load unpacked".
4.  Select the `extension` folder from this project's directory.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

Amar - [@amarmahakal](https://www.linkedin.com/in/amarmahakal/) - amarmahakal92@gmail.com

Project Link: [https://github.com/your-username/biasbuster](https://github.com/your-username/biasbuster)
