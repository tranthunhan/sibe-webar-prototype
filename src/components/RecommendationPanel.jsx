import { formatLabel } from "../lib/recommender.js";

export default function RecommendationPanel({ match, alternatives, answers, onChoose, onShortlist }) {
  if (!match) return null;

  const { product, score, reasons, badges, ingredientClarity } = match;

  return (
    <section className="recommendation-panel" aria-label="Recommended product">
      <div className="match-card">
        <div className="match-card__image">
          <img
            src={`${import.meta.env.BASE_URL}${product.image}`}
            alt={`${product.name} product packshot`}
          />
        </div>
        <div className="match-card__content">
          <span className="eyebrow">Best match</span>
          <h2>{product.name}</h2>
          <p>{product.description}</p>

          <div className="score-row" aria-label={`Skin Match Score ${score} percent`}>
            <span>Skin Match Score</span>
            <strong>{score}%</strong>
          </div>
          <div className="score-track">
            <span style={{ width: `${score}%` }} />
          </div>

          <div className="badge-row" aria-label="Ingredient Clarity Badges">
            {badges.map((badge) => (
              <span className="clarity-badge" key={badge}>
                {badge}
              </span>
            ))}
            <span className="clarity-badge">{ingredientClarity} clear ingredients</span>
          </div>

          <div className="match-actions">
            <button className="primary-button" type="button" onClick={() => onChoose(product)}>
              Choose this product
            </button>
            <button className="ghost-button" type="button" onClick={() => onShortlist(product.id)}>
              Save to shortlist
            </button>
          </div>
        </div>
      </div>

      <div className="recommendation-details">
        <article>
          <h3>Why it matches</h3>
          <ul>
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Best for</h3>
          <p>{product.bestFor}</p>
        </article>
        <article>
          <h3>Avoid if</h3>
          <p>{product.avoidIf}</p>
        </article>
        <article>
          <h3>Key ingredients</h3>
          <p>{product.ingredients.join(", ")}</p>
        </article>
        <article>
          <h3>Routine step</h3>
          <p>{formatLabel(product.category)}</p>
        </article>
        <article>
          <h3>Your filters</h3>
          <p>
            {formatLabel(answers.skinType)} skin, {formatLabel(answers.concern)},{" "}
            {formatLabel(answers.texture)}, {formatLabel(answers.budget)}
          </p>
        </article>
      </div>

      <div className="alternatives">
        <h3>Next best shelf options</h3>
        <div className="alternative-grid">
          {alternatives.map((alternative) => (
            <div className="alternative-card" key={alternative.product.id}>
              <span>{alternative.score}% match</span>
              <strong>{alternative.product.name}</strong>
              <small>{formatLabel(alternative.product.category)}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
