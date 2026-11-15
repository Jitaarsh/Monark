// Hotel Monark Digital Menu - Breakfast, Fast Food & Main Course

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

export const MENU = [
  {
    "cat": "Beverages & Drinks",
    "section": "breakfast",
    "ico": "\u2615",
    "note": "@ Serving",
    "items": [
      [
        "Mineral Water",
        "200 ml (On MRP)",
        20,
        1
      ],
      [
        "Biscuit",
        "Per pack (On MRP)",
        30,
        1
      ],
      [
        "Cold Drinks",
        "200 ml (On MRP)",
        40,
        1
      ],
      [
        "Tea",
        "Per cup",
        60,
        1
      ],
      [
        "Coffee",
        "Per cup",
        60,
        1
      ],
      [
        "Milk",
        "Per glass",
        60,
        1
      ],
      [
        "Fresh Lime Water (Sweet/Salted)",
        "200 ml",
        90,
        1,
        [
          "Sweet",
          "Salted"
        ]
      ],
      [
        "Fresh Lime Soda (Sweet/Salted)",
        "200 ml",
        100,
        1,
        [
          "Sweet",
          "Salted"
        ]
      ],
      [
        "Cold Coffee",
        "Per glass",
        130,
        1
      ],
      [
        "Lemon Ice Tea",
        "Per glass",
        130,
        1
      ],
      [
        "American Ice Tea",
        "Per glass",
        130,
        1
      ]
    ]
  },
  {
    "cat": "Sandwich / Toast",
    "section": "breakfast",
    "ico": "\ud83e\udd6a",
    "note": "@ Per Plate",
    "items": [
      [
        "Bread Butter",
        "Per plate",
        90,
        1
      ],
      [
        "Veg. S/W",
        "Per plate",
        120,
        1
      ],
      [
        "Cheese S/W",
        "Per plate",
        140,
        1
      ]
    ]
  },
  {
    "cat": "Burger",
    "section": "fastfood",
    "ico": "\ud83c\udf54",
    "items": [
      [
        "Classic OG Burger",
        "Simple classic veg burger",
        69,
        1
      ],
      [
        "Mexican King Burger",
        "Spiced Mexican style burger",
        99,
        1
      ],
      [
        "Royal Paneer Grilled Burger",
        "Juicy grilled paneer burger",
        149,
        1
      ]
    ]
  },
  {
    "cat": "Garlic Bread",
    "section": "fastfood",
    "ico": "\ud83e\udd56",
    "items": [
      [
        "Cheese Garlic Bread",
        "Classic cheesy garlic bread",
        89,
        1
      ],
      [
        "Supreme Treat Garlic Bread",
        "Loaded garlic bread with toppings",
        99,
        1
      ],
      [
        "Paneer Toofani Garlic Bread",
        "Spicy paneer garlic bread",
        119,
        1
      ]
    ]
  },
  {
    "cat": "Momo",
    "section": "fastfood",
    "ico": "\ud83e\udd5f",
    "items": [
      [
        "Steam Momo",
        "Soft steamed veg momos",
        89,
        1
      ],
      [
        "Fried Momo",
        "Crispy fried veg momos",
        89,
        1
      ],
      [
        "Cheese Melting Gravy Momo",
        "Momos in cheesy gravy sauce",
        159,
        1
      ]
    ]
  },
  {
    "cat": "Fries",
    "section": "fastfood",
    "ico": "\ud83c\udf5f",
    "items": [
      [
        "Crispy Fries",
        "Salted or Peri Peri option",
        99,
        1,
        [
          "Salted",
          "Peri Peri"
        ]
      ],
      [
        "Italian Fries",
        "Herb seasoned Italian fries",
        149,
        1
      ]
    ]
  },
  {
    "cat": "Mojito",
    "section": "fastfood",
    "ico": "\ud83c\udf79",
    "items": [
      [
        "Blue Heaven Mojito",
        "Cool blue mojito with mint",
        99,
        1
      ],
      [
        "Mint Mojito",
        "Fresh mint & lime mojito",
        99,
        1
      ],
      [
        "Surprise Mojito",
        "Chef's surprise mojito blend",
        99,
        1
      ],
      [
        "Peach Mojito",
        "Sweet peachy mojito",
        99,
        1
      ]
    ]
  },
  {
    "cat": "Ice Tea",
    "section": "fastfood",
    "ico": "\ud83e\uddca",
    "items": [
      [
        "Lemon Ice Tea",
        "Chilled lemon infused ice tea",
        99,
        1
      ],
      [
        "American Ice Tea",
        "Classic American style ice tea",
        99,
        1
      ]
    ]
  },
  {
    "cat": "Milkshake",
    "section": "fastfood",
    "ico": "\ud83e\udd64",
    "items": [
      [
        "Cold Coffee",
        "Chilled blended cold coffee",
        99,
        1
      ],
      [
        "Strawberry Shake",
        "Fresh strawberry milkshake",
        99,
        1
      ],
      [
        "Oreo Chocolate Shake",
        "Oreo blended chocolate shake",
        109,
        1
      ],
      [
        "Kitkat Chocolate Shake",
        "Kitkat blended chocolate shake",
        119,
        1
      ]
    ]
  },
  {
    "cat": "Pizza",
    "section": "fastfood",
    "ico": "\ud83c\udf55",
    "items": [
      [
        "Margherita Pizza",
        "Classic tomato & cheese pizza",
        109,
        1
      ],
      [
        "Veg Exotica Pizza",
        "Exotic veg loaded pizza",
        179,
        1
      ],
      [
        "The Xplod Pizza",
        "Chef's special loaded pizza",
        189,
        1
      ],
      [
        "Four Cheese Pizza",
        "Loaded four cheese pizza",
        199,
        1
      ],
      [
        "Paneer BBQ Pizza",
        "Smoky BBQ paneer pizza",
        199,
        1
      ]
    ]
  },
  {
    "cat": "Wraps / Frankie",
    "section": "fastfood",
    "ico": "\ud83c\udf2f",
    "items": [
      [
        "Mexican Salsa Wrap",
        "Spiced Mexican veg wrap",
        129,
        1
      ],
      [
        "Grilled Paneer Wrap",
        "Juicy grilled paneer wrap",
        149,
        1
      ]
    ]
  },
  {
    "cat": "Sandwich",
    "section": "fastfood",
    "ico": "\ud83e\udd6a",
    "note": "@ Per Plate",
    "items": [
      [
        "Veg Mexican Sandwich",
        "Mexican spiced veg sandwich",
        139,
        1
      ],
      [
        "Paneer Maharaja Sandwich",
        "Loaded paneer royal sandwich",
        149,
        1
      ]
    ]
  },
  {
    "cat": "Pasta",
    "section": "fastfood",
    "ico": "\ud83c\udf5d",
    "items": [
      [
        "White Sauce Pasta",
        "Creamy bechamel pasta",
        169,
        1
      ],
      [
        "Red Sauce Pasta",
        "Classic tomato red sauce pasta",
        169,
        1
      ],
      [
        "Peri Peri Pasta",
        "Spicy peri peri pasta \ud83c\udf36\ufe0f",
        169,
        1
      ]
    ]
  },
  {
    "cat": "Papad / Fries",
    "section": "main",
    "ico": "\ud83e\udd68",
    "note": "@ Per Piece",
    "items": [
      [
        "Roasted Papad",
        "Per piece",
        30,
        1
      ],
      [
        "Fry Papad",
        "Per piece",
        40,
        1
      ],
      [
        "Fried Masala Papad",
        "Per piece",
        60,
        1
      ],
      [
        "Cheese Masala Papad",
        "Per piece",
        90,
        1
      ]
    ]
  },
  {
    "cat": "Soups",
    "section": "main",
    "ico": "\ud83c\udf72",
    "note": "@ 200ml",
    "items": [
      [
        "Cream of Tomato Soup",
        "200 ml",
        150,
        1
      ],
      [
        "Veg. Hot & Sour Soup",
        "200 ml",
        150,
        1
      ],
      [
        "Veg. Manchow Soup",
        "200 ml",
        170,
        1
      ],
      [
        "Lemon Coriander Soup",
        "200 ml",
        190,
        1
      ]
    ]
  },
  {
    "cat": "Indian Bread",
    "section": "main",
    "ico": "\ud83e\uded3",
    "note": "@ Per Piece",
    "items": [
      [
        "Plain / Bt. Chapati",
        "Per piece",
        30,
        1,
        [
          "Plain",
          "Butter"
        ]
      ],
      [
        "Plain / Bt. Tandoori Roti",
        "Per piece",
        40,
        1,
        [
          "Plain",
          "Butter"
        ]
      ],
      [
        "Plain / Bt. Lachha Paratha",
        "Per piece",
        90,
        1,
        [
          "Plain",
          "Butter"
        ]
      ],
      [
        "Plain / Bt. Naan",
        "Per piece",
        90,
        1,
        [
          "Plain",
          "Butter"
        ]
      ],
      [
        "Aloo Paratha With Curd",
        "Per piece",
        150,
        1
      ],
      [
        "Cheese Chilly Garlic Naan",
        "Per piece",
        170,
        1
      ],
      [
        "Paneer Paratha With Curd",
        "Per piece",
        210,
        1
      ]
    ]
  },
  {
    "cat": "Raita / Salad",
    "section": "main",
    "ico": "\ud83e\udd57",
    "note": "@ 200gms",
    "items": [
      [
        "Extra Butter",
        "Per serving",
        30,
        1
      ],
      [
        "Extra Cheese",
        "Per serving",
        50,
        1
      ],
      [
        "Tomato Salad",
        "200 gms",
        60,
        1
      ],
      [
        "Curd",
        "200 gms",
        90,
        1
      ],
      [
        "Sweet Curd",
        "200 gms",
        90,
        1
      ],
      [
        "Green Salad",
        "200 gms",
        100,
        1
      ],
      [
        "Kachumber Salad",
        "200 gms",
        100,
        1
      ],
      [
        "Veg. Raita",
        "200 gms",
        120,
        1
      ],
      [
        "Boondi Raita",
        "200 gms",
        120,
        1
      ]
    ]
  },
  {
    "cat": "Varieties of Rice",
    "section": "main",
    "ico": "\ud83c\udf5a",
    "note": "@ 300gms",
    "items": [
      [
        "Plain Rice",
        "300 gms",
        120,
        1
      ],
      [
        "Jeera Rice",
        "300 gms",
        150,
        1
      ],
      [
        "Veg. Pulav",
        "300 gms",
        200,
        1
      ],
      [
        "Veg. Biryani",
        "300 gms",
        210,
        1
      ],
      [
        "Paneer Pulav",
        "300 gms",
        220,
        1
      ],
      [
        "Veg. Hyderabadi Biryani",
        "300 gms",
        220,
        1
      ],
      [
        "Dum Biryani",
        "300 gms",
        220,
        1
      ]
    ]
  },
  {
    "cat": "Varieties of Dal",
    "section": "main",
    "ico": "\ud83c\udf72",
    "note": "@ 300gms",
    "items": [
      [
        "Dal Fry",
        "300 gms",
        190,
        1
      ],
      [
        "Dal Tadka",
        "300 gms",
        210,
        1
      ],
      [
        "Dal Lasaniya",
        "300 gms",
        210,
        1
      ],
      [
        "Dal Makhana",
        "300 gms",
        230,
        1
      ]
    ]
  },
  {
    "cat": "Starter / Chinese",
    "section": "main",
    "ico": "\ud83c\udf62",
    "note": "@ 250-300gms",
    "items": [
      [
        "Veg. Manchurian (Dry/Gravy)",
        "250 gms",
        230,
        1,
        [
          "Dry",
          "Gravy"
        ]
      ],
      [
        "Veg. Hakka Noodles",
        "300 gms",
        230,
        1
      ],
      [
        "Veg. Schezwan Noodles",
        "300 gms",
        270,
        1
      ],
      [
        "Manchurian Noodles",
        "300 gms",
        270,
        1
      ],
      [
        "American Chopsuey",
        "300 gms",
        270,
        1
      ],
      [
        "Veg. 65",
        "250 gms",
        280,
        1
      ],
      [
        "Veg. Lollipop",
        "250 gms",
        280,
        1
      ],
      [
        "Dragon Potato",
        "250 gms",
        280,
        1
      ],
      [
        "Veg. Spring Roll",
        "250 gms",
        280,
        1
      ],
      [
        "Chinese Bhel",
        "300 gms",
        280,
        1
      ],
      [
        "Hara Bhara Kabab",
        "250 gms",
        290,
        1
      ],
      [
        "Veg. Seekh Kabab",
        "250 gms",
        290,
        1
      ],
      [
        "Panner Chilly (Dry/Gravy)",
        "250 gms",
        330,
        1,
        [
          "Dry",
          "Gravy"
        ]
      ],
      [
        "Paneer Tikka Dry",
        "250 gms",
        340,
        1
      ],
      [
        "Paneer Afghani Tikka Dry",
        "250 gms",
        350,
        1
      ],
      [
        "Cheese Corn Ball",
        "250 gms",
        400,
        1
      ]
    ]
  },
  {
    "cat": "Fresh Veg Tadka",
    "section": "main",
    "ico": "\ud83e\udd58",
    "note": "@ 300gms",
    "items": [
      [
        "Sev Tomato",
        "300 gms",
        230,
        1
      ],
      [
        "Sev Masala",
        "300 gms",
        230,
        1
      ],
      [
        "Chana Masala",
        "300 gms",
        230,
        1
      ],
      [
        "Mix Veg.",
        "300 gms",
        230,
        1
      ],
      [
        "Veg. Handi",
        "300 gms",
        280,
        1
      ],
      [
        "Veg. Jaipuri",
        "300 gms",
        280,
        1
      ],
      [
        "Veg. Angara",
        "300 gms",
        300,
        1
      ],
      [
        "Veg. Maharaja",
        "300 gms",
        330,
        1
      ],
      [
        "Veg. Satluj Sp.",
        "300 gms",
        350,
        1
      ]
    ]
  },
  {
    "cat": "Kathiyawadi",
    "section": "main",
    "ico": "\ud83c\udffa",
    "note": "@ 300gms",
    "items": [
      [
        "Bajarino Rotlo",
        "300 gms",
        50,
        1
      ],
      [
        "Bajarino Rotlo (Ghee)",
        "300 gms",
        60,
        1
      ],
      [
        "Sev Tomato (Kathiyawadi)",
        "300 gms",
        230,
        1
      ],
      [
        "Vagharelo Rotlo",
        "300 gms",
        230,
        1
      ],
      [
        "Baingan Bharta",
        "300 gms (Seasonal)",
        260,
        1
      ],
      [
        "Lasaniyo Bataka",
        "300 gms",
        260,
        1
      ],
      [
        "Sev Lasaniya",
        "300 gms",
        260,
        1
      ]
    ]
  },
  {
    "cat": "Varieties of Kofta / Aloo",
    "section": "main",
    "ico": "\ud83e\udd54",
    "note": "@ 300gms",
    "items": [
      [
        "Sukhi Bhaji",
        "300 gms",
        200,
        1
      ],
      [
        "Aloo Gobi Masala",
        "300 gms",
        220,
        1
      ],
      [
        "Veg. Kofta",
        "300 gms",
        230,
        1
      ],
      [
        "Malai Kofta",
        "300 gms",
        260,
        1
      ],
      [
        "Punjabi Dum Aloo",
        "300 gms",
        260,
        1
      ]
    ]
  },
  {
    "cat": "Paneer Ka Zayka",
    "section": "main",
    "ico": "\ud83e\uddc0",
    "note": "@ 300gms",
    "items": [
      [
        "Palak Paneer",
        "300 gms",
        270,
        1
      ],
      [
        "Paneer Lababdar",
        "300 gms",
        290,
        1
      ],
      [
        "Shahi Paneer",
        "300 gms",
        290,
        1
      ],
      [
        "Paneer Butter Masala",
        "300 gms",
        290,
        1
      ],
      [
        "Paneer Tikka Masala",
        "300 gms",
        300,
        1
      ],
      [
        "Paneer Tufani",
        "300 gms",
        300,
        1
      ],
      [
        "Paneer Bhurji",
        "300 gms",
        330,
        1
      ],
      [
        "Paneer Chilly Masala",
        "300 gms",
        330,
        1
      ],
      [
        "Paneer Angara",
        "300 gms",
        340,
        1
      ],
      [
        "Paneer Maharaja",
        "300 gms",
        340,
        1
      ]
    ]
  },
  {
    "cat": "Varieties of Kaju",
    "section": "main",
    "ico": "\ud83e\udd5c",
    "note": "@ 300gms",
    "items": [
      [
        "Kaju Curry",
        "300 gms",
        330,
        1
      ],
      [
        "Kaju Butter Masala",
        "300 gms",
        340,
        1
      ],
      [
        "Kaju Handi",
        "300 gms",
        350,
        1
      ],
      [
        "Kaju Korma",
        "300 gms (Sweet)",
        350,
        1
      ]
    ]
  },
  {
    "cat": "Ice Cream & Desserts",
    "section": "main",
    "ico": "\ud83c\udf68",
    "note": "@ Serving",
    "items": [
      [
        "Gulab Jamun (2 Piece)",
        "Soft sweet gulab jamun",
        40,
        1
      ],
      [
        "Gulab Jamun With Ice Cream",
        "Served with vanilla ice cream",
        80,
        1
      ],
      [
        "Vanilla With Chocolate Sauce",
        "Vanilla scoop with rich sauce",
        90,
        1
      ]
    ]
  }
];
