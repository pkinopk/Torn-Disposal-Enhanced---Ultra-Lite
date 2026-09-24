# Torn Disposal Enhanced - Ultra Lite

A heavily optimized, zero-dependency userscript for Torn City's Disposal crime. This script calculates the safest disposal method using the Wilson Lower Bound algorithm based on historical success rates and highlights the best choice.

## Features
* **Zero Overhead:** No API calls, no profitability calculations, and no complex gradient percentiles. 
* **Single Clear Indicator:** Identifies the statistically safest disposal method for each item and highlights it with a clean green border.
* **Instant Processing:** Pre-calculates scores on load and utilizes a lightweight `MutationObserver` to instantly highlight options as Torn's React UI renders.

## Installation
1. Install a userscript manager extension for your browser (e.g., [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)).
2. Click on the `script.js` file in this repository.
3. Click the **"Raw"** button in the top right corner.
4. Your userscript manager will prompt you to install or update the script. Click **Install**.

## How it Works
The script evaluates hardcoded community data consisting of success rates and sample sizes for every disposal method. It uses the Wilson Lower Bound formula to confidently rank methods even when sample sizes vary wildly, guaranteeing the highlighted method is mathematically the safest option.
