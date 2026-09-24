// ==UserScript==
// @name         Torn Disposal Enhanced - Ultra Lite
// @version      1.1.0
// @namespace    enanchedDisposalLite
// @description  Lightning-fast statistical disposal classification using Wilson lower bound. Highlights the single safest method.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/page.php?sid=crimes*
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .disposal-best-option {
            border: 2px solid #1A9850 !important;
            box-shadow: 0 0 8px rgba(26, 152, 80, 0.6) !important;
            border-radius: 50%; /* Ensures the highlight wraps cleanly around the circular buttons */
        }
    `);

    const SUCCESS_RATES = {
        'Biological Waste': {
            'Abandon': { success: 79.37, samples: 504 },
            'Bury': { success: 87.78, samples: 352 },
            'Burn': { success: 72.46, samples: 207 },
            'Sink': { success: 98.35, samples: 1814 }
        },
        'Body Part': {
            'Abandon': { success: 81.54, samples: 623 },
            'Bury': { success: 81.04, samples: 413 },
            'Burn': { success: 88.77, samples: 187 },
            'Sink': { success: 84.62, samples: 104 },
            'Dissolve': { success: 99.35, samples: 919 }
        },
        'Building Debris': {
            'Abandon': { success: 86.40, samples: 3441 },
            'Bury': { success: 70.53, samples: 1181 },
            'Sink': { success: 97.45, samples: 5715 }
        },
        'Dead Body': {
            'Abandon': { success: 79.56, samples: 964 },
            'Bury': { success: 89.02, samples: 164 },
            'Burn': { success: 89.33, samples: 253 },
            'Sink': { success: 78.57, samples: 14 },
            'Dissolve': { success: 98.14, samples: 537 }
        },
        'Documents': {
            'Abandon': { success: 77.53, samples: 632 },
            'Bury': { success: 89.05, samples: 201 },
            'Burn': { success: 98.06, samples: 3138 },
            'Sink': { success: 0, samples: 76 },
            'Dissolve': { success: 0, samples: 25 }
        },
        'Firearm': {
            'Abandon': { success: 78.10, samples: 548 },
            'Bury': { success: 89.87, samples: 671 },
            'Sink': { success: 98.60, samples: 1285 },
            'Dissolve': { success: 0, samples: 25 }
        },
        'General Waste': {
            'Abandon': { success: 86.33, samples: 4622 },
            'Bury': { success: 97.64, samples: 2843 },
            'Burn': { success: 96.97, samples: 3032 },
            'Sink': { success: 71.92, samples: 463 },
            'Dissolve': { success: 0, samples: 89 }
        },
        'Industrial Waste': {
            'Abandon': { success: 75.49, samples: 1118 },
            'Bury': { success: 86.33, samples: 1017 },
            'Sink': { success: 97.48, samples: 3054 }
        },
        'Murder Weapon': {
            'Abandon': { success: 79.07, samples: 259 },
            'Bury': { success: 92.31, samples: 299 },
            'Sink': { success: 98.64, samples: 959 },
            'Dissolve': { success: 0, samples: 26 }
        },
        'Old Furniture': {
            'Abandon': { success: 88.13, samples: 1542 },
            'Bury': { success: 69.11, samples: 764 },
            'Burn': { success: 97.28, samples: 3451 },
            'Sink': { success: 84.36, samples: 390 },
            'Dissolve': { success: 0, samples: 41 }
        },
        'Broken Appliance': {
            'Abandon': { success: 86.58, samples: 1461 },
            'Bury': { success: 75.52, samples: 286 },
            'Sink': { success: 96.98, samples: 4537 },
            'Dissolve': { success: 0, samples: 69 }
        },
        'Vehicle': {
            'Abandon': { success: 86.58, samples: 790 },
            'Burn': { success: 96.88, samples: 865 },
            'Sink': { success: 98.12, samples: 1648 }
        }
    };

    function getWilsonLowerBound(successRate, attempts) {
        if (attempts === 0) return 0;
        const z = 1.96; 
        const p = successRate / 100;
        const denominator = 1 + (z * z) / attempts;
        const centre = p + (z * z) / (2 * attempts);
        const adjustment = z * Math.sqrt((p * (1 - p)) / attempts + (z * z) / (4 * attempts * attempts));
        return ((centre - adjustment) / denominator) * 100;
    }

    const scoreMap = new Map();
    for (const [item, methods] of Object.entries(SUCCESS_RATES)) {
        for (const [method, data] of Object.entries(methods)) {
            scoreMap.set(`${item}|${method}`, getWilsonLowerBound(data.success, data.samples));
        }
    }

    function processDisposalUI() {
        const crimeCards = document.querySelectorAll('[class*="crimeOption___"], .crime-option');
        if (!crimeCards.length) return;

        crimeCards.forEach(card => {
            if (card.dataset.processed) return;
            
            const titleElement = card.querySelector('[class*="crimeOptionSection"], .title');
            if (!titleElement) return;
            
            const itemType = titleElement.textContent.trim();
            if (!SUCCESS_RATES[itemType]) return;

            const buttons = card.querySelectorAll('button[aria-label]');
            if (!buttons.length) return;

            let bestMethod = null;
            let highestScore = -1;

            buttons.forEach(btn => {
                const method = btn.getAttribute('aria-label');
                const score = scoreMap.get(`${itemType}|${method}`);
                if (score !== undefined && score > highestScore) {
                    highestScore = score;
                    bestMethod = btn;
                }
            });

            if (bestMethod) {
                bestMethod.classList.add('disposal-best-option');
            }

            card.dataset.processed = "true";
        });
    }

    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                shouldProcess = true;
                break;
            }
        }
        if (shouldProcess) {
            clearTimeout(window.disposalTimeout);
            window.disposalTimeout = setTimeout(processDisposalUI, 50);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
