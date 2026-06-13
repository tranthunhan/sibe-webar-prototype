import { useEffect, useMemo, useRef, useState } from "react";
import FloatingCards from "./FloatingCards.jsx";
import MicroDelight from "./MicroDelight.jsx";

const targetSrc = `${import.meta.env.BASE_URL}targets/product.mind`;

async function targetLooksValid(url) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return false;

    const buffer = await response.arrayBuffer();
    const text = new TextDecoder("utf-8").decode(buffer.slice(0, 256)).toLowerCase();
    return buffer.byteLength > 1024 && !text.includes("placeholder") && !text.includes("replace");
  } catch (error) {
    console.warn("[sibe ar target check failed]", error);
    return false;
  }
}

// Academic mapping:
// [CO] AR overlays offload package interpretation into visible benefit, fit, and profile cards.
// [DF] Fallback demo mode preserves the same decision flow when a real target is unavailable.
// [ED] Small glow/progress animation creates delight without prize, lottery, or randomness.
// [PR] MindAR target tracking tests receptivity to product-pack-anchored digital layers.
export default function ARScene({
  product,
  preference,
  onTargetFound,
  onSceneLoaded,
  onCardView,
  onMicroTap,
  onDelightComplete
}) {
  const [mode, setMode] = useState("checking");
  const targetRef = useRef(null);
  const loggedFallbackTarget = useRef(false);

  const encodedTarget = useMemo(
    () => `imageTargetSrc: ${targetSrc}; autoStart: true; uiScanning: yes; uiLoading: yes;`,
    []
  );

  useEffect(() => {
    let cancelled = false;

    targetLooksValid(targetSrc).then((valid) => {
      if (cancelled) return;
      const nextMode = valid ? "ar" : "fallback";
      setMode(nextMode);
      onSceneLoaded({ mode: nextMode, targetSrc, validTarget: valid });
    });

    return () => {
      cancelled = true;
    };
  }, [onSceneLoaded]);

  useEffect(() => {
    if (mode !== "ar" || !targetRef.current) return undefined;
    const node = targetRef.current;
    const handler = () => onTargetFound({ mode: "ar", targetSrc });
    node.addEventListener("targetFound", handler);
    return () => node.removeEventListener("targetFound", handler);
  }, [mode, onTargetFound]);

  useEffect(() => {
    if (mode !== "fallback" || loggedFallbackTarget.current) return;
    loggedFallbackTarget.current = true;
    const timer = window.setTimeout(() => {
      onTargetFound({ mode: "fallback", targetSrc, reason: "placeholder_or_missing_target" });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [mode, onTargetFound]);

  if (mode === "checking") {
    return (
      <section className="ar-shell ar-shell--loading" aria-live="polite">
        <p className="eyebrow">WebAR condition</p>
        <h2>Checking marker target...</h2>
      </section>
    );
  }

  if (mode === "fallback") {
    return (
      <section className="ar-shell ar-shell--fallback">
        <div className="fallback-marker">
          <img src={`${import.meta.env.BASE_URL}assets/marker-placeholder.png`} alt="" />
          <span>Fallback demo mode</span>
        </div>
        <div className="ar-stage">
          <p className="eyebrow">WebAR condition</p>
          <h2>{product.name}</h2>
          <p>
            Placeholder target detected. The study flow remains available with simulated AR cards.
          </p>
          <FloatingCards product={product} preference={preference} onViewCard={onCardView} />
        </div>
        <MicroDelight product={product} onTap={onMicroTap} onComplete={onDelightComplete} />
      </section>
    );
  }

  return (
    <section className="ar-shell ar-shell--live">
      <a-scene
        embedded
        color-space="sRGB"
        mindar-image={encodedTarget}
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: true"
      >
        <a-assets>
          <img
            id="marker-placeholder"
            src={`${import.meta.env.BASE_URL}assets/marker-placeholder.png`}
            alt=""
          />
        </a-assets>
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
        <a-entity ref={targetRef} mindar-image-target="targetIndex: 0">
          <a-plane
            src="#marker-placeholder"
            position="0 0 0"
            height="0.55"
            width="0.55"
            rotation="0 0 0"
          ></a-plane>
          <a-text
            value={product.name}
            color="#ffffff"
            align="center"
            position="0 -0.45 0"
            scale="0.32 0.32 0.32"
          ></a-text>
        </a-entity>
      </a-scene>
      <div className="ar-overlay">
        <FloatingCards product={product} preference={preference} onViewCard={onCardView} />
        <MicroDelight product={product} onTap={onMicroTap} onComplete={onDelightComplete} />
      </div>
    </section>
  );
}
