export default function Hero({ onStart }) {
  return (
    <section className="hero">
      <div className="hero__copy">
        <p className="brand-mark">GlowGuide</p>
        <h1>Find the skincare product that fits your skin.</h1>
        <p className="hero__subtext">
          Answer a few quick questions and compare products without reading every label.
        </p>
        <button className="primary-button" type="button" onClick={onStart}>
          Start skin match
        </button>
      </div>
      <div className="hero__visual" aria-label="Skincare product lineup">
        <img src={`${import.meta.env.BASE_URL}products/glow-c-serum.svg`} alt="" />
        <img src={`${import.meta.env.BASE_URL}products/dew-barrier-moisturiser.svg`} alt="" />
        <img src={`${import.meta.env.BASE_URL}products/daily-shield-spf-50.svg`} alt="" />
      </div>
    </section>
  );
}
