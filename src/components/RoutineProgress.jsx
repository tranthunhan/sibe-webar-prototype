export default function RoutineProgress({ progress, confidence }) {
  return (
    <section className="routine-panel" aria-label="Routine Builder Progress">
      <div>
        <span className="eyebrow">Routine Builder Progress</span>
        <h2>Complete your 3-step routine</h2>
      </div>

      <div className="progress-block">
        <div className="progress-label">
          <span>{progress.completed} of 3 steps covered</span>
          <strong>{progress.percent}%</strong>
        </div>
        <div className="score-track">
          <span style={{ width: `${progress.percent}%` }} />
        </div>
        <div className="routine-steps">
          {progress.steps.map((step) => (
            <span className={step.complete ? "routine-step is-complete" : "routine-step"} key={step.id}>
              {step.label}
            </span>
          ))}
        </div>
      </div>

      <div className="confidence-meter">
        <div className="progress-label">
          <span>Confidence meter</span>
          <strong>{confidence}%</strong>
        </div>
        <div className="score-track score-track--confidence">
          <span style={{ width: `${confidence}%` }} />
        </div>
      </div>
    </section>
  );
}
