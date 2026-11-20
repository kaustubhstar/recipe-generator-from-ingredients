# Project Report: Recipe Generator from Ingredients

## Objective
To build a simple website that accepts vegetables and other ingredients supplied by a user and displays three practical cooking ideas without requiring an API key or external AI service.

## Technology
- HTML5 for page structure
- CSS3 for responsive styling
- Vanilla JavaScript for input parsing, ingredient grouping, recipe rules and dynamic rendering
- GitHub Pages for static hosting

## Working
1. The user enters ingredients separated by commas, semicolons or new lines.
2. JavaScript trims spaces, removes duplicate entries and normalizes common names/aliases.
3. A built-in ingredient dictionary recognizes many vegetables, fruits, proteins and grains. Unknown names are retained as flexible ingredients instead of being rejected.
4. Rule-based logic creates three cooking suggestions and displays ingredients, estimated time, steps and tips.
5. The user can clear the form or print the recipes.

## Testing checklist
- Empty input shows a helpful validation message.
- Duplicate ingredients are removed.
- Comma, semicolon and newline separators are accepted.
- Common Indian vegetable names and international names are recognized.
- Unknown ingredient names are retained in recipe suggestions.
- Three recipe cards are rendered for valid input.
- Clear and print controls are connected.
- The website uses relative local files and requires no API key or backend.

## Limitations
The project is a rule-based educational prototype, not a trained machine-learning model and not an exhaustive recipe database. It cannot promise a tested or delicious recipe for every possible combination. Time estimates vary with quantity, equipment and ingredient size. Users must check allergies and food safety and ensure animal products are thoroughly cooked.
