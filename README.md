# Recipe Generator from Ingredients

A simple, responsive recipe suggestion website. Enter vegetables or other ingredients separated by commas or new lines and it creates three cooking ideas in your browser.

## Features
- No API key, AI service, backend, account or database required.
- Works as a static website and can be hosted on GitHub Pages.
- Recognizes many Indian and international vegetable names and common grains/proteins.
- Accepts unfamiliar ingredient names too and keeps them in the generated suggestions.
- Generates three formats: quick pan dish, curry/one-pot dish, and a third suitable variation.
- Example ingredient buttons, clear button and print option.
- Responsive layout for desktop and mobile.

## Run locally
1. Download and extract this project ZIP.
2. Open the `recipe-generator-from-ingredients` folder.
3. Double-click `index.html` to open it in a browser.

You can also use VS Code Live Server, but it is not required.

## Deploy to GitHub Pages
1. Create a public GitHub repository, for example `recipe-generator-from-ingredients`.
2. Upload all five project files to the repository root (not inside an extra nested folder).
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, branch **main**, folder **/(root)**, then Save.
5. Wait for GitHub Pages to publish, then open the URL shown on the Pages settings screen.

## Important limitation
This is a local rule-based recipe helper, not a trained AI model and not a complete cookbook. It can accept unknown ingredient names, but suggestions for unusual combinations are generic cooking methods rather than tested recipes. Cooking times are estimates; use food-safety guidance and cook food thoroughly.
