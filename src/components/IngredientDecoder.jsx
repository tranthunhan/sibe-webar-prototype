import { useState } from "react";

// Non-medical plain-language descriptions for common skincare actives.
const INGREDIENT_INFO = {
  "niacinamide": "helps with oil balance and uneven tone",
  "hyaluronic acid": "helps skin feel hydrated",
  "ceramides": "supports the skin barrier",
  "salicylic acid": "helps with texture and clogged pores",
  "bha": "helps with texture and clogged pores",
  "vitamin c": "supports a brighter-looking complexion",
  "vitamin c derivative": "supports a brighter-looking complexion",
  "zinc oxide": "mineral UV filter"
};

export default function IngredientDecoder({ ingredients }) {
  const [open, setOpen] = useState(false);

  const decoded = ingredients
    .map((ing) => ({ name: ing, info: INGREDIENT_INFO[ing.toLowerCase()] }))
    .filter((item) => item.info);

  if (decoded.length === 0) return null;

  return (
    <div className="ingredient-decoder">
      <button
        className="ghost-button decoder-toggle"
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {open ? "Hide ingredient guide" : "What's in this?"}
      </button>
      {open && (
        <div className="decoder-panel">
          <ul className="decoder-list">
            {decoded.map(({ name, info }) => (
              <li key={name}>
                <strong>{name}</strong> — {info}
              </li>
            ))}
          </ul>
          <p className="decoder-disclaimer">
            General skincare guidance only. Patch test and check ingredients if your skin is
            reactive.
          </p>
        </div>
      )}
    </div>
  );
}
