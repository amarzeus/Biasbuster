# Biasbuster Workflow Flowchart

This document visualizes the workflow and architecture of the Biasbuster system.

## Core System Architecture

```mermaid
graph TD
    subgraph "Front-End Interfaces"
        A[Chrome Extension] --> C
        B[Web Platform] --> C
    end
    
    subgraph "MCP Server"
        C[API Gateway] --> D[Request Handler]
        D --> E[Content Analyzer]
        E --> F[AI Service Selection]
        F --> G1[Groq AI]
        F --> G2[Anthropic AI]
        F --> G3[OpenAI]
        F --> G4[Mock AI]
        G1 --> H
        G2 --> H
        G3 --> H
        G4 --> H
        H[Response Processor] --> I[Bias Analysis Result]
    end
    
    I --> J[Front-End Visualization]
    J --> K[User Feedback]
    
    style A fill:#ff9900,stroke:#333,stroke-width:2px
    style B fill:#3498db,stroke:#333,stroke-width:2px
    style C fill:#2ecc71,stroke:#333,stroke-width:2px
    style F fill:#9b59b6,stroke:#333,stroke-width:2px
    style I fill:#e74c3c,stroke:#333,stroke-width:2px
```

## User Workflow

```mermaid
sequenceDiagram
    participant User
    participant Extension as Chrome Extension
    participant Web as Web Platform
    participant MCP as MCP Server
    participant AI as AI Service

    alt Using Chrome Extension
        User->>Extension: Browse news article
        Extension->>Extension: Detect article content
        Extension->>MCP: Send article text for analysis
        MCP->>AI: Forward to optimal AI model
        AI->>MCP: Return structured bias analysis
        MCP->>Extension: Return bias results
        Extension->>User: Display highlighted bias with explanations
    else Using Web Platform
        User->>Web: Paste article text
        User->>Web: Click "Analyze"
        Web->>MCP: Send article text for analysis
        MCP->>AI: Forward to optimal AI model
        AI->>MCP: Return structured bias analysis
        MCP->>Web: Return bias results
        Web->>User: Display bias analysis dashboard
    end
    
    User->>User: Make informed reading decision
```

## AI Model Selection Process

```mermaid
flowchart TD
    A[Article Text Received] --> B{Content Length?}
    B -->|Short| C[Standard Model Selection]
    B -->|Long| D[Large Context Model Selection]
    
    C --> E{Features Required?}
    D --> E
    
    E -->|Basic Analysis| F[Lightweight Model]
    E -->|Advanced Analysis| G[Full-Featured Model]
    
    F --> H{API Keys Available?}
    G --> H
    
    H -->|Yes| I[Use Selected External AI]
    H -->|No| J[Fallback to Mock AI]
    
    I --> K[Process AI Response]
    J --> K
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style K fill:#bbf,stroke:#333,stroke-width:2px
```

## Bias Detection Process

```mermaid
flowchart TD
    A[Raw Article Text] --> B[Text Preprocessing]
    B --> C[Language Detection]
    C --> D[AI Prompt Construction]
    D --> E[Send to AI Service]
    E --> F[Parse AI Response]
    
    F --> G{Bias Detected?}
    G -->|Yes| H[Extract Bias Instances]
    G -->|No| I[No Bias Found]
    
    H --> J[Severity Classification]
    H --> K[Bias Type Categorization]
    H --> L[Generate Rewrites]
    
    J --> M[Create Bias Report]
    K --> M
    L --> M
    I --> M
    
    M --> N[Return Structured Analysis]
    
    style A fill:#f5f5f5,stroke:#333,stroke-width:2px
    style E fill:#ffe6cc,stroke:#333,stroke-width:2px
    style G fill:#d5e8d4,stroke:#333,stroke-width:2px
    style N fill:#dae8fc,stroke:#333,stroke-width:2px
```

## Chrome Extension Architecture

```mermaid
flowchart TD
    A[Extension Icon Clicked] --> B{Page Contains Article?}
    B -->|Yes| C[Extract Article Text]
    B -->|No| D[Show Error Message]
    
    C --> E[Send to MCP Server]
    E --> F[Receive Analysis]
    
    F --> G[Create DOM Overlay]
    G --> H[Highlight Biased Text]
    H --> I[Add Interactive Tooltips]
    
    I --> J[Create Summary Panel]
    J --> K[User Clicks Highlight]
    K --> L[Show Detailed Explanation]
    
    style A fill:#ff9900,stroke:#333,stroke-width:2px
    style E fill:#3498db,stroke:#333,stroke-width:2px
    style F fill:#2ecc71,stroke:#333,stroke-width:2px
    style H fill:#e74c3c,stroke:#333,stroke-width:2px
```

## Web Platform Interface Flow

```mermaid
flowchart TD
    A[User Visits Web Platform] --> B[View Demo Page]
    B --> C[Input Article Text]
    C --> D[Submit for Analysis]
    
    D --> E[Show Loading Indicator]
    E --> F[Receive Analysis Results]
    
    F --> G[Display Bias Summary]
    F --> H[Show Bias Visualization]
    F --> I[Show Detailed Analysis]
    F --> J[Show Educational Resources]
    
    H --> K[Interactive Heat Map]
    I --> L[Bias Instances List]
    J --> M[Trusted Sources]
    
    style A fill:#f5f5f5,stroke:#333,stroke-width:2px
    style D fill:#dae8fc,stroke:#333,stroke-width:2px
    style F fill:#d5e8d4,stroke:#333,stroke-width:2px
    style K fill:#ffe6cc,stroke:#333,stroke-width:2px
```

## Multi-Model AI Integration

```mermaid
flowchart TD
    A[Content Analysis Request] --> B{Content Type?}
    B -->|News Article| C[News Analysis Mode]
    B -->|Opinion Piece| D[Opinion Analysis Mode]
    B -->|Social Media| E[Social Media Analysis Mode]
    
    C --> F{Content Length?}
    D --> F
    E --> F
    
    F -->|< 4K tokens| G[Groq Llama3-8B]
    F -->|4K-8K tokens| H[Groq Llama3-70B]
    F -->|8K-100K tokens| I[Anthropic Claude]
    F -->|> 100K tokens| J[Chunking Processor]
    
    G --> K[Process Response]
    H --> K
    I --> K
    J --> K
    
    style A fill:#f5f5f5,stroke:#333,stroke-width:2px
    style B fill:#dae8fc,stroke:#333,stroke-width:2px
    style K fill:#d5e8d4,stroke:#333,stroke-width:2px
```

## Data Flow Architecture

```mermaid
flowchart LR
    subgraph User
        A[Chrome Extension]
        B[Web Platform]
    end
    
    subgraph MCP
        C[API Gateway]
        D[Bias Analyzer]
        E[Model Selector]
        F[Response Formatter]
    end
    
    subgraph AI
        G[Groq]
        H[Anthropic]
        I[OpenAI]
        J[Mock Service]
    end
    
    A --> C
    B --> C
    C --> D
    D --> E
    E --> G
    E --> H
    E --> I
    E --> J
    G --> F
    H --> F
    I --> F
    J --> F
    F --> A
    F --> B
    
    style A fill:#ffcc99,stroke:#333,stroke-width:2px
    style B fill:#99ccff,stroke:#333,stroke-width:2px
    style C fill:#99ff99,stroke:#333,stroke-width:2px
    style F fill:#ff9999,stroke:#333,stroke-width:2px
``` 