// Mock FMCG functional beverage catalog for the SIBE 2026 prototype.
// Academic mapping:
// [CO] Structured attributes externalize product cognition into comparable data points.
// [DF] Twenty similar products intentionally create choice complexity in the control shelf.
// [ED] Flavor and benefit labels provide lightweight affective hooks without prizes.
// [PR] Tags and scores let the phygital layer translate package scanning into guided meaning.
export const preferences = [
  { id: "energy", label: "Energy" },
  { id: "lowSugar", label: "Low Sugar" },
  { id: "focus", label: "Focus" },
  { id: "taste", label: "Taste" }
];

export const products = [
  {
    id: "sibe-001",
    name: "Volt Citrus",
    flavor: "Lemon lime",
    sugar: "8g",
    caffeine: "95mg",
    calories: 70,
    benefit: "Fast daytime lift",
    tags: ["energy", "citrus", "sparkling"],
    scoreByPreference: { energy: 96, lowSugar: 62, focus: 72, taste: 82 }
  },
  {
    id: "sibe-002",
    name: "Clear Mind Tea",
    flavor: "Peach green tea",
    sugar: "3g",
    caffeine: "55mg",
    calories: 35,
    benefit: "Calm focus",
    tags: ["focus", "lowSugar", "tea"],
    scoreByPreference: { energy: 68, lowSugar: 90, focus: 94, taste: 78 }
  },
  {
    id: "sibe-003",
    name: "Berry Zero Boost",
    flavor: "Mixed berry",
    sugar: "0g",
    caffeine: "80mg",
    calories: 10,
    benefit: "Sugar-free boost",
    tags: ["energy", "lowSugar", "berry"],
    scoreByPreference: { energy: 89, lowSugar: 98, focus: 76, taste: 74 }
  },
  {
    id: "sibe-004",
    name: "Mango Flow",
    flavor: "Mango passionfruit",
    sugar: "12g",
    caffeine: "45mg",
    calories: 95,
    benefit: "Smooth afternoon refresh",
    tags: ["taste", "tropical", "still"],
    scoreByPreference: { energy: 54, lowSugar: 40, focus: 60, taste: 96 }
  },
  {
    id: "sibe-005",
    name: "Focus Fizz",
    flavor: "Yuzu mint",
    sugar: "4g",
    caffeine: "70mg",
    calories: 45,
    benefit: "Light concentration support",
    tags: ["focus", "lowSugar", "sparkling"],
    scoreByPreference: { energy: 72, lowSugar: 86, focus: 91, taste: 84 }
  },
  {
    id: "sibe-006",
    name: "Protein Splash",
    flavor: "Vanilla berry",
    sugar: "7g",
    caffeine: "0mg",
    calories: 120,
    benefit: "Post-workout recovery",
    tags: ["recovery", "protein", "taste"],
    scoreByPreference: { energy: 38, lowSugar: 60, focus: 34, taste: 79 }
  },
  {
    id: "sibe-007",
    name: "Matcha Rise",
    flavor: "Matcha oat",
    sugar: "6g",
    caffeine: "65mg",
    calories: 110,
    benefit: "Steady morning energy",
    tags: ["energy", "focus", "tea"],
    scoreByPreference: { energy: 80, lowSugar: 66, focus: 88, taste: 70 }
  },
  {
    id: "sibe-008",
    name: "Hydra Lychee",
    flavor: "Lychee aloe",
    sugar: "5g",
    caffeine: "0mg",
    calories: 55,
    benefit: "Hydration refresh",
    tags: ["taste", "hydration", "lowSugar"],
    scoreByPreference: { energy: 30, lowSugar: 82, focus: 42, taste: 90 }
  },
  {
    id: "sibe-009",
    name: "Cocoa Charge",
    flavor: "Dark cocoa",
    sugar: "10g",
    caffeine: "90mg",
    calories: 130,
    benefit: "Rich energy treat",
    tags: ["energy", "taste", "coffee"],
    scoreByPreference: { energy: 87, lowSugar: 42, focus: 67, taste: 88 }
  },
  {
    id: "sibe-010",
    name: "Ginger Spark",
    flavor: "Ginger lemon",
    sugar: "5g",
    caffeine: "35mg",
    calories: 50,
    benefit: "Bright digestive refresh",
    tags: ["taste", "lowSugar", "sparkling"],
    scoreByPreference: { energy: 58, lowSugar: 78, focus: 56, taste: 85 }
  },
  {
    id: "sibe-011",
    name: "Night Reset",
    flavor: "Blueberry lavender",
    sugar: "4g",
    caffeine: "0mg",
    calories: 40,
    benefit: "Evening decompression",
    tags: ["lowSugar", "calm", "taste"],
    scoreByPreference: { energy: 18, lowSugar: 88, focus: 48, taste: 76 }
  },
  {
    id: "sibe-012",
    name: "Lime Electro",
    flavor: "Key lime",
    sugar: "2g",
    caffeine: "20mg",
    calories: 25,
    benefit: "Electrolyte hydration",
    tags: ["lowSugar", "hydration", "citrus"],
    scoreByPreference: { energy: 50, lowSugar: 94, focus: 52, taste: 80 }
  },
  {
    id: "sibe-013",
    name: "Cold Brew Snap",
    flavor: "Coffee cola",
    sugar: "9g",
    caffeine: "120mg",
    calories: 85,
    benefit: "High-caffeine alertness",
    tags: ["energy", "focus", "coffee"],
    scoreByPreference: { energy: 99, lowSugar: 55, focus: 84, taste: 72 }
  },
  {
    id: "sibe-014",
    name: "Kiwi Clarity",
    flavor: "Kiwi cucumber",
    sugar: "3g",
    caffeine: "50mg",
    calories: 30,
    benefit: "Clean focus",
    tags: ["focus", "lowSugar", "fresh"],
    scoreByPreference: { energy: 64, lowSugar: 92, focus: 89, taste: 81 }
  },
  {
    id: "sibe-015",
    name: "Orange Immunity",
    flavor: "Blood orange",
    sugar: "11g",
    caffeine: "25mg",
    calories: 90,
    benefit: "Vitamin C support",
    tags: ["taste", "vitamin", "citrus"],
    scoreByPreference: { energy: 48, lowSugar: 45, focus: 46, taste: 91 }
  },
  {
    id: "sibe-016",
    name: "Mint Awake",
    flavor: "Peppermint lime",
    sugar: "1g",
    caffeine: "75mg",
    calories: 15,
    benefit: "Crisp alertness",
    tags: ["energy", "focus", "lowSugar"],
    scoreByPreference: { energy: 91, lowSugar: 97, focus: 86, taste: 73 }
  },
  {
    id: "sibe-017",
    name: "Tropical BCAA",
    flavor: "Pineapple coconut",
    sugar: "6g",
    caffeine: "0mg",
    calories: 65,
    benefit: "Workout amino support",
    tags: ["recovery", "taste", "tropical"],
    scoreByPreference: { energy: 36, lowSugar: 72, focus: 35, taste: 87 }
  },
  {
    id: "sibe-018",
    name: "Apple Focus",
    flavor: "Green apple",
    sugar: "4g",
    caffeine: "60mg",
    calories: 45,
    benefit: "Balanced study support",
    tags: ["focus", "lowSugar", "fruit"],
    scoreByPreference: { energy: 70, lowSugar: 84, focus: 93, taste: 83 }
  },
  {
    id: "sibe-019",
    name: "Grape Sprint",
    flavor: "Concord grape",
    sugar: "13g",
    caffeine: "100mg",
    calories: 115,
    benefit: "Bold energy hit",
    tags: ["energy", "taste", "bold"],
    scoreByPreference: { energy: 94, lowSugar: 35, focus: 70, taste: 89 }
  },
  {
    id: "sibe-020",
    name: "Rose Calm",
    flavor: "Strawberry rose",
    sugar: "5g",
    caffeine: "15mg",
    calories: 50,
    benefit: "Light sensory refresh",
    tags: ["taste", "lowSugar", "calm"],
    scoreByPreference: { energy: 42, lowSugar: 80, focus: 58, taste: 92 }
  }
];

export function getBestProduct(preference) {
  return [...products].sort(
    (a, b) => b.scoreByPreference[preference] - a.scoreByPreference[preference]
  )[0];
}
