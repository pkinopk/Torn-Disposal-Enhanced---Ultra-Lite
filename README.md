# Torn Disposal Enhanced - Ultra Lite

A lightning-fast, lightweight userscript for the Disposal crime in [Torn City](https://www.torn.com/). 

This "Ultra Lite" version strips away API overhead and profitability calculations to focus entirely on one thing: **safety**. By using hardcoded statistical data and the Wilson Lower Bound algorithm, it instantly highlights the safest disposal method without lagging your browser or relying on external requests.

## Features

*   **Zero API Calls:** Completely standalone. No API key required and no network latency.
*   **Statistical Accuracy:** Uses the Wilson Lower Bound algorithm to calculate confidence in success rates based on thousands of recorded attempts.
*   **Color-Coded Options:** Disposal methods are automatically tinted based on safety percentiles:
    *   🟩 **Green:** Safe
    *   🟨 **Yellow:** Moderate / Unsafe
    *   🟧 **Orange:** Risky
    *   🟥 **Red:** Dangerous
*   **Instant Best Choice:** The statistically best option is always highlighted with a glowing green border.

## Installation

1. Install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/) for your browser.
2. Open the `script.user.js` (or whatever you name the script file) in this repository.
3. Click the **Raw** button in the top right corner of the code box.
4. Your userscript manager will automatically detect the script and prompt you to install it. Click **Install**.

## Usage

Simply navigate to the **Crimes -> Disposal** page in Torn. The script runs automatically, processing the option cards as they load and applying the color codes and highlights immediately.

## Disclaimer

This script uses historical data to estimate success rates. While the Wilson Lower Bound provides a statistically conservative estimate, Torn's internal mechanics include RNG (Random Number Generation). A "safe" option can still fail, and this script does not guarantee a 100% success rate.
