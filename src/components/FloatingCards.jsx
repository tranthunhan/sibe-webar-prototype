// Academic mapping:
// [CO] Floating cards summarize the highest-value facts so users do not inspect every SKU.
// [DF] Cards sequence information into benefit, fit, and evidence instead of a dense wall.
// [ED] Layered motion and reveal affordances make information feel responsive, not prize-based.
// [PR] The cards simulate product-pack overlays expected in WebAR retail encounters.
export default function FloatingCards({ product, preference, onViewCard }) {
  if (!product) return null;

  const cards = [
    {
      id: "benefit",
      label: "Benefit",
      value: product.benefit
    },
    {
      id: "fit",
      label: "Preference fit",
      value: `${product.scoreByPreference[preference]} / 100`
    },
    {
      id: "profile",
      label: "Profile",
      value: `${product.sugar} sugar - ${product.caffeine} caffeine - ${product.calories} cal`
    }
  ];

  return (
    <div className="floating-cards" aria-label="AR information cards">
      {cards.map((card, index) => (
        <button
          className="floating-card"
          key={card.id}
          style={{ "--delay": `${index * 80}ms` }}
          type="button"
          onClick={() => onViewCard(card)}
        >
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </button>
      ))}
    </div>
  );
}
