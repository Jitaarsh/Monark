import json
import re

with open('data/menu.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract the JSON array from export const MENU = [...]
prefix = "export const MENU = "
idx = text.find(prefix)
if idx == -1:
    raise ValueError("MENU not found")

json_str = text[idx + len(prefix):].rstrip().rstrip(';')
menu = json.loads(json_str)

breakfast_cats = []
fastfood_cats = []
main_cats = []

for c in menu:
    if c['cat'] in ['Sandwich / Toast', 'Beverages & Drinks']:
        c_copy = dict(c)
        c_copy['section'] = 'breakfast'
        if c['cat'] == 'Sandwich / Toast':
            c_copy['ico'] = '🥪'
        elif c['cat'] == 'Beverages & Drinks':
            c_copy['ico'] = '☕'
        breakfast_cats.append(c_copy)
    elif c.get('section') == 'fastfood':
        fastfood_cats.append(c)
    else:
        main_cats.append(c)

# Sort breakfast: Sandwich / Toast first, then Beverages & Drinks
breakfast_cats.sort(key=lambda x: 0 if x['cat'] == 'Sandwich / Toast' else 1)

new_menu = breakfast_cats + fastfood_cats + main_cats

output = """// Hotel Monark Digital Menu - Breakfast, Fast Food & Main Course

export const BREAKFAST_CATEGORIES = new Set([
  "Sandwich / Toast",
  "Beverages & Drinks"
]);

export const FAST_FOOD_CATEGORIES = new Set([
  "Mojito",
  "Ice Tea",
  "Milkshake",
  "Garlic Bread",
  "Pasta",
  "Sandwich",
  "Momo",
  "Pizza",
  "Wraps / Frankie",
  "Fries",
  "Burger"
]);

export const MENU = """ + json.dumps(new_menu, indent=2) + ";\n"

with open('data/menu.js', 'w', encoding='utf-8') as f:
    f.write(output)

print(f"Updated data/menu.js: {len(new_menu)} categories ({len(breakfast_cats)} breakfast, {len(fastfood_cats)} fast food, {len(main_cats)} main course)")
