import { Utils } from '../scripts/utils.js';
import { ContextMenuManager } from '../scripts/contextMenu.js';
import { ShortcutManager } from '../scripts/shortcuts.js';
import TutorialPage from '../scripts/tutorial.js';
import WelcomePage from '../scripts/welcome.js';

describe('Biasbuster Chrome Extension Tests', () => {
    // Mock chrome API
    global.chrome = {
        storage: {
            local: {
                get: jest.fn(),
                set: jest.fn(),
                remove: jest.fn()
            }
        },
        runtime: {
            getURL: jest.fn(),
            openOptionsPage: jest.fn()
        },
        tabs: {
            create: jest.fn(),
            query: jest.fn(),
            sendMessage: jest.fn()
        },
        contextMenus: {
            create: jest.fn(),
            removeAll: jest.fn(),
            onClicked: { addListener: jest.fn() }
        },
        commands: {
            onCommand: { addListener: jest.fn() }
        },
        notifications: {
            create: jest.fn()
        },
        action: {
            openPopup: jest.fn()
        }
    };

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('Utils Module', () => {
        test('fetchAPI makes correct API calls', async () => {
            global.fetch = jest.fn(() => 
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: 'test' })
                })
            );

            const result = await Utils.fetchAPI('/test');
            expect(fetch).toHaveBeenCalledWith(
                'https://api.biasbuster.com/v1/test',
                expect.any(Object)
            );
            expect(result).toEqual({ data: 'test' });
        });

        test('storage operations work correctly', async () => {
            await Utils.storage.set('test', { value: 'data' });
            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                test: { value: 'data' }
            });

            chrome.storage.local.get.mockImplementation(() => 
                Promise.resolve({ test: { value: 'data' } })
            );
            const result = await Utils.storage.get('test');
            expect(result).toEqual({ value: 'data' });
        });

        test('cache management functions properly', async () => {
            const testData = { value: 'test' };
            await Utils.cache.set('testKey', testData);
            expect(chrome.storage.local.set).toHaveBeenCalled();

            chrome.storage.local.get.mockImplementation(() => 
                Promise.resolve({
                    [Utils.STORAGE_KEYS.CACHE]: {
                        testKey: {
                            value: testData,
                            timestamp: expect.any(Number),
                            ttl: 3600000
                        }
                    }
                })
            );
            const cached = await Utils.cache.get('testKey');
            expect(cached.value).toEqual(testData);
        });
    });

    describe('Context Menu Integration', () => {
        test('creates all menu items correctly', () => {
            ContextMenuManager.init();
            expect(chrome.contextMenus.removeAll).toHaveBeenCalled();
            expect(chrome.contextMenus.create).toHaveBeenCalledTimes(9);
        });

        test('handles text analysis correctly', async () => {
            const manager = new ContextMenuManager();
            await manager.handleBiasTypeAnalysis('gender', 'test text', { id: 1 });
            expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(
                1,
                expect.objectContaining({ action: 'showResults' })
            );
        });
    });

    describe('Keyboard Shortcuts', () => {
        test('registers all shortcuts', () => {
            ShortcutManager.init();
            expect(chrome.commands.onCommand.addListener).toHaveBeenCalled();
        });

        test('handles analyze selection command', async () => {
            const manager = new ShortcutManager();
            chrome.tabs.query.mockImplementation(() => 
                Promise.resolve([{ id: 1 }])
            );
            await manager.handleAnalyzeSelection();
            expect(chrome.tabs.sendMessage).toHaveBeenCalled();
        });
    });

    describe('Tutorial Page', () => {
        let tutorialPage;

        beforeEach(() => {
            document.body.innerHTML = `
                <div class="slide-dots"></div>
                <div id="slide1" class="slide"></div>
                <div id="slide2" class="slide"></div>
                <button id="prevSlide"></button>
                <button id="nextSlide"></button>
            `;
            tutorialPage = new TutorialPage();
        });

        test('initializes with correct number of slides', () => {
            expect(document.querySelectorAll('.dot').length).toBe(2);
        });

        test('navigation works correctly', () => {
            tutorialPage.navigateSlide(1);
            expect(tutorialPage.currentSlide).toBe(1);
            expect(document.querySelector('#slide2').classList).toContain('active');
        });
    });

    describe('Welcome Page', () => {
        let welcomePage;

        beforeEach(() => {
            document.body.innerHTML = `
                <button id="openTutorial"></button>
                <button id="openSettings"></button>
                <button id="openAnalytics"></button>
            `;
            welcomePage = new WelcomePage();
        });

        test('tracks first-time visit', async () => {
            await welcomePage.checkFirstRun();
            expect(chrome.storage.local.get).toHaveBeenCalledWith(
                Utils.STORAGE_KEYS.USER_PREFS
            );
        });

        test('opens correct pages on button clicks', () => {
            document.getElementById('openTutorial').click();
            expect(chrome.tabs.create).toHaveBeenCalledWith(
                expect.objectContaining({ url: expect.stringContaining('tutorial.html') })
            );
        });
    });

    describe('Error Handling', () => {
        test('handles API errors gracefully', async () => {
            global.fetch = jest.fn(() => 
                Promise.reject(new Error('Network error'))
            );

            await expect(Utils.fetchAPI('/test')).rejects.toThrow('Network error');
        });

        test('handles storage errors', async () => {
            chrome.storage.local.set.mockImplementation(() => 
                Promise.reject(new Error('Storage error'))
            );

            await expect(Utils.storage.set('test', {})).resolves.toBe(false);
        });
    });

    describe('Performance', () => {
        test('caches API responses correctly', async () => {
            const testData = { result: 'test' };
            global.fetch = jest.fn(() => 
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(testData)
                })
            );

            // First call should hit the API
            await Utils.fetchAPI('/test');
            expect(fetch).toHaveBeenCalledTimes(1);

            // Second call with same parameters should use cache
            chrome.storage.local.get.mockImplementation(() => 
                Promise.resolve({
                    [Utils.STORAGE_KEYS.CACHE]: {
                        '/test': {
                            value: testData,
                            timestamp: Date.now(),
                            ttl: 3600000
                        }
                    }
                })
            );
            await Utils.fetchAPI('/test');
            expect(fetch).toHaveBeenCalledTimes(1); // Should not increase
        });
    });

    describe('Data Persistence', () => {
        test('saves and retrieves user preferences', async () => {
            const prefs = {
                biasTypes: { gender: true, racial: true },
                sensitivity: 0.7
            };

            await Utils.storage.set(Utils.STORAGE_KEYS.SETTINGS, prefs);
            expect(chrome.storage.local.set).toHaveBeenCalledWith({
                [Utils.STORAGE_KEYS.SETTINGS]: prefs
            });

            chrome.storage.local.get.mockImplementation(() => 
                Promise.resolve({ [Utils.STORAGE_KEYS.SETTINGS]: prefs })
            );
            const saved = await Utils.storage.get(Utils.STORAGE_KEYS.SETTINGS);
            expect(saved).toEqual(prefs);
        });
    });
});
