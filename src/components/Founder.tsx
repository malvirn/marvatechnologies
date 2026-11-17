export default function Founder() {
  return (
    <section className="mh" id="founder" aria-label="Meet the founder">
      <div className="mh-stage">
        {/* Natural proportions: never cropped, never zoomed */}
        <img
          className="mh-img"
          src="/hero-background.webp"
          alt="Malvirn Gomo, founder of Marva Technologies, at his desk with a laptop and glowing code panels"
          width={1672}
          height={941}
          loading="lazy"
          decoding="async"
        />
        <div className="mh-shade" aria-hidden="true" />
        <div className="mh-copy">
          <p className="mh-pretitle">Meet the founder</p>
          <h2 className="mh-title">Malvirn <span className="mh-accent">Gomo</span></h2>
          <p className="mh-text">
            Founder of Marva Technologies, building useful software, thoughtful websites and digital tools from Zimbabwe.
          </p>
        </div>
      </div>
    </section>
  );
}
