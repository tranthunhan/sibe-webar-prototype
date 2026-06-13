import { formatLabel } from "../lib/recommender.js";

const rows = [
  { label: "Category", getValue: (product) => formatLabel(product.category) },
  { label: "Skin type fit", getValue: (product) => product.skinTypes.map(formatLabel).join(", ") },
  { label: "Concerns", getValue: (product) => product.concerns.map(formatLabel).join(", ") },
  { label: "Texture", getValue: (product) => formatLabel(product.texture) },
  { label: "Budget", getValue: (product) => `${formatLabel(product.budget)} · ${product.price}` },
  { label: "Key ingredients", getValue: (product) => product.ingredients.join(", ") },
  { label: "Best for", getValue: (product) => product.bestFor },
  { label: "Avoid if", getValue: (product) => product.avoidIf },
  { label: "Rating", getValue: (product) => `${product.rating.toFixed(1)} / 5` }
];

export default function CompareDrawer({ products, onRemove }) {
  return (
    <section className="compare-panel" aria-label="Side-by-side comparison">
      <div className="section-heading">
        <span className="eyebrow">Compare up to 3</span>
        <h2>Side-by-side comparison</h2>
      </div>

      {products.length === 0 ? (
        <p className="empty-state">Tap Compare on any product card to build your comparison table.</p>
      ) : (
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col">Detail</th>
                {products.map((product) => (
                  <th scope="col" key={product.id}>
                    <img src={`${import.meta.env.BASE_URL}${product.image}`} alt="" />
                    <span>{product.name}</span>
                    <button type="button" onClick={() => onRemove(product.id)}>
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {products.map((product) => (
                    <td key={product.id}>{row.getValue(product)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
