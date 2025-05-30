# Biasbuster Project Flowcharts

This document provides visual representations of the key workflows and architecture within the Biasbuster project.

## System Architecture

```mermaid
graph TD
    User[User/Client] --> |Interacts with| WebPlatform[Web Platform]
    User --> |Installs| ChromeExt[Chrome Extension]
    
    ChromeExt --> |Sends article| APIGateway[API Gateway]
    WebPlatform --> |Sends text| APIGateway
    
    APIGateway --> |Routes requests| BiasAPI[Bias Analysis API]
    
    BiasAPI --> |Processes text| LLM[Large Language Models]
    BiasAPI --> |Validates| Rules[Rules Engine]
    BiasAPI --> |Queries| FactCheck[Fact-checking Services]
    
    LLM --> |Returns analysis| BiasAPI
    Rules --> |Returns validation| BiasAPI
    FactCheck --> |Returns facts| BiasAPI
    
    BiasAPI --> |Sends results| APIGateway
    APIGateway --> |Returns results| WebPlatform
    APIGateway --> |Returns results| ChromeExt
    
    WebPlatform --> |Displays| Results[Analysis Results]
    ChromeExt --> |Displays| Results
    
    style User fill:#f9f,stroke:#333,stroke-width:2px
    style WebPlatform fill:#bbf,stroke:#333,stroke-width:2px
    style ChromeExt fill:#bbf,stroke:#333,stroke-width:2px
    style APIGateway fill:#bfb,stroke:#333,stroke-width:2px
    style BiasAPI fill:#bfb,stroke:#333,stroke-width:2px
    style LLM fill:#fbb,stroke:#333,stroke-width:2px
    style Rules fill:#fbb,stroke:#333,stroke-width:2px
    style FactCheck fill:#fbb,stroke:#333,stroke-width:2px
    style Results fill:#fffaaa,stroke:#333,stroke-width:2px
```

## Bias Detection Workflow

```mermaid
sequenceDiagram
    participant User
    participant UI as Web UI/Extension
    participant API as Biasbuster API
    participant NLP as NLP Processing
    participant DB as Database
    
    User->>UI: Submits article text
    UI->>API: Sends text for analysis
    API->>NLP: Processes text for bias markers
    NLP->>NLP: Analyzes text using ML models
    NLP->>API: Returns bias analysis
    API->>DB: Logs analysis results
    API->>UI: Returns results
    UI->>User: Displays bias analysis results
    UI->>User: Shows visualization & alternative perspectives
```

## Chrome Extension Flow

```mermaid
graph LR
    A[User] -->|Visits news site| B[News Article]
    B -->|Extension activates| C[Extension Icon]
    C -->|User clicks| D[Analysis Panel]
    D -->|Sends article| E[Biasbuster API]
    E -->|Returns analysis| D
    D -->|Shows| F[Bias Highlights]
    D -->|Shows| G[Bias Score]
    D -->|Shows| H[Alternative Sources]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#fffaaa,stroke:#333,stroke-width:2px
    style C fill:#bbf,stroke:#333,stroke-width:2px
    style D fill:#bbf,stroke:#333,stroke-width:2px
    style E fill:#bfb,stroke:#333,stroke-width:2px
    style F fill:#fbb,stroke:#333,stroke-width:2px
    style G fill:#fbb,stroke:#333,stroke-width:2px
    style H fill:#fbb,stroke:#333,stroke-width:2px
```

## AI Literacy Training Module Flow

```mermaid
graph TD
    A[User] -->|Enters| B[AI Literacy Hub]
    B -->|Selects| C[Learning Path]
    
    C -->|Option 1| D[Beginner Track]
    C -->|Option 2| E[Intermediate Track]
    C -->|Option 3| F[Advanced Track]
    
    D -->|Step 1| G[Understanding AI Basics]
    D -->|Step 2| H[Recognizing AI Content]
    D -->|Step 3| I[Interactive Quiz]
    
    E -->|Lessons| J[Detecting Bias in AI]
    E -->|Activities| K[Bias Case Studies]
    
    F -->|Workshops| L[Creating Responsible AI]
    F -->|Projects| M[Build Your Own Detector]
    
    G & H & I & J & K & L & M -->|Completion| N[Digital Certificate]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bbf,stroke:#333,stroke-width:2px
    style D fill:#bfb,stroke:#333,stroke-width:2px
    style E fill:#bfb,stroke:#333,stroke-width:2px
    style F fill:#bfb,stroke:#333,stroke-width:2px
    style G fill:#fbb,stroke:#333,stroke-width:2px
    style H fill:#fbb,stroke:#333,stroke-width:2px
    style I fill:#fbb,stroke:#333,stroke-width:2px
    style J fill:#fbb,stroke:#333,stroke-width:2px
    style K fill:#fbb,stroke:#333,stroke-width:2px
    style L fill:#fbb,stroke:#333,stroke-width:2px
    style M fill:#fbb,stroke:#333,stroke-width:2px
    style N fill:#fffaaa,stroke:#333,stroke-width:2px
```

## Technical Implementation

```mermaid
graph TB
    Frontend[Frontend Layer] --> |API Calls| Backend[Backend Layer]
    Backend --> |Processes| Model[AI Model Layer]
    
    subgraph Frontend Layer
        WebApp[Web Application<br>HTML/CSS/JavaScript]
        ChromeExt[Chrome Extension<br>JavaScript]
        Mobile[Mobile App<br>React Native]
    end
    
    subgraph Backend Layer
        API[RESTful API<br>Node.js/Express]
        Auth[Authentication<br>JWT]
        Database[Database<br>MongoDB]
        Cache[Cache<br>Redis]
    end
    
    subgraph AI Model Layer
        BiasDetection[Bias Detection<br>ML Models]
        NLP[NLP Processing<br>Transformers]
        Scoring[Scoring System<br>Rules Engine]
    end
    
    style Frontend fill:#bbf,stroke:#333,stroke-width:2px
    style Backend fill:#bfb,stroke:#333,stroke-width:2px
    style Model fill:#fbb,stroke:#333,stroke-width:2px
```

These diagrams provide a high-level overview of the Biasbuster system architecture and workflows. For more detailed documentation, please refer to the technical specifications in the project documentation. 