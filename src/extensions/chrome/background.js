// Background Service Worker for Biasbuster Extension

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    switch (request.type) {
        case 'TEXT_SELECTED':
            const analysisResult = await analyzeText(request.text);
            sendAnalysisToContent(sender.tab.id, analysisResult);
            break;
        case 'ANALYZE_TEXT':
            const pageAnalysis = await analyzeText(request.text);
            sendAnalysisToContent(sender.tab.id, pageAnalysis);
            break;
        default:
            console.warn('Unknown message type:', request.type);
    }
    sendResponse({ success: true });
    return true;
});

async function analyzeText(text) {
    try {
        const response = await fetch('https://api.biasbuster.com/v1/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                biasTypes: ['gender', 'racial', 'political', 'cultural']
            })
        });
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Analysis failed:', error);
        return { error: error.message };
    }
}

function sendAnalysisToContent(tabId, analysisResult) {
    if (chrome.tabs && tabId) {
        chrome.tabs.sendMessage(tabId, {
            type: 'SHOW_RESULTS',
            results: analysisResult
        });
    }
}
