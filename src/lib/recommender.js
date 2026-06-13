const weights = {
  category: 35,
  skinType: 25,
  concern: 25,
  texture: 10,
  budget: 10
};

function titleCase(value) {
  return value
    .split(/[-\s]/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

// Academic mapping:
// [CO] This guided selector reduces cognitive load by narrowing product comparison.
// [DF] The recommendation flow reduces decision fatigue by limiting the final choice set.
// [ED] The progress bar and match score create emotional delight without prize-based mechanics.
// [PR] The QR-like scenario supports willingness to use digital product guidance.
export function scoreProduct(product, answers) {
  let rawScore = 0;
  const reasons = [];
  const badges = [];

  if (product.category === answers.routineStep) {
    rawScore += weights.category;
    reasons.push(`It fits your ${answers.routineStep} step.`);
    badges.push("Routine fit");
  }

  if (product.skinTypes.includes(answers.skinType)) {
    rawScore += weights.skinType;
    reasons.push(`It is suitable for ${answers.skinType} skin.`);
    badges.push("Skin type match");
  }

  if (product.concerns.includes(answers.concern)) {
    rawScore += weights.concern;
    reasons.push(`It targets ${answers.concern}.`);
    badges.push("Concern match");
  }

  if (product.texture === answers.texture) {
    rawScore += weights.texture;
    reasons.push(`The ${answers.texture} texture matches your preference.`);
    badges.push("Texture match");
  }

  if (product.budget === answers.budget) {
    rawScore += weights.budget;
    reasons.push(`It sits in your ${answers.budget} budget range.`);
    badges.push("Budget match");
  }

  const score = Math.min(100, Math.round((rawScore / 105) * 100));

  return {
    product,
    score,
    reasons:
      reasons.length > 0
        ? reasons
        : ["It is a general option to compare against your selected skin needs."],
    badges,
    ingredientClarity: product.ingredients.length
  };
}

export function getRecommendations(products, answers) {
  return products
    .map((product) => scoreProduct(product, answers))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.product.rating - a.product.rating;
    });
}

export function getRoutineProgress(products) {
  const categories = new Set(products.map((product) => product.category));
  const steps = [
    {
      id: "cleanse",
      label: "Cleanse",
      complete: categories.has("cleanser")
    },
    {
      id: "treat",
      label: "Treat",
      complete: categories.has("toner") || categories.has("serum")
    },
    {
      id: "finish",
      label: "Finish",
      complete: categories.has("moisturiser") || categories.has("sunscreen")
    }
  ];

  const completed = steps.filter((step) => step.complete).length;
  return {
    steps,
    completed,
    percent: Math.round((completed / steps.length) * 100)
  };
}

export function formatLabel(value) {
  return titleCase(value);
}
