export default function FinalChoice({ choice, comparedProducts, decisionTimeSeconds, onClose }) {
  if (!choice) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="final-modal" aria-modal="true" role="dialog" aria-labelledby="final-choice-title">
        <button className="modal-close" type="button" aria-label="Close final result" onClick={onClose}>
          x
        </button>
        <span className="eyebrow">Your selected product</span>
        <div className="final-summary">
          <img
            src={`${import.meta.env.BASE_URL}${choice.image}`}
            alt={`${choice.name} product packshot`}
          />
          <div>
            <h2 id="final-choice-title">{choice.name}</h2>
            <p>{choice.description}</p>
          </div>
        </div>

        <div className="final-grid">
          <article>
            <h3>Why it fits</h3>
            <p>{choice.bestFor}</p>
          </article>
          <article>
            <h3>How to use</h3>
            <p>{choice.howToUse}</p>
          </article>
          <article>
            <h3>Products compared</h3>
            <p>
              {comparedProducts.length > 0
                ? comparedProducts.map((product) => product.name).join(", ")
                : "No side-by-side products selected."}
            </p>
          </article>
          <article>
            <h3>Decision time</h3>
            <p>{decisionTimeSeconds}s</p>
          </article>
        </div>
      </section>
    </div>
  );
}
