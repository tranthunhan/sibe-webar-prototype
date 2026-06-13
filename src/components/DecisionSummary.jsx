// Academic mapping:
// [CO] A summary panel consolidates the final choice and observed interaction count.
// [DF] One explicit final-choice action prevents ambiguous end states.
// [ED] The selected product is framed positively without chance-based reward language.
// [PR] The same final measure works for both shelf and WebAR conditions.
export default function DecisionSummary({
  product,
  condition,
  preference,
  interactionCount,
  elapsedMs,
  onFinalChoice
}) {
  return (
    <aside className="decision-summary" aria-label="Decision summary">
      <div>
        <p className="eyebrow">Decision summary</p>
        <h2>{product ? product.name : "No product selected"}</h2>
        <p>
          {product
            ? `${product.flavor} - ${product.benefit}`
            : "Select one product when you are ready."}
        </p>
      </div>

      <dl>
        <div>
          <dt>Condition</dt>
          <dd>{condition}</dd>
        </div>
        <div>
          <dt>Preference</dt>
          <dd>{condition === "phygital" ? preference : "not used"}</dd>
        </div>
        <div>
          <dt>Interactions</dt>
          <dd>{interactionCount}</dd>
        </div>
        <div>
          <dt>Decision time</dt>
          <dd>{Math.round(elapsedMs / 1000)}s</dd>
        </div>
      </dl>

      <button className="primary-action" type="button" disabled={!product} onClick={onFinalChoice}>
        Confirm final choice
      </button>
    </aside>
  );
}
