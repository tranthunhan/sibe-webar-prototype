import { budgets, concerns, routineSteps, skinTypes, textures } from "../data/skincareProducts.js";

const groups = [
  { id: "skinType", label: "Skin type", options: skinTypes },
  { id: "concern", label: "Main concern", options: concerns },
  { id: "texture", label: "Texture preference", options: textures },
  { id: "budget", label: "Budget", options: budgets },
  { id: "routineStep", label: "Routine step", options: routineSteps }
];

export default function SkinQuiz({ answers, onChange }) {
  return (
    <section className="quiz-panel" id="skin-match">
      <div className="section-heading">
        <span className="eyebrow">Skin match</span>
        <h2>Tell GlowGuide what your skin needs today.</h2>
      </div>

      <div className="quiz-grid">
        {groups.map((group) => (
          <fieldset className="option-group" key={group.id}>
            <legend>{group.label}</legend>
            <div className="option-grid">
              {group.options.map((option) => (
                <button
                  className={answers[group.id] === option.id ? "option-chip is-selected" : "option-chip"}
                  key={option.id}
                  type="button"
                  onClick={() => onChange(group.id, option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </section>
  );
}
