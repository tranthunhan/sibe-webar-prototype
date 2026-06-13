import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({
  matches,
  comparedIds,
  shortlistIds,
  onCompare,
  onShortlist,
  onChoose
}) {
  return (
    <section className="product-section" aria-label="Product comparison options">
      <div className="section-heading">
        <span className="eyebrow">Product comparison</span>
        <h2>Compare realistic shelf options.</h2>
        <p>Choose up to three products to view side by side.</p>
      </div>

      <div className="product-grid">
        {matches.map((match) => {
          const isCompared = comparedIds.includes(match.product.id);
          return (
            <ProductCard
              compareDisabled={!isCompared && comparedIds.length >= 3}
              isCompared={isCompared}
              isShortlisted={shortlistIds.includes(match.product.id)}
              key={match.product.id}
              product={match.product}
              score={match.score}
              onChoose={onChoose}
              onCompare={onCompare}
              onShortlist={onShortlist}
            />
          );
        })}
      </div>
    </section>
  );
}
