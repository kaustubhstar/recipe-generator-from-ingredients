/* Recipe Generator — offline, rule-based recipe builder. No API or external service. */
"use strict";

const $ = (id) => document.getElementById(id);
const input = $("ingredientsInput");
const form = $("ingredientForm");
const error = $("errorMessage");
const results = $("resultsSection");
const grid = $("recipeGrid");
const summary = $("resultsSummary");

const PANTRY = ["oil", "water", "salt", "black pepper", "turmeric", "chilli powder", "cumin", "coriander powder"];
const VEGETABLES = new Set(`
 potato potatoes aloo onion onions pyaz tomato tomatoes tamatar carrot carrots gajar spinach palak peas pea matar green-peas capsicum bell-pepper shimla-mirch cabbage patta-gobhi cauliflower gobhi broccoli beans bean french-beans green-beans corn sweetcorn mushroom mushrooms brinjal baingan eggplant zucchini courgette pumpkin kaddu sweet-potato shakarkandi okra bhindi ladyfinger beetroot beetroot radish mooli cucumber kakdi bottle-gourd lauki opo-squash ridge-gourd turai sponge-gourd tori bitter-gourd karela snake-gourd parwal pointed-gourd ivy-gourd tinda ash-gourd winter-melon celery lettuce kale fenugreek methi mustard-greens sarson spring-onion scallion leek garlic ginger green-chilli chilli jalapeno turnip shalgam yam arbi colocasia taro drumstick moringa raw-banana plantain banana-flower banana-stem jackfruit raw-jackfruit avocado asparagus artichoke brussels-sprouts pak-choi bok-choy swiss-chard collard-greens fennel fennel-bulb kohlrabi knol-khol celery-root celeriac parsley coriander cilantro dill basil mint sweet-potato leaves amaranth chaulai colocasia-leaves patra cluster-beans guar broad-beans lima-beans edamame snow-peas snap-peas water-chestnut lotus-root bamboo-shoots hearts-of-palm
`.trim().split(/\s+/));
const PROTEINS = new Set(`egg eggs paneer tofu chicken fish prawns prawn shrimp mutton lamb beef pork chickpeas chana chole kidney-beans rajma black-beans lentils dal moong masoor urad soy-chunks soya-chunks`.split(/\s+/));
const GRAINS = new Set(`rice brown-rice bread pasta noodles oats quinoa poha flattened-rice flour atta roti chapati tortilla semolina suji vermicelli couscous millet ragi jowar bajra`.split(/\s+/));
const FRUITS = new Set(`apple banana mango pineapple orange berries strawberry papaya pear grapes avocado watermelon melon guava pomegranate kiwi peach plum`.split(/\s+/));
const ALIASES = {
  "bell pepper":"capsicum", "green peas":"peas", "french beans":"beans", "green beans":"beans", "lady finger":"okra", "sweet potato":"sweet-potato", "bottle gourd":"bottle-gourd", "ridge gourd":"ridge-gourd", "bitter gourd":"bitter-gourd", "snake gourd":"snake-gourd", "cluster beans":"cluster-beans", "spring onion":"spring-onion", "bok choy":"bok-choy", "raw banana":"raw-banana", "raw jackfruit":"raw-jackfruit", "sweet corn":"sweetcorn", "black pepper":"black-pepper", "chilli powder":"chilli-powder", "coriander powder":"coriander-powder"
};

function normalize(value) {
  let s = value.toLowerCase().trim().replace(/[’']/g, "").replace(/\s+/g, " ");
  s = s.replace(/^(some|a few|few|fresh|chopped|boiled|raw|frozen)\s+/, "");
  return ALIASES[s] || s.replace(/[ _]+/g, "-");
}
function parseIngredients(raw) {
  const parts = raw.split(/[,;\n]+/).map(s => s.trim().replace(/\s+/g, " ")).filter(Boolean);
  const seen = new Set();
  return parts.filter(item => {
    const key = normalize(item);
    if (!key || seen.has(key)) return false;
    seen.add(key); return true;
  });
}
function classify(item) {
  const key = normalize(item);
  if (VEGETABLES.has(key)) return "vegetable";
  if (PROTEINS.has(key)) return "protein";
  if (GRAINS.has(key)) return "grain";
  if (FRUITS.has(key)) return "fruit";
  // Unknown ingredients are still retained and cooked as flexible add-ins.
  return "other";
}
function nice(s) { return s.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase()); }
function unique(items) { return [...new Set(items)]; }
function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}
function buildRecipes(items) {
  const groups = { vegetable: [], protein: [], grain: [], fruit: [], other: [] };
  items.forEach(item => groups[classify(item)].push(item));
  const veg = groups.vegetable, proteins = groups.protein, grains = groups.grain;
  const fruits = groups.fruit, other = groups.other;
  const allSavory = [...veg, ...proteins, ...grains, ...other];
  const base = allSavory.length ? allSavory : fruits;
  const firstVeg = veg[0] || items[0];
  const proteinNote = proteins.length ? ` Cook ${proteins.join(", ")} completely and safely.` : "";
  const recipes = [];

  recipes.push({
    title: veg.length ? `${nice(firstVeg)} Quick Stir-Fry` : `${nice(items[0])} Quick Pan Toss`,
    emoji: "🍳", time: "15–25 minutes", description: "A quick pan-cooked dish using the ingredients you entered.",
    ingredients: unique([...base, ...PANTRY]),
    steps: [
      `Wash and prepare ${items.join(", ")}. Cut firm vegetables into small, similar-sized pieces.`,
      "Heat a little oil in a pan if available. Add firm vegetables first and stir for a few minutes.",
      "Add softer vegetables and the remaining listed ingredients. Add a splash of water if the pan becomes dry.",
      `Cook until vegetables are tender and all ingredients are safely cooked.${proteinNote}`,
      "Season with any of the optional pantry items listed. Serve hot."
    ], tip: "Add delicate leafy greens near the end so they do not overcook."
  });

  recipes.push({
    title: veg.length ? `Homestyle ${nice(firstVeg)} Curry` : `Simple ${nice(items[0])} One-Pot Dish`,
    emoji: "🥘", time: "20–35 minutes", description: "A simple simmered dish. Adjust the water to make it thick or soupy.",
    ingredients: unique([...base, ...PANTRY]),
    steps: [
      `Wash and chop ${items.join(", ")}.`,
      "Put the firm vegetables and a little water in a pot. Add oil if available.",
      "Cover and simmer, stirring occasionally. Add softer vegetables and other ingredients according to how quickly they cook.",
      `Continue until everything is tender and safely cooked.${proteinNote}`,
      "Add optional salt, turmeric, cumin, chilli powder or coriander powder. Serve warm."
    ], tip: "Use less water for a dry sabzi and more water for a curry."
  });

  if (grains.length) {
    const grain = grains[0];
    recipes.push({
      title: `${nice(grain)} & Vegetable Bowl`, emoji: "🥣", time: "20–35 minutes",
      description: "A filling bowl combining your grain with your available vegetables and add-ins.",
      ingredients: unique([grain, ...veg, ...proteins, ...other, ...PANTRY]),
      steps: [
        `Cook ${grain} using its packet instructions or your usual method.`,
        `Wash and chop ${[...veg, ...proteins, ...other].join(", ") || items.join(", ")}.`,
        "Cook the vegetables in a pan with a little oil or water, adding firm vegetables before softer ones.",
        `Add the remaining listed ingredients and cook safely.${proteinNote}`,
        `Serve the cooked mixture over ${grain}. Season with optional pantry spices.`
      ], tip: "Cook rice and other grains fully before serving. Refrigerate leftovers promptly."
    });
  } else if (fruits.length && !veg.length && !proteins.length) {
    recipes.push({
      title: "Fresh Fruit Bowl", emoji: "🍓", time: "5–10 minutes", description: "A no-cook bowl made from the fruits you listed.",
      ingredients: fruits, steps: [
        `Wash ${fruits.join(", ")} under clean running water.`,
        "Peel or remove seeds where needed, then cut into bite-sized pieces.",
        "Mix gently in a clean bowl and serve immediately."
      ], tip: "Keep cut fruit chilled if it will not be eaten straight away."
    });
  } else {
    recipes.push({
      title: veg.length ? `Steamed ${nice(firstVeg)} Medley` : `Easy ${nice(items[0])} Pot`,
      emoji: "🍲", time: "15–30 minutes", description: "A gentle steam-and-simmer method that works with many vegetables.",
      ingredients: unique([...base, ...PANTRY]),
      steps: [
        `Prepare ${items.join(", ")} by washing, peeling and cutting as needed.`,
        "Add the firmest vegetables to a covered pan with a small amount of water.",
        "Add softer vegetables and other ingredients later. Steam or simmer until tender.",
        `Check that every ingredient is cooked safely.${proteinNote}`,
        "Season with optional pantry spices and serve."
      ], tip: "Different vegetables cook at different speeds; check each one before serving."
    });
  }

  // A distinct third idea for vegetable-only inputs; otherwise create a simple variation.
  if (veg.length && !grains.length) {
    recipes.push({
      title: `Mixed Vegetable ${proteins.length ? "& Protein " : ""}Skillet`, emoji: "🥗", time: "20–30 minutes",
      description: "A second pan method with a different cooking order for mixed vegetables.",
      ingredients: unique([...veg, ...proteins, ...other, ...PANTRY]),
      steps: [
        `Cut ${[...veg, ...proteins, ...other].join(", ")} into bite-sized pieces.`,
        "Start with dense vegetables such as potato, carrot, pumpkin or cauliflower; add a splash of water and cover briefly.",
        "Add softer vegetables such as spinach, tomato, mushroom or zucchini later.",
        `Add remaining ingredients and cook until tender and safe to eat.${proteinNote}`,
        "Finish with optional salt, pepper, cumin or chilli powder."
      ], tip: "This is a flexible cooking method, not a tested recipe for every possible combination."
    });
  } else if (fruits.length) {
    recipes.push({
      title: "Fresh Fruit Side Bowl", emoji: "🍎", time: "5–10 minutes", description: "A fresh side idea using the fruit you entered.",
      ingredients: fruits, steps: [
        `Wash ${fruits.join(", ")} well.`,
        "Peel and remove stones or seeds where needed.",
        "Cut into pieces, combine in a bowl and serve fresh."
      ], tip: "Do not mix raw meat, fish or eggs into a fresh fruit bowl."
    });
  } else {
    recipes.push({
      title: `Easy ${nice(items[0])} Home-Style Variation`, emoji: "🍽️", time: "15–30 minutes",
      description: "A simple alternative using the same ingredients in a different order.",
      ingredients: unique([...base, ...PANTRY]),
      steps: [
        `Prepare ${items.join(", ")} into suitable pieces.`,
        "Begin cooking the ingredients that need the longest time, using a pan or pot.",
        "Add quick-cooking ingredients later and stir gently.",
        `Cook everything thoroughly and safely.${proteinNote}`,
        "Season with optional pantry spices and serve hot."
      ], tip: "Follow package instructions for packaged foods and grains."
    });
  }
  return recipes.slice(0, 3);
}
function renderRecipe(recipe, index) {
  const card = el("article", "recipe-card");
  const top = el("div", "recipe-top");
  top.append(el("span", "recipe-emoji", recipe.emoji), el("span", "recipe-number", `RECIPE 0${index + 1}`));
  card.append(top, el("h3", "", recipe.title), el("p", "recipe-description", recipe.description));
  const meta = el("div", "recipe-meta");
  meta.append(el("span", "meta-pill", `⏱ ${recipe.time}`), el("span", "meta-pill", "Made from your list"));
  card.append(meta, el("h4", "", "Ingredients"));
  const ul = el("ul");
  recipe.ingredients.forEach(item => ul.append(el("li", "", item)));
  card.append(ul, el("h4", "", "Steps"));
  const ol = el("ol");
  recipe.steps.forEach(step => ol.append(el("li", "", step)));
  card.append(ol, el("p", "cook-tip", `💡 ${recipe.tip}`));
  return card;
}

if (!form || !input || !grid || !results || !error || !summary) {
  console.error("Recipe Generator: required page elements are missing. Check index.html IDs.");
} else {
  form.addEventListener("submit", event => {
    event.preventDefault();
    const items = parseIngredients(input.value);
    error.hidden = true;
    if (!items.length) {
      error.textContent = "Please enter at least one ingredient.";
      error.hidden = false; input.focus(); return;
    }
    if (items.length > 50) {
      error.textContent = "Please enter 50 ingredients or fewer at a time.";
      error.hidden = false; input.focus(); return;
    }
    try {
      const recipes = buildRecipes(items);
      grid.replaceChildren(...recipes.map(renderRecipe));
      summary.textContent = `Your ingredients: ${items.join(", ")}. Optional pantry items are shown separately; use only the ones you have.`;
      results.hidden = false;
      results.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      console.error(err);
      error.textContent = "Sorry, recipes could not be generated. Please check your ingredient list and try again.";
      error.hidden = false;
    }
  });
  document.querySelectorAll(".example-chip").forEach(button => button.addEventListener("click", () => {
    input.value = button.dataset.value || ""; input.focus();
  }));
  $("clearButton")?.addEventListener("click", () => {
    input.value = ""; error.hidden = true; results.hidden = true; grid.replaceChildren(); input.focus();
  });
  $("printButton")?.addEventListener("click", () => window.print());
}
