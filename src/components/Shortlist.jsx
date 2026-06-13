import { formatLabel } from "../lib/recommender.js";

export default function Shortlist({ products, onChoose, onRemove }) {
  return (
    <section className="shortlist-panel" aria-label="Saved products">
      <div className="section-heading">
        <span className="eyebrow">Shortlist</span>
        <h2>Saved products</h2>
      </div>

      {products.length === 0 ? (
        <p className="empty-state">Save products as you browse. They stay on this device for later.</p>
      ) : (
        <div className="shortlist-grid">
          {products.map((product) => (
            <article className="shortlist-item" key={product.id}>
              <img
                src={`${import.meta.env.BASE_URL}${product.image}`}
                alt={`${product.name} product packshot`}
              />
              <div>
                <strong>{product.name}</strong>
                <span>
                  {formatLabel(product.category)} · {product.price}
                </span>
              </div>
              <button className="text-button" type="button" onClick={() => onChoose(product)}>
                Choose
              </button>
              <button className="ghost-button" type="button" onClick={() => onRemove(product.id)}>
                Remove
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
