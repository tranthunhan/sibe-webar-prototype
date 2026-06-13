export default function BrowsingShelf({ products, onChoose }) {
  return (
    <section className="browsing-shelf" aria-label="Product shelf">
      <div className="browsing-shelf__header">
        <h2>Our skincare range</h2>
        <p>Find the product that works best for you.</p>
      </div>
      <div className="shelf-grid">
        {products.map((product) => (
          <article key={product.id} className="shelf-card">
            <div className="shelf-card__media">
              <img
                src={`${import.meta.env.BASE_URL}${product.image}`}
                alt={`${product.name} product packshot`}
              />
            </div>
            <div className="shelf-card__body">
              <p className="eyebrow">{product.category}</p>
              <h3>{product.name}</h3>
              <p className="shelf-card__desc">{product.description}</p>
              <div className="shelf-card__meta">
                <span className="shelf-card__price">{product.price}</span>
                <span className="shelf-card__rating">★ {product.rating.toFixed(1)}</span>
              </div>
              <button
                className="primary-button shelf-card__cta"
                type="button"
                onClick={() => onChoose(product)}
              >
                Choose
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
