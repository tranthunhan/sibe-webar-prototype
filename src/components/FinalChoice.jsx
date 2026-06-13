import { useState } from "react";
import { logEvent } from "../lib/analytics.js";

const FEEDBACK_QUESTIONS = [
  { id: "confident", text: "I feel confident about this choice." },
  { id: "easy", text: "It was easy to compare the options." },
  { id: "satisfied", text: "I am satisfied with my selected product." }
];

function formatDecisionTime(ms) {
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec} seconds`;
  const min = Math.floor(sec / 60);
  const rem = sec % 60;
  return rem === 0 ? `${min} min` : `${min} min ${rem} sec`;
}

function downloadSessionRecord(refCode) {
  try {
    const events = JSON.parse(localStorage.getItem("gg_events") || "[]");
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `glowguide-session-${refCode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    // download not supported in this environment
  }
}

export default function FinalChoice({
  choice,
  comparedProducts,
  decisionTimeMs,
  refCode,
  onClose
}) {
  const [ratings, setRatings] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!choice) return null;

  const allAnswered = FEEDBACK_QUESTIONS.every((q) => ratings[q.id] != null);

  function handleRate(questionId, value) {
    if (submitted) return;
    setRatings((r) => ({ ...r, [questionId]: value }));
  }

  function handleSubmitFeedback() {
    if (!allAnswered || submitted) return;
    logEvent("feedback_submit", { ratings, ref_code: refCode });
    setSubmitted(true);
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="final-modal"
        aria-modal="true"
        role="dialog"
        aria-labelledby="final-choice-title"
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Close final result"
          onClick={onClose}
        >
          ×
        </button>

        <span className="eyebrow">Your skin match is saved</span>

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
            <h3>Decision time</h3>
            <p>{formatDecisionTime(decisionTimeMs)}</p>
          </article>
          <article>
            <h3>Products compared</h3>
            <p>
              {comparedProducts.length > 0
                ? comparedProducts.map((p) => p.name).join(", ")
                : "No side-by-side comparison."}
            </p>
          </article>
        </div>

        <div className="ref-code-block">
          <div>
            <p className="ref-code-label">Your reference code</p>
            <p className="ref-code-value">{refCode}</p>
          </div>
          <p className="ref-code-hint">
            Keep this code if you are asked to complete a short survey.
          </p>
        </div>

        <div className="feedback-section">
          <h3 className="feedback-heading">Quick feedback</h3>
          {FEEDBACK_QUESTIONS.map((q) => (
            <div key={q.id} className="feedback-question">
              <p>{q.text}</p>
              <div className="feedback-rating" role="group" aria-label={q.text}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={ratings[q.id] === n ? "rating-btn selected" : "rating-btn"}
                    onClick={() => handleRate(q.id, n)}
                    disabled={submitted}
                    aria-pressed={ratings[q.id] === n}
                    aria-label={`${n} out of 5`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="feedback-submit-row">
            {submitted ? (
              <p className="feedback-submitted">Thank you for your feedback.</p>
            ) : (
              <button
                className="primary-button"
                type="button"
                disabled={!allAnswered}
                onClick={handleSubmitFeedback}
              >
                Submit
              </button>
            )}
            <button
              className="session-export-btn"
              type="button"
              onClick={() => downloadSessionRecord(refCode)}
            >
              Download my session record
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
