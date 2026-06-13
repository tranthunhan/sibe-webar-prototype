import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { nanoid } from "nanoid";
import CompareDrawer from "./components/CompareDrawer.jsx";
import FinalChoice from "./components/FinalChoice.jsx";
import Hero from "./components/Hero.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import RecommendationPanel from "./components/RecommendationPanel.jsx";
import RoutineProgress from "./components/RoutineProgress.jsx";
import Shortlist from "./components/Shortlist.jsx";
import SkinQuiz from "./components/SkinQuiz.jsx";
import { skincareProducts } from "./data/skincareProducts.js";
import { configureAnalytics, getElapsedMs, logEvent } from "./lib/analytics.js";
import { getRecommendations, getRoutineProgress } from "./lib/recommender.js";

const defaultAnswers = {
  skinType: "combination",
  concern: "dryness",
  texture: "serum",
  budget: "mid",
  routineStep: "serum"
};

const shortlistKey = "glowguide_shortlist";
const sessionKey = "glowguide_session_id";

function readShortlist() {
  try {
    return JSON.parse(localStorage.getItem(shortlistKey)) || [];
  } catch {
    return [];
  }
}

function getSessionId() {
  const existing = localStorage.getItem(sessionKey);
  if (existing) return existing;

  const next = nanoid(12);
  localStorage.setItem(sessionKey, next);
  return next;
}

// Academic mapping:
// [CO] This guided selector reduces cognitive load by narrowing product comparison.
// [DF] The recommendation flow reduces decision fatigue by limiting the final choice set.
// [ED] The progress bar and match score create emotional delight without prize-based mechanics.
// [PR] The QR-like scenario supports willingness to use digital product guidance.
export default function App() {
  const quizRef = useRef(null);
  const [answers, setAnswers] = useState(defaultAnswers);
  const [comparedIds, setComparedIds] = useState([]);
  const [shortlistIds, setShortlistIds] = useState(readShortlist);
  const [finalChoice, setFinalChoice] = useState(null);
  const [decisionTimeSeconds, setDecisionTimeSeconds] = useState(0);
  const sessionId = useMemo(() => getSessionId(), []);

  const matches = useMemo(() => getRecommendations(skincareProducts, answers), [answers]);
  const bestMatch = matches[0];
  const alternatives = matches.slice(1, 4);

  const productById = useMemo(() => {
    return new Map(skincareProducts.map((product) => [product.id, product]));
  }, []);

  const comparedProducts = comparedIds.map((id) => productById.get(id)).filter(Boolean);
  const shortlistedProducts = shortlistIds.map((id) => productById.get(id)).filter(Boolean);
  const routineProducts = useMemo(() => {
    const products = new Map();
    if (bestMatch?.product) products.set(bestMatch.product.id, bestMatch.product);
    shortlistedProducts.forEach((product) => products.set(product.id, product));
    comparedProducts.forEach((product) => products.set(product.id, product));
    return [...products.values()];
  }, [bestMatch?.product, comparedProducts, shortlistedProducts]);
  const routineProgress = useMemo(() => getRoutineProgress(routineProducts), [routineProducts]);
  const confidence = bestMatch?.score || 0;

  useEffect(() => {
    configureAnalytics({ sessionId, channel: "skin_finder" });
    logEvent("session_start", { source: "qr_assistant" }, "session");
  }, [sessionId]);

  useEffect(() => {
    localStorage.setItem(shortlistKey, JSON.stringify(shortlistIds));
  }, [shortlistIds]);

  useEffect(() => {
    if (!bestMatch) return;
    logEvent(
      "recommendation_updated",
      { productId: bestMatch.product.id, score: bestMatch.score, answers },
      "recommendation"
    );
  }, [answers, bestMatch]);

  const scrollToQuiz = useCallback(() => {
    quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    logEvent("start_skin_match_clicked", {}, "navigation");
  }, []);

  const handleAnswerChange = useCallback((field, value) => {
    setAnswers((current) => ({ ...current, [field]: value }));
    logEvent("quiz_answer_changed", { field, value }, "quiz");
  }, []);

  const handleCompare = useCallback((productId) => {
    setComparedIds((current) => {
      if (current.includes(productId)) {
        logEvent("compare_removed", { productId }, "comparison");
        return current.filter((id) => id !== productId);
      }
      if (current.length >= 3) return current;
      logEvent("compare_added", { productId }, "comparison");
      return [...current, productId];
    });
  }, []);

  const handleShortlist = useCallback((productId) => {
    setShortlistIds((current) => {
      if (current.includes(productId)) {
        logEvent("shortlist_removed", { productId }, "shortlist");
        return current.filter((id) => id !== productId);
      }
      logEvent("shortlist_added", { productId }, "shortlist");
      return [...current, productId];
    });
  }, []);

  const handleChoose = useCallback(
    (product) => {
      const elapsedSeconds = Math.round(getElapsedMs() / 1000);
      setDecisionTimeSeconds(elapsedSeconds);
      setFinalChoice(product);
      logEvent(
        "final_choice",
        {
          productId: product.id,
          decisionTimeSeconds: elapsedSeconds,
          comparedProductIds: comparedIds
        },
        "outcome"
      );
    },
    [comparedIds]
  );

  return (
    <main className="app">
      <Hero onStart={scrollToQuiz} />

      <section className="scenario-card" aria-label="In-store QR assistant">
        <span className="eyebrow">In-store QR assistant</span>
        <h2>Scan the shelf QR, select your skin needs, and get a clear product match.</h2>
        <p>
          GlowGuide turns product labels into a guided shortlist so you can compare quickly and
          choose with more confidence in the aisle.
        </p>
      </section>

      <div ref={quizRef}>
        <SkinQuiz answers={answers} onChange={handleAnswerChange} />
      </div>

      <RecommendationPanel
        alternatives={alternatives}
        answers={answers}
        match={bestMatch}
        onChoose={handleChoose}
        onShortlist={handleShortlist}
      />

      <RoutineProgress confidence={confidence} progress={routineProgress} />

      <ProductGrid
        comparedIds={comparedIds}
        matches={matches}
        shortlistIds={shortlistIds}
        onChoose={handleChoose}
        onCompare={handleCompare}
        onShortlist={handleShortlist}
      />

      <CompareDrawer products={comparedProducts} onRemove={handleCompare} />

      <Shortlist
        products={shortlistedProducts}
        onChoose={handleChoose}
        onRemove={handleShortlist}
      />

      <FinalChoice
        choice={finalChoice}
        comparedProducts={comparedProducts}
        decisionTimeSeconds={decisionTimeSeconds}
        onClose={() => setFinalChoice(null)}
      />
    </main>
  );
}
