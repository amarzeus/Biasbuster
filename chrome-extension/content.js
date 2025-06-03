// Content Script for Biasbuster Extension

// Constants
const HIGHLIGHT_CLASS = 'biasbuster-highlight';
const SIDEBAR_ID = 'biasbuster-sidebar';

// State
let state = {
    enabled: false,
    analyzing: false,
    selectedText: '',
    biasResults: null,
    sidebarVisible: false
};

// Styles
const styles = `
    .${HIGHLIGHT_CLASS} {
        background-color: rgba(255, 68, 68, 0.2);
        cursor: pointer;
        position: relative;
    }

    #${SIDEBAR_ID} {
        position: fixed;
        top: 0;
        right: -400px;
        width: 400px;
        height: 100vh;
        background: white;
        box-shadow: -2px 0 5px rgba(0,0,0,0.2);
        z-index: 10000;
        transition: right 0.3s ease;
    }

    #${SIDEBAR_ID}.visible {
        right: 0;
    }

    .biasbuster-biased {
        color: #ff4444;
        background-color: rgba(255, 68, 68, 0.1);
        padding: 2px 4px;
        border-radius: 2px;
    }
`;

// Initialize
function initialize() {
    injectStyles();
    createSidebar();
    attachEventListeners();
    listenForMessages();
}

// Inject styles
function injectStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

// Create sidebar
function createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = SIDEBAR_ID;
    sidebar.innerHTML = `
        <div class="biasbuster-sidebar-header">
            <h2>Bias Analysis</h2>
            <button id="biasbuster-close">×</button>
        </div>
        <div class="biasbuster-sidebar-content">
            <div class="biasbuster-comparison">
                <div class="biasbuster-original">
                    <h3>Original Text</h3>
                    <div id="biasbuster-original-content"></div>
                </div>
                <div class="biasbuster-analysis">
                    <h3>Analysis</h3>
                    <div id="biasbuster-analysis-content"></div>
                </div>
            </div>
            <div id="biasbuster-suggestions"></div>
        </div>
    `;
    document.body.appendChild(sidebar);
}

// Event Listeners
function attachEventListeners() {
    document.addEventListener('mouseup', handleTextSelection);
    document.getElementById('biasbuster-close')?.addEventListener('click', () => toggleSidebar(false));
}

// Handle text selection
function handleTextSelection() {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text) {
        state.selectedText = text;
        chrome.runtime.sendMessage({
            type: 'TEXT_SELECTED',
            text: text
        });
    }
}

// Toggle sidebar
function toggleSidebar(show = null) {
    const sidebar = document.getElementById(SIDEBAR_ID);
    if (sidebar) {
        state.sidebarVisible = show ?? !state.sidebarVisible;
        sidebar.classList.toggle('visible', state.sidebarVisible);
    }
}

// Message handling
function listenForMessages() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.type) {
            case 'ANALYZE_PAGE':
                handlePageAnalysis();
                break;
            case 'SHOW_RESULTS':
                displayResults(request.results);
                break;
            case 'CLEAR_HIGHLIGHTS':
                clearHighlights();
                break;
        }
        sendResponse({ success: true });
    });
}

// Handle page analysis
function handlePageAnalysis() {
    const textContent = document.body.innerText;
    chrome.runtime.sendMessage({
        type: 'ANALYZE_TEXT',
        text: textContent
    });
}

// Display results
function displayResults(results) {
    clearHighlights();
    results.segments.forEach(segment => {
        if (segment.hasBias) {
            highlightText(segment);
        }
    });
}

// Highlight text
function highlightText(segment) {
    const range = new Range();
    const treeWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
    );

    let node;
    while (node = treeWalker.nextNode()) {
        const index = node.textContent.indexOf(segment.text);
        if (index >= 0) {
            range.setStart(node, index);
            range.setEnd(node, index + segment.text.length);
            
            const highlight = document.createElement('span');
            highlight.className = HIGHLIGHT_CLASS;
            highlight.setAttribute('data-bias-info', JSON.stringify(segment));
            
            range.surroundContents(highlight);
            break;
        }
    }
}

// Clear highlights
function clearHighlights() {
    document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(element => {
        const text = element.textContent;
        element.parentNode.replaceChild(document.createTextNode(text), element);
    });
}

// Initialize
initialize();
