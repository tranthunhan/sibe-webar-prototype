import { useEffect, useState } from "react";

// Academic mapping:
// [CO] Progress feedback externalizes completion state after the recommendation is understood.
// [DF] A single tap interaction avoids branching game rules, wheels, or lotteries.
// [ED] Glow and progress offer emotional delight through responsiveness, not material reward.
// [PR] The touch response gives the scanned product a small phygital sense of liveliness.
export default function MicroDelight({ product, onTap, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [glowing, setGlowing] = useState(false);

  useEffect(() => {
    if (progress < 100) return undefined;
    const timer = window.setTimeout(() => {
      onComplete({ productId: product?.id, progress });
    }, 450);
    return () => window.clearTimeout(timer);
  }, [onComplete, product?.id, progress]);

  function handleTap() {
    const nextProgress = Math.min(100, progress + 25);
    setProgress(nextProgress);
    setGlowing(true);
    window.setTimeout(() => setGlowing(false), 520);
    onTap({ productId: product?.id, progress: nextProgress });
  }

  return (
    <section className={`micro-delight ${glowing ? "is-glowing" : ""}`}>
      <div>
        <p className="eyebrow">Micro-interaction</p>
        <h3>Tap to reveal product clarity</h3>
      </div>
      <button type="button" onClick={handleTap}>
        Reveal
      </button>
      <div className="progress-track" aria-label="Reveal progress">
        <span style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
