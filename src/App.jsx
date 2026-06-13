import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { nanoid } from "nanoid";
import BrowsingShelf from "./components/BrowsingShelf.jsx";
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
const refCodeKey = "gg_ref_code";
const legacySessionKey = "gg_session";
const eventsKey = "gg_events";

function applyResetParam() {
  if (new URLSearchParams(window.location.search).get("reset") !== "1") return;

  try {
    [eventsKey, legacySessionKey, sessionKey, shortlistKey, refCodeKey].forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch {
    // localStorage unavailable - continue without blocking the app
  }
}

applyResetParam();

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

// Generates a human-readable reference code (e.g. GG-7F3K) for linking sessions to survey responses.
function getRefCode() {
  const existing = localStorage.getItem(refCodeKey);
  if (existing) return existing;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "GG-";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  localStorage.setItem(refCodeKey, code);
  return code;
}

// ?v=a = full assisted flow (default); ?v=b = plain browsing shelf
function getVariant() {
  return new URLSearchParams(window.location.search).get("v") || "a";
}

// Academic mapping:
// [CO] This guided selector reduces cognitive load by narrowing product comparison.
// [DF] The recommendation flow reduces decision fatigue by limiting the final choice set.
// [ED] The progress bar and match score create emotional delight without prize-based mechanics.
// [PR] The QR-like scenario supports willingness to use digital product guidance.
export default function App() {
  const quizRef = useRef(null);
  const shelfRef = useRef(null);
  const quizStartedRef = useRef(false);
  const compareViewFiredRef = useRef(false);

  const [answers, setAnswers] = useState(defaultAnswers);
  const [comparedIds, setComparedIds] = useState([]);
  const [shortlistIds, setShortlistIds] = useState(readShortlist);
  const [finalChoice, setFinalChoice] = useState(null);
  const [decisionTimeMs, setDecisionTimeMs] = useState(0);

  const sessionId = useMemo(() => getSessionId(), []);
  const refCode = useMemo(() => getRefCode(), []);
  const variant = useMemo(() => getVariant(), []);
  const heroCopy = useMemo(
    () =>
      variant === "b"
        ? {
            headline: "Browse the skincare range.",
            subtext: "Review the shelf options and choose one product that looks right for you.",
            ctaLabel: "Browse products"
          }
        : {
            headline: "Find the skincare product that fits your skin.",
            subtext: "Answer a few quick questions and compare products without reading every label.",
            ctaLabel: "Start skin match"
          },
    [variant]
  );

  const matches = useMemo(() => getRecommendations(skincareProducts, answers), [answers]);
  const bestMatch = matches[0];
  const alternatives = matches.slice(1, 4);

  const productById = useMemo(
    () => new Map(skincareProducts.map((p) => [p.id, p])),
    []
  );

  const comparedProducts = comparedIds.map((id) => productById.get(id)).filter(Boolean);
  const shortlistedProducts = shortlistIds.map((id) => productById.get(id)).filter(Boolean);

  const routineProducts = useMemo(() => {
    const products = new Map();
    if (bestMatch?.product) products.set(bestMatch.product.id, bestMatch.product);
    shortlistedProducts.forEach((p) => products.set(p.id, p));
    comparedProducts.forEach((p) => products.set(p.id, p));
    return [...products.values()];
  }, [bestMatch?.product, comparedProducts, shortlistedProducts]);

  const routineProgress = useMemo(() => getRoutineProgress(routineProducts), [routineProducts]);
  const confidence = bestMatch?.score || 0;

  // Session init — configures analytics context then fires session_start
  useEffect(() => {
    configureAnalytics({ sessionId, variant });
    logEvent("session_start", { source: "qr_assistant" });
  }, [sessionId, variant]);

  // session_end on tab close / navigation
  useEffect(() => {
    const handleUnload = () => {
      logEvent("session_end", { duration_ms: getElapsedMs() });
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // Persist shortlist to localStorage
  useEffect(() => {
    localStorage.setItem(shortlistKey, JSON.stringify(shortlistIds));
  }, [shortlistIds]);

  // recommendation_view fires each time the best match changes (assisted flow only)
  useEffect(() => {
    if (!bestMatch || variant !== "a") return;
    logEvent("recommendation_view", {
      product_id: bestMatch.product.id,
      score: bestMatch.score
    });
  }, [answers, bestMatch, variant]);

  // comparison_view fires once when the compare drawer first becomes populated
  useEffect(() => {
    if (comparedIds.length > 0 && !compareViewFiredRef.current) {
      compareViewFiredRef.current = true;
      logEvent("comparison_view", { compare_count: comparedIds.length });
    }
  }, [comparedIds]);

  const handleHeroCta = useCallback(() => {
    if (variant === "b") {
      shelfRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    logEvent("hero_cta_click", {});
  }, [variant]);

  const handleAnswerChange = useCallback((field, value) => {
    if (!quizStartedRef.current) {
      quizStartedRef.current = true;
      logEvent("quiz_start", {});
    }
    setAnswers((current) => ({ ...current, [field]: value }));
    logEvent("filter_change", { field, value });
  }, []);

  const handleCompare = useCallback((productId) => {
    setComparedIds((current) => {
      if (current.includes(productId)) {
        logEvent("compare_remove", { product_id: productId });
        return current.filter((id) => id !== productId);
      }
      if (current.length >= 3) return current;
      logEvent("compare_add", { product_id: productId });
      return [...current, productId];
    });
  }, []);

  const handleShortlist = useCallback((productId) => {
    setShortlistIds((current) => {
      if (current.includes(productId)) {
        logEvent("shortlist_remove", { product_id: productId });
        return current.filter((id) => id !== productId);
      }
      logEvent("shortlist_add", { product_id: productId });
      return [...current, productId];
    });
  }, []);

  const handleChoose = useCallback(
    (product) => {
      const timeMs = getElapsedMs();
      setDecisionTimeMs(timeMs);
      setFinalChoice(product);
      logEvent("final_choice", {
        product_id: product.id,
        product_name: product.name,
        variant,
        time_to_decide_ms: timeMs,
        compare_count: comparedIds.length,
        shortlist_count: shortlistIds.length,
        selected_filters: variant === "a" ? answers : undefined
      });
    },
    [comparedIds, shortlistIds, answers, variant]
  );

  return (
    <main className="app">
      <Hero
        onStart={handleHeroCta}
        headline={heroCopy.headline}
        subtext={heroCopy.subtext}
        ctaLabel={heroCopy.ctaLabel}
      />

      {variant === "a" && (
        <>
          <section className="scenario-card" aria-label="In-store QR assistant">
            <span className="eyebrow">In-store QR assistant</span>
            <h2>Scan the shelf QR, select your skin needs, and get a clear product match.</h2>
            <p>
              GlowGuide turns product labels into a guided shortlist so you can compare quickly
              and choose with more confidence in the aisle.
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
        </>
      )}

      {variant === "b" && (
        <div ref={shelfRef}>
          <BrowsingShelf products={skincareProducts} onChoose={handleChoose} />
        </div>
      )}

      <FinalChoice
        choice={finalChoice}
        comparedProducts={comparedProducts}
        decisionTimeMs={decisionTimeMs}
        refCode={refCode}
        shortlistCount={shortlistIds.length}
        variant={variant}
        onClose={() => setFinalChoice(null)}
      />
    </main>
  );
}
