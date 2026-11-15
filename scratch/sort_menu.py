import json

with open('data/menu.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'export const MENU = '
idx = text.find(prefix)
json_str = text[idx + len(prefix):].rstrip().rstrip(';')
menu = json.loads(json_str)

# Categorize
by_cat = {c['cat']: c for c in menu}

# Sort items within each category by price ascending (stable sort preserves priority on ties)
# Custom tie-break preferences for most likely items:
popularity_rank = {
    # Beverages & Drinks
    'Mineral Water': 1,
    'Cold Drinks': 2,
    'Biscuit': 3,
    'Tea': 4,
    'Coffee': 5,
    'Milk': 6,
    'Fresh Lime Water (Sweet/Salted)': 7,
    'Fresh Lime Soda (Sweet/Salted)': 8,
    'Cold Coffee': 9,
    'Lemon Ice Tea': 10,
    'American Ice Tea': 11,
    # Sandwich / Toast
    'Bread Butter': 1,
    'Veg. S/W': 2,
    'Cheese S/W': 3,
    # Burger
    'Classic OG Burger': 1,
    'Mexican King Burger': 2,
    'Royal Paneer Grilled Burger': 3,
    # Pizza
    'Margherita Pizza': 1,
    'Veg Exotica Pizza': 2,
    'The Xplod Pizza': 3,
    'Four Cheese Pizza': 4,
    'Paneer BBQ Pizza': 5,
    # Fries
    'Crispy Fries': 1,
    'Italian Fries': 2,
    # Momo
    'Steam Momo': 1,
    'Fried Momo': 2,
    'Cheese Melting Gravy Momo': 3,
    # Milkshake
    'Cold Coffee': 1,
    'Strawberry Shake': 2,
    'Oreo Chocolate Shake': 3,
    'Kitkat Chocolate Shake': 4,
    # Bread
    'Plain / Bt. Chapati': 1,
    'Plain / Bt. Tandoori Roti': 2,
    'Plain / Bt. Lachha Paratha': 3,
    'Plain / Bt. Naan': 4,
    # Dal
    'Dal Fry': 1,
    'Dal Tadka': 2,
    'Dal Lasaniya': 3,
    'Dal Makhana': 4,
    # Rice
    'Plain Rice': 1,
    'Jeera Rice': 2,
    'Veg. Pulav': 3,
    'Veg. Biryani': 4,
    # Papad
    'Roasted Papad': 1,
    'Fry Papad': 2,
    'Fried Masala Papad': 3,
    'Cheese Masala Papad': 4,
    # Desserts
    'Gulab Jamun (2 Piece)': 1,
    'Gulab Jamun With Ice Cream': 2,
    'Vanilla With Chocolate Sauce': 3,
}

for c in menu:
    c['items'].sort(key=lambda it: (it[2], popularity_rank.get(it[0], 50)))

# Define desired category order per section (cheapest / most popular first)
breakfast_order = [
    'Beverages & Drinks',  # Water (20), Cold drinks (40), Tea (60)
    'Sandwich / Toast'     # Bread Butter (90), Veg S/W (120)
]

fastfood_order = [
    'Burger',              # starts at 69 (Classic OG Burger)
    'Garlic Bread',        # starts at 89
    'Momo',                # starts at 89
    'Fries',               # starts at 99
    'Mojito',              # starts at 99
    'Ice Tea',             # starts at 99
    'Milkshake',           # starts at 99
    'Pizza',               # starts at 109 (Margherita Pizza)
    'Wraps / Frankie',     # starts at 129
    'Sandwich',            # starts at 139
    'Pasta'                # starts at 169
]

main_order = [
    'Papad / Fries',             # starts at 30
    'Soups',                     # starts at 150
    'Indian Bread',              # starts at 30
    'Raita / Salad',             # starts at 30/60
    'Varieties of Rice',         # starts at 120
    'Varieties of Dal',          # starts at 190
    'Starter / Chinese',         # starts at 230
    'Fresh Veg Tadka',           # starts at 230
    'Kathiyawadi',               # starts at 50/230
    'Varieties of Kofta / Aloo', # starts at 200
    'Paneer Ka Zayka',           # starts at 270
    'Varieties of Kaju',         # starts at 330
    'Ice Cream & Desserts'       # starts at 40
]

sorted_menu = []
for name in breakfast_order:
    if name in by_cat:
        sorted_menu.append(by_cat[name])

for name in fastfood_order:
    if name in by_cat:
        sorted_menu.append(by_cat[name])

for name in main_order:
    if name in by_cat:
        sorted_menu.append(by_cat[name])

output = """// Hotel Monark Digital Menu - Breakfast, Fast Food & Main Course

export const BREAKFAST_CATEGORIES = new Set([
  "Beverages & Drinks",
  "Sandwich / Toast"
]);

export const FAST_FOOD_CATEGORIES = new Set([
  "Burger",
  "Garlic Bread",
  "Momo",
  "Fries",
  "Mojito",
  "Ice Tea",
  "Milkshake",
  "Pizza",
  "Wraps / Frankie",
  "Sandwich",
  "Pasta"
]);

export const MENU = """ + json.dumps(sorted_menu, indent=2) + ";\n"

with open('data/menu.js', 'w', encoding='utf-8') as f:
    f.write(output)

print(f"Updated data/menu.js: {len(sorted_menu)} categories sorted by price and popularity.")
