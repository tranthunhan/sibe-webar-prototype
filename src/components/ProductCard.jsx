import { formatLabel } from "../lib/recommender.js";

export default function ProductCard({
  product,
  score,
  isCompared,
  compareDisabled,
  isShortlisted,
  onCompare,
  onShortlist,
  onChoose
}) {
  return (
    <article className="product-card">
      <div className="product-card__media">
        <img src={`${import.meta.env.BASE_URL}${product.image}`} alt={product.name} />
        <span>{score}% match</span>
      </div>
      <div className="product-card__body">
        <div>
          <p className="eyebrow">{formatLabel(product.category)}</p>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>

        <dl className="product-facts">
          <div>
            <dt>Skin type fit</dt>
            <dd>{product.skinTypes.map(formatLabel).join(", ")}</dd>
          </div>
          <div>
            <dt>Concerns</dt>
            <dd>{product.concerns.map(formatLabel).join(", ")}</dd>
          </div>
          <div>
            <dt>Key ingredients</dt>
            <dd>{product.ingredients.join(", ")}</dd>
          </div>
          <div>
            <dt>Texture</dt>
            <dd>{formatLabel(product.texture)}</dd>
          </div>
          <div>
            <dt>Price tier</dt>
            <dd>
              {formatLabel(product.budget)} · {product.price}
            </dd>
          </div>
          <div>
            <dt>Rating</dt>
            <dd>{product.rating.toFixed(1)} / 5</dd>
          </div>
        </dl>

        <div className="tag-row">
          {product.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="product-actions">
          <button
            className={isCompared ? "secondary-button is-active" : "secondary-button"}
            type="button"
            disabled={compareDisabled}
            onClick={() => onCompare(product.id)}
          >
            {isCompared ? "Remove" : "Compare"}
          </button>
          <button className="ghost-button" type="button" onClick={() => onShortlist(product.id)}>
            {isShortlisted ? "Saved" : "Shortlist"}
          </button>
          <button className="text-button" type="button" onClick={() => onChoose(product)}>
            Choose
          </button>
        </div>
      </div>
    </article>
  );
}
