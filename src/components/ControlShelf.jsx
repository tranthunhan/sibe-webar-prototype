// Academic mapping:
// [CO] Dense nutrition and benefit labels move product facts onto the shelf interface.
// [DF] Twenty cards with overlapping attributes intentionally model supermarket choice load.
// [ED] Selection highlighting adds mild satisfaction without reward or prize mechanics.
// [PR] This component is the non-AR baseline for comparing phygital receptivity.
export default function ControlShelf({ products, selectedProductId, onInteract, onSelect }) {
  return (
    <section className="control-shelf" aria-label="Traditional product shelf">
      <div className="section-heading">
        <p className="eyebrow">Control condition</p>
        <h2>Functional beverage shelf</h2>
        <p>
          Review dense product information, compare options, and select one final product.
        </p>
      </div>

      <div className="shelf-grid">
        {products.map((product) => {
          const selected = product.id === selectedProductId;
          return (
            <button
              className={`product-card ${selected ? "is-selected" : ""}`}
              key={product.id}
              type="button"
              onClick={() => {
                onInteract(product, "shelf_card");
                onSelect(product);
              }}
            >
              <span className="product-card__badge">{product.tags[0]}</span>
              <strong>{product.name}</strong>
              <span>{product.flavor}</span>
              <dl>
                <div>
                  <dt>Sugar</dt>
                  <dd>{product.sugar}</dd>
                </div>
                <div>
                  <dt>Caffeine</dt>
                  <dd>{product.caffeine}</dd>
                </div>
                <div>
                  <dt>Calories</dt>
                  <dd>{product.calories}</dd>
                </div>
                <div>
                  <dt>Benefit</dt>
                  <dd>{product.benefit}</dd>
                </div>
              </dl>
              <span className="tag-row">{product.tags.join(" / ")}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
