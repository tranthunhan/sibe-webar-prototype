import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ARScene from "./components/ARScene.jsx";
import ControlShelf from "./components/ControlShelf.jsx";
import DecisionSummary from "./components/DecisionSummary.jsx";
import FilterPanel from "./components/FilterPanel.jsx";
import { getBestProduct, products } from "./data/products.js";
import { assignCondition, getSessionId } from "./lib/abTest.js";
import { configureAnalytics, getElapsedMs, logEvent } from "./lib/analytics.js";

// Academic mapping:
// [CO] App-level state centralizes condition, choice, and timing so participant burden is low.
// [DF] The control condition preserves dense comparison while phygital mode narrows the path.
// [ED] Micro-interactions are responsive and non-prize based, keeping delight ethical and bounded.
// [PR] A shared final-choice outcome compares receptivity across shelf and WebAR experiences.
export default function App() {
  const assignment = useMemo(() => assignCondition(), []);
  const sessionId = useMemo(() => getSessionId(), []);
  const [preference, setPreference] = useState("energy");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const [choiceRecorded, setChoiceRecorded] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const sessionEndLogged = useRef(false);

  const recommendedProduct = useMemo(() => getBestProduct(preference), [preference]);
  const activeProduct = selectedProduct || recommendedProduct;

  useEffect(() => {
    configureAnalytics({ sessionId, condition: assignment.condition });
    logEvent("session_start", { assignmentSource: assignment.source }, "session");
    logEvent(
      "condition_assigned",
      { assignmentSource: assignment.source, condition: assignment.condition },
      "experiment"
    );
  }, [assignment.condition, assignment.source, sessionId]);

  useEffect(() => {
    const timer = window.setInterval(() => setElapsedMs(getElapsedMs()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (assignment.condition !== "phygital") return;
    setSelectedProduct(recommendedProduct);
    logEvent(
      "recommendation_shown",
      { productId: recommendedProduct.id, preference },
      "recommendation"
    );
  }, [assignment.condition, preference, recommendedProduct]);

  const trackInteraction = useCallback((product, source) => {
    setInteractionCount((count) => count + 1);
    logEvent(
      "info_card_viewed",
      { productId: product.id, source },
      source === "shelf_card" ? "control_shelf" : "ar_overlay"
    );
  }, []);

  const handlePreferenceSelect = useCallback((nextPreference) => {
    setPreference(nextPreference);
    setInteractionCount((count) => count + 1);
    logEvent("preference_selected", { preference: nextPreference }, "filter");
  }, []);

  const handleFilterOpen = useCallback(() => {
    logEvent("filter_opened", { preference }, "filter");
  }, [preference]);

  const handleARSceneLoaded = useCallback((payload) => {
    logEvent("ar_scene_loaded", payload, "ar");
  }, []);

  const handleTargetFound = useCallback((payload) => {
    logEvent("target_found", payload, "ar");
  }, []);

  const handleARCardView = useCallback(
    (card) => {
      setInteractionCount((count) => count + 1);
      logEvent(
        "info_card_viewed",
        { productId: activeProduct.id, preference, cardId: card.id },
        "ar_overlay"
      );
    },
    [activeProduct.id, preference]
  );

  const handleMicroTap = useCallback((payload) => {
    setInteractionCount((count) => count + 1);
    logEvent("micro_interaction_tap", payload, "micro_interaction");
  }, []);

  const handleDelightComplete = useCallback((payload) => {
    logEvent("delight_animation_complete", payload, "micro_interaction");
  }, []);

  const handleFinalChoice = useCallback(() => {
    if (!activeProduct || choiceRecorded) return;
    setChoiceRecorded(true);
    logEvent(
      "final_choice",
      {
        productId: activeProduct.id,
        preference,
        interactions: interactionCount,
        decisionTimeMs: getElapsedMs()
      },
      "outcome"
    );
    if (!sessionEndLogged.current) {
      sessionEndLogged.current = true;
      logEvent("session_end", { reason: "final_choice" }, "session");
    }
  }, [activeProduct, choiceRecorded, interactionCount, preference]);

  useEffect(() => {
    const endSession = () => {
      if (sessionEndLogged.current) return;
      sessionEndLogged.current = true;
      logEvent("session_end", { reason: "page_hidden" }, "session");
    };

    window.addEventListener("pagehide", endSession);
    return () => window.removeEventListener("pagehide", endSession);
  }, []);

  const isPhygital = assignment.condition === "phygital";

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">SIBE 2026 study prototype</p>
          <h1>{isPhygital ? "WebAR product guidance" : "Traditional shelf choice"}</h1>
        </div>
        <span className="condition-pill">{assignment.condition}</span>
      </header>

      {isPhygital ? (
        <div className="phygital-layout">
          <FilterPanel
            selectedPreference={preference}
            onOpen={handleFilterOpen}
            onSelect={handlePreferenceSelect}
          />
          <ARScene
            product={activeProduct}
            preference={preference}
            onSceneLoaded={handleARSceneLoaded}
            onTargetFound={handleTargetFound}
            onCardView={handleARCardView}
            onMicroTap={handleMicroTap}
            onDelightComplete={handleDelightComplete}
          />
        </div>
      ) : (
        <ControlShelf
          products={products}
          selectedProductId={selectedProduct?.id}
          onInteract={trackInteraction}
          onSelect={setSelectedProduct}
        />
      )}

      <DecisionSummary
        product={isPhygital ? activeProduct : selectedProduct}
        condition={assignment.condition}
        preference={preference}
        interactionCount={interactionCount}
        elapsedMs={elapsedMs}
        onFinalChoice={handleFinalChoice}
      />

      {choiceRecorded ? (
        <p className="completion-note" role="status">
          Final choice recorded for this static prototype session.
        </p>
      ) : null}
    </main>
  );
}
