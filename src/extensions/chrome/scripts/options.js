document.addEventListener('DOMContentLoaded', () => {
    const settings = {
        genderBias: document.getElementById('genderBias'),
        racialBias: document.getElementById('racialBias'),
        politicalBias: document.getElementById('politicalBias'),
        culturalBias: document.getElementById('culturalBias'),
        genderSensitivity: document.getElementById('genderSensitivity'),
        racialSensitivity: document.getElementById('racialSensitivity'),
        politicalSensitivity: document.getElementById('politicalSensitivity'),
        culturalSensitivity: document.getElementById('culturalSensitivity'),
        showInlineSuggestions: document.getElementById('showInlineSuggestions'),
        highlightBiasedText: document.getElementById('highlightBiasedText'),
        highlightColor: document.getElementById('highlightColor'),
        showSidebar: document.getElementById('showSidebar'),
        aiModel: document.getElementById('aiModel'),
        temperature: document.getElementById('temperature'),
        useCache: document.getElementById('useCache'),
        saveButton: document.getElementById('saveSettings'),
        resetButton: document.getElementById('resetSettings'),
        phraseInput: document.getElementById('phraseInput'),
        phraseType: document.getElementById('phraseType'),
        addPhraseButton: document.getElementById('addPhrase'),
        phrasesList: document.getElementById('phrasesList')
    };

    // Load settings from storage
    chrome.storage.sync.get('biasSettings', (data) => {
        if (data.biasSettings) {
            applySettings(data.biasSettings);
        } else {
            applySettings(getDefaultSettings());
        }
    });

    // Save settings
    settings.saveButton.addEventListener('click', () => {
        const newSettings = collectSettings();
        chrome.storage.sync.set({ biasSettings: newSettings }, () => {
            alert('Settings saved successfully!');
        });
    });

    // Reset settings
    settings.resetButton.addEventListener('click', () => {
        const defaultSettings = getDefaultSettings();
        applySettings(defaultSettings);
        chrome.storage.sync.set({ biasSettings: defaultSettings }, () => {
            alert('Settings reset to defaults.');
        });
    });

    // Add custom phrase
    settings.addPhraseButton.addEventListener('click', () => {
        const phrase = settings.phraseInput.value.trim();
        const type = settings.phraseType.value;
        if (phrase) {
            addCustomPhrase(phrase, type);
            settings.phraseInput.value = '';
        }
    });

    // Functions
    function applySettings(settingsData) {
        settings.genderBias.checked = settingsData.biasTypes.gender.enabled;
        settings.racialBias.checked = settingsData.biasTypes.racial.enabled;
        settings.politicalBias.checked = settingsData.biasTypes.political.enabled;
        settings.culturalBias.checked = settingsData.biasTypes.cultural.enabled;

        settings.genderSensitivity.value = settingsData.biasTypes.gender.sensitivity * 100;
        settings.racialSensitivity.value = settingsData.biasTypes.racial.sensitivity * 100;
        settings.politicalSensitivity.value = settingsData.biasTypes.political.sensitivity * 100;
        settings.culturalSensitivity.value = settingsData.biasTypes.cultural.sensitivity * 100;

        settings.showInlineSuggestions.checked = settingsData.display.showInlineSuggestions;
        settings.highlightBiasedText.checked = settingsData.display.highlightBiasedText;
        settings.highlightColor.value = settingsData.display.highlightColor;
        settings.showSidebar.checked = settingsData.display.showSidebar;

        settings.aiModel.value = settingsData.ai.model;
        settings.temperature.value = settingsData.ai.temperature * 100;
        settings.useCache.checked = settingsData.ai.useCache;

        renderCustomPhrases(settingsData.customPhrases);
    }

    function collectSettings() {
        return {
            biasTypes: {
                gender: {
                    enabled: settings.genderBias.checked,
                    sensitivity: settings.genderSensitivity.value / 100
                },
                racial: {
                    enabled: settings.racialBias.checked,
                    sensitivity: settings.racialSensitivity.value / 100
                },
                political: {
                    enabled: settings.politicalBias.checked,
                    sensitivity: settings.politicalSensitivity.value / 100
                },
                cultural: {
                    enabled: settings.culturalBias.checked,
                    sensitivity: settings.culturalSensitivity.value / 100
                }
            },
            display: {
                showInlineSuggestions: settings.showInlineSuggestions.checked,
                highlightBiasedText: settings.highlightBiasedText.checked,
                highlightColor: settings.highlightColor.value,
                showSidebar: settings.showSidebar.checked
            },
            ai: {
                model: settings.aiModel.value,
                temperature: settings.temperature.value / 100,
                useCache: settings.useCache.checked
            },
            customPhrases: getCustomPhrases()
        };
    }

    function getDefaultSettings() {
        return {
            biasTypes: {
                gender: { enabled: true, sensitivity: 0.7 },
                racial: { enabled: true, sensitivity: 0.7 },
                political: { enabled: true, sensitivity: 0.7 },
                cultural: { enabled: true, sensitivity: 0.7 }
            },
            display: {
                showInlineSuggestions: true,
                highlightBiasedText: true,
                highlightColor: '#ff4444',
                showSidebar: true
            },
            ai: {
                model: 'gpt4',
                temperature: 0.7,
                useCache: true
            },
            customPhrases: []
        };
    }

    function renderCustomPhrases(phrases) {
        settings.phrasesList.innerHTML = '';
        phrases.forEach((phrase, index) => {
            const div = document.createElement('div');
            div.className = 'phrase-item';
            div.textContent = `${phrase.text} (${phrase.type})`;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => {
                removeCustomPhrase(index);
            });
            div.appendChild(removeBtn);
            settings.phrasesList.appendChild(div);
        });
    }

    function addCustomPhrase(text, type) {
        const phrases = getCustomPhrases();
        phrases.push({ text, type });
        renderCustomPhrases(phrases);
    }

    function removeCustomPhrase(index) {
        const phrases = getCustomPhrases();
        phrases.splice(index, 1);
        renderCustomPhrases(phrases);
    }

    function getCustomPhrases() {
        const phrases = [];
        settings.phrasesList.querySelectorAll('.phrase-item').forEach(item => {
            const text = item.firstChild.textContent.split(' (')[0];
            const type = item.firstChild.textContent.match(/\(([^)]+)\)/)[1];
            phrases.push({ text, type });
        });
        return phrases;
    }
});
