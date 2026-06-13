import { preferences } from "../data/products.js";

// Academic mapping:
// [CO] Preference chips offload comparison by translating goals into product scoring.
// [DF] Four simple filters reduce a twenty-product set to a manageable recommendation path.
// [ED] Tactile chip states create a small sense of agency without random rewards.
// [PR] The filter is the bridge from physical package scan to digital product guidance.
export default function FilterPanel({ selectedPreference, onOpen, onSelect }) {
  return (
    <section className="filter-panel" aria-label="Preference filter">
      <button className="filter-panel__summary" type="button" onClick={onOpen}>
        <span>
          <small>Preference filter</small>
          <strong>{preferences.find((item) => item.id === selectedPreference)?.label}</strong>
        </span>
        <span aria-hidden="true">Adjust</span>
      </button>

      <div className="preference-grid">
        {preferences.map((preference) => (
          <button
            className={`chip ${selectedPreference === preference.id ? "is-active" : ""}`}
            key={preference.id}
            type="button"
            onClick={() => onSelect(preference.id)}
          >
            {preference.label}
          </button>
        ))}
      </div>
    </section>
  );
}
