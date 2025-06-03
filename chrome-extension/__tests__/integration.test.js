import { Utils } from '../scripts/utils.js';
import { ContextMenuManager } from '../scripts/contextMenu.js';
import { ShortcutManager } from '../scripts/shortcuts.js';

describe('Biasbuster Integration Tests', () => {
    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = '';
        // Clear all mocks
        jest.clearAllMocks();
    });

    describe('Text Analysis Flow', () => {
        test('complete analysis flow from selection to results', async () => {
            // Setup test data
            const testText = 'This is a test text for bias analysis';
            const testResults = {
                biasScore: 0.45,
                biasTypes: {
                    gender: 'low',
                    racial: 'none',
                    political: 'medium'
                },
                suggestions: ['Consider rephrasing...']
            };

            // Mock API response
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(testResults)
                })
            );

            // Simulate text selection
            const selection = TestUtils.simulateTextSelection(testText);
            expect(selection.toString()).toBe(testText);

            // Trigger context menu analysis
            await TestUtils.simulateContextMenuClick(
                { menuItemId: 'analyzeBias', selectionText: testText },
                { id: 1 }
            );

            // Verify API call
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/analyze'),
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining(testText)
                })
            );

            // Verify results message sent to content script
            expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(
                1,
                expect.objectContaining({
                    action: 'showResults',
                    data: testResults
                })
            );
        });
    });

    describe('Analytics Dashboard Integration', () => {
        test('loads and displays analytics data correctly', async () => {
            // Setup test analytics data
            const testData = {
                totalAnalyses: 100,
                biasesDetected: 45,
                avgBiasScore: 0.35
            };

            // Mock storage data
            TestUtils.mockStorageData({
                [Utils.STORAGE_KEYS.ANALYTICS]: testData
            });

            // Create analytics dashboard elements
            document.body.innerHTML = `
                <div id="totalAnalyses"></div>
                <div id="biasesDetected"></div>
                <div id="avgBiasScore"></div>
            `;

            // Load analytics data
            await Utils.storage.get(Utils.STORAGE_KEYS.ANALYTICS);

            // Verify data loaded from storage
            expect(chrome.storage.local.get).toHaveBeenCalledWith(
                Utils.STORAGE_KEYS.ANALYTICS
            );
        });
    });

    describe('Settings Synchronization', () => {
        test('settings changes are properly saved and applied', async () => {
            // Setup test settings
            const testSettings = {
                biasTypes: {
                    gender: true,
                    racial: true,
                    political: false
                },
                sensitivity: 0.7
            };

            // Save settings
            await Utils.storage.set(Utils.STORAGE_KEYS.SETTINGS, testSettings);

            // Verify settings saved to storage
            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [Utils.STORAGE_KEYS.SETTINGS]: testSettings
            });

            // Mock storage get response
            TestUtils.mockStorageData({
                [Utils.STORAGE_KEYS.SETTINGS]: testSettings
            });

            // Load settings
            const savedSettings = await Utils.storage.get(Utils.STORAGE_KEYS.SETTINGS);

            // Verify loaded settings match saved settings
            expect(savedSettings).toEqual(testSettings);
        });
    });

    describe('Keyboard Shortcuts Integration', () => {
        test('keyboard shortcuts trigger correct actions', async () => {
            // Setup test environment
            chrome.tabs.query.mockImplementation(() =>
                Promise.resolve([{ id: 1, active: true }])
            );

            // Simulate keyboard shortcut for analysis
            await TestUtils.simulateKeyboardShortcut('analyze_selection');

            // Verify message sent to content script
            expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(
                1,
                expect.objectContaining({ action: 'getSelection' })
            );

            // Simulate keyboard shortcut for analytics
            await TestUtils.simulateKeyboardShortcut('toggle_analytics');

            // Verify analytics page opened
            expect(chrome.tabs.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: expect.stringContaining('analytics.html')
                })
            );
        });
    });

    describe('Error Handling Integration', () => {
        test('handles API errors gracefully', async () => {
            // Mock API error
            global.fetch = jest.fn(() =>
                Promise.reject(new Error('Network error'))
            );

            // Attempt analysis
            try {
                await Utils.fetchAPI('/analyze');
            } catch (error) {
                expect(error.message).toBe('Network error');
            }

            // Verify error notification
            expect(chrome.notifications.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'basic',
                    title: expect.stringContaining('Error'),
                    message: expect.stringContaining('error')
                })
            );
        });
    });

    describe('Cache Management Integration', () => {
        test('caches and retrieves data correctly', async () => {
            const testData = { result: 'test data' };
            const cacheKey = 'test-key';

            // Cache data
            await Utils.cache.set(cacheKey, testData);

            // Verify data cached in storage
            expect(chrome.storage.local.set).toHaveBeenCalledWith(
                expect.objectContaining({
                    [Utils.STORAGE_KEYS.CACHE]: expect.objectContaining({
                        [cacheKey]: expect.objectContaining({
                            value: testData
                        })
                    })
                })
            );

            // Mock cached data retrieval
            TestUtils.mockStorageData({
                [Utils.STORAGE_KEYS.CACHE]: {
                    [cacheKey]: {
                        value: testData,
                        timestamp: Date.now(),
                        ttl: 3600000
                    }
                }
            });

            // Retrieve cached data
            const cachedData = await Utils.cache.get(cacheKey);

            // Verify retrieved data matches original
            expect(cachedData.value).toEqual(testData);
        });
    });
});
