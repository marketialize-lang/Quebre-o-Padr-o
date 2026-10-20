import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Pause, Play, Shuffle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const headlineLines = [
  { text: "QUEBRE", style: "" },
  { text: "o padrão", style: "serif" },
  { text: "DO SEU SITE", style: "indent" },
];

function Index() {
  const stageRef = useRef<HTMLDivElement>(null);
  const credibilitySectionRef = useRef<HTMLElement>(null);
  const proofPanelRef = useRef<HTMLElement>(null);
  const proofCountRef = useRef<HTMLSpanElement>(null);
  const proofRailFillRef = useRef<HTMLSpanElement>(null);
  const proofRailHeadRef = useRef<HTMLSpanElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const rulerMarkRef = useRef<HTMLSpanElement>(null);
  const rulerTagRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const letters = Array.from(stage.querySelectorAll<HTMLElement>(".magnetic-letter"));
    const ruler = rulerRef.current;
    const rulerMark = rulerMarkRef.current;
    const rulerTag = rulerTagRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const letterStates = letters.map(() => ({ x: 0, y: 0, rotation: 0, scale: 1, hot: 0, vx: 0, vy: 0, vr: 0, vs: 0, vh: 0 }));
    let frame = 0;
    let pointer = { x: -1000, y: -1000, active: false };
    let touchPointer: { x: number; y: number } | null = null;
    let lastActivity = performance.now();
    let lastFrame = lastActivity;
    let pilotTime = 0;
    let magnetX = stage.clientWidth / 2;
    let magnetY = stage.clientHeight / 2;
    let magnetStrength = 0;
    const initialRulerRect = ruler?.getBoundingClientRect();
    const initialMarkX = initialRulerRect ? Math.round(initialRulerRect.width * 0.18) : 0;

    if (rulerMark && rulerTag) {
      rulerMark.style.left = `${initialMarkX}px`;
      rulerMark.style.opacity = "1";
      rulerTag.textContent = `X ${String(initialMarkX).padStart(4, "0")}`;
    }

    const movePointer = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY, active: true };
      touchPointer = event.pointerType === "touch" ? pointer : null;
      lastActivity = performance.now();
    };

    const animate = (time: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (time - lastFrame) / 1000));
      lastFrame = time;
      const stageRect = stage.getBoundingClientRect();
      const fontSize = Number.parseFloat(getComputedStyle(stage).fontSize) || 100;
      const radius = Math.max(90, fontSize * 1.5);
      const now = time;
      const idle = now - lastActivity > 1500;

      let targetX = magnetX;
      let targetY = magnetY;
      let want = 0;

      if (!paused && !reducedMotion) {
        if (touchPointer && now - lastActivity < 2600) {
          targetX = touchPointer.x - stageRect.left;
          targetY = touchPointer.y - stageRect.top;
          want = 1;
        } else if (pointer.active && now - lastActivity < 2600) {
          targetX = pointer.x - stageRect.left;
          targetY = pointer.y - stageRect.top;
          const within = targetX >= -radius && targetX <= stageRect.width + radius && targetY >= -radius && targetY <= stageRect.height + radius;
          want = within ? Math.max(0.45, 1 - Math.max(0, Math.min(targetX, stageRect.width - targetX, targetY, stageRect.height - targetY)) / (radius * 2)) : 0;
        } else if (idle) {
          pilotTime += dt;
          const count = Math.max(2, letters.length);
          const position = (pilotTime * 2.8) % (2 * count - 2);
          const index = position <= count - 1 ? position : 2 * count - 2 - position;
          const letterRect = letters[Math.round(index)]?.getBoundingClientRect();
          targetX = letterRect ? letterRect.left - stageRect.left + letterRect.width / 2 : stageRect.width * (0.18 + (Math.sin(pilotTime * 0.55) + 1) * 0.31);
          targetY = letterRect ? letterRect.top - stageRect.top + letterRect.height / 2 : stageRect.height * 0.48;
          targetY += Math.sin(pilotTime * 2.1) * fontSize * 0.12;
          want = 0.86;
        }
      }

      const near = want > 0;
      const magnetEase = 1 - Math.exp(-dt * (near ? 18 : 6));
      magnetX += (targetX - magnetX) * magnetEase;
      magnetY += (targetY - magnetY) * magnetEase;
      magnetStrength += (want - magnetStrength) * (1 - Math.exp(-dt * (want > magnetStrength ? 5 : 2.6)));
      if (magnetStrength < 0.002 && want === 0) magnetStrength = 0;

      letters.forEach((letter, index) => {
        const state = letterStates[index];
        const rect = letter.getBoundingClientRect();
        const cx = rect.left - stageRect.left + rect.width / 2;
        const cy = rect.top - stageRect.top + rect.height / 2;
        const dx = cx - magnetX;
        const dy = cy - magnetY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const t = Math.max(0, 1 - distance / radius);
        const influence = t * t * (3 - 2 * t) * magnetStrength;
        const direction = distance > 0.001 ? 1 / distance : 0;
        const force = fontSize * 0.2;
        const gx = dx * direction * force * influence;
        const gy = dy * direction * force * influence * 0.72;
        const gr = Math.max(-30, Math.min(30, (dx / radius) * 30 * influence));
        const gs = 1 + 0.34 * influence;
        const gh = influence;
        const spring = (value: number, velocity: number, goal: number, damping: number) => {
          const acceleration = (goal - value) * 190 - damping * velocity;
          const nextVelocity = velocity + acceleration * dt;
          return [value + nextVelocity * dt, nextVelocity] as const;
        };
        const [x, vx] = spring(state.x, state.vx, gx, index === 0 ? 22 : 15);
        const [y, vy] = spring(state.y, state.vy, gy, index === 0 ? 22 : 15);
        const [rotation, vr] = spring(state.rotation, state.vr, gr, index === 0 ? 22 : 15);
        const [scale, vs] = spring(state.scale, state.vs, gs, index === 0 ? 22 : 15);
        const [hot, vh] = spring(state.hot, state.vh, gh, index === 0 ? 22 : 15);
        Object.assign(state, { x, y, rotation, scale, hot, vx, vy, vr, vs, vh });
        letter.style.setProperty("--shift-x", `${x}px`);
        letter.style.setProperty("--shift-y", `${y}px`);
        letter.style.setProperty("--rotate", `${rotation}deg`);
        letter.style.setProperty("--scale", `${scale}`);
        letter.style.setProperty("--hot", `${Math.max(0, Math.min(1, hot))}`);
      });

      if (ruler && rulerMark && rulerTag) {
        const rulerRect = ruler.getBoundingClientRect();
        const relativeStageX = magnetX - stageRect.left;
        const rulerX = Math.max(0, Math.min(rulerRect.width - 1, relativeStageX));
        rulerMark.style.left = `${rulerX}px`;
        rulerMark.style.opacity = String(Math.max(0.3, Math.min(1, magnetStrength)));
        rulerTag.textContent = `X ${String(Math.round(rulerX)).padStart(4, "0")}`;
      }

      frame = requestAnimationFrame(animate);
    };

    stage.addEventListener("pointermove", movePointer);
    stage.addEventListener("pointerdown", movePointer);
    ruler?.addEventListener("pointermove", movePointer);
    ruler?.addEventListener("pointerdown", movePointer);
    frame = requestAnimationFrame(animate);
    return () => {
      stage.removeEventListener("pointermove", movePointer);
      stage.removeEventListener("pointerdown", movePointer);
      ruler?.removeEventListener("pointermove", movePointer);
      ruler?.removeEventListener("pointerdown", movePointer);
      cancelAnimationFrame(frame);
    };
  }, [paused]);

  useEffect(() => {
    const section = credibilitySectionRef.current;
    const proofPanel = proofPanelRef.current;
    const counter = proofCountRef.current;
    const railFill = proofRailFillRef.current;
    const railHead = proofRailHeadRef.current;
    if (!section || !proofPanel || !counter || !railFill || !railHead) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(section.querySelectorAll<HTMLElement>(".scroll-reveal"));
    const revealObserver = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            (entry.target as HTMLElement).dataset.revealed = entry.isIntersecting ? "true" : "false";
          });
        }, { threshold: 0.08, rootMargin: "-5% 0px -10% 0px" })
      : null;
    if (revealObserver) revealItems.forEach((item) => revealObserver.observe(item));
    else revealItems.forEach((item) => { item.dataset.revealed = "true"; });
    section.dataset.scrollReady = "true";
    let frame = 0;

    const update = () => {
      frame = 0;
      const proofRect = proofPanel.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.9;
      const end = viewport * 0.18;
      const progress = reduceMotion
        ? 1
        : Math.max(0, Math.min(1, (start - proofRect.top) / (start - end)));

      counter.textContent = String(Math.round(66 * progress));
      railFill.style.transform = `scaleY(${progress})`;
      railHead.style.top = `${progress * 100}%`;
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      revealObserver?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const shuffleLetters = () => {
    setShuffleKey((key) => key + 1);
  };

  return (
    <main className="portfolio-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-shell">
          <header className="hero-topline">
            <a className="wordmark" href="#top" aria-label="Rafael Fonseca, início">
              RF<span>/</span>
            </a>
            <span className="topline-note">ESTRATÉGIA · DESIGN · PRESENÇA DIGITAL</span>
            <a className="topline-contact" href="#contato">
              VAMOS CONVERSAR <ArrowRight size={15} aria-hidden="true" />
            </a>
          </header>

          <div className="hero-main" id="top">
            <div className="hero-copy-column">
              <div className="hero-kicker"><span /> RAFAEL FONSECA · DESIGNER DIGITAL</div>
              <div className="hero-stage" ref={stageRef}>
                <div className="ghost-word" aria-hidden="true">
                  <div className="ghost-track">
                    <span>QUEBRE O PADRÃO · QUEBRE O PADRÃO · </span>
                    <span>QUEBRE O PADRÃO · QUEBRE O PADRÃO · </span>
                  </div>
                </div>
                <div className="magnetic-field" aria-hidden="true"><i /><i /><i /></div>
                <h1 className="hero-title" id="hero-title" key={shuffleKey}>
                  {headlineLines.map((line, lineIndex) => (
                    <span className={`title-line ${line.style}`} key={`${line.text}-${lineIndex}`}>
                      {Array.from(line.text).map((char, index) => (
                        <span className={`magnetic-letter${char === " " ? " letter-space" : ""}`} key={`${lineIndex}-${index}`} aria-hidden="true">
                          {char === " " ? "\u00a0" : char}
                        </span>
                      ))}
                    </span>
                  ))}
                  <span className="sr-only">Quebre o padrão do seu site.</span>
                </h1>
                <div className="hero-seal" aria-hidden="true">
                  <span className="seal-ring">DESIGN COM ESTRATÉGIA · RAFAEL FONSECA · </span>
                  <ArrowDown size={25} strokeWidth={1.6} />
                </div>
              </div>

              <div className="hero-tools" ref={rulerRef}>
                <span className="hero-ruler-mark" ref={rulerMarkRef} style={{ left: "18%" }} aria-hidden="true"><b ref={rulerTagRef}>X 0000</b></span>
                <span className="tool-caption">MOVA O CURSOR SOBRE AS LETRAS</span>
                <div className="tool-buttons">
                  <button type="button" onClick={shuffleLetters} aria-label="Embaralhar as letras">
                    <Shuffle size={15} /> <span>EMBARALHAR</span>
                  </button>
                  <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Retomar movimento" : "Pausar movimento"}>
                    {paused ? <Play size={15} /> : <Pause size={15} />} <span>{paused ? "RETOMAR" : "PAUSAR"}</span>
                  </button>
                </div>
              </div>

              <div className="hero-bottom">
                <p className="hero-description">
                  Sites e páginas com <strong>design autoral, estrutura clara e visão de marketing</strong> para apresentar seu negócio do jeito que ele merece ser visto.
                </p>
                <a className="primary-cta" href="#contato">
                  <span>VAMOS CRIAR SUA PÁGINA</span>
                  <span className="cta-icon"><ArrowRight size={19} /></span>
                </a>
              </div>
            </div>

            <figure className="portrait-wrap">
              <img src="/rafael-fonseca-hero.jpg" alt="Retrato de Rafael Fonseca com óculos escuros diante de um fundo vermelho e laranja" className="portrait" />
              <div className="portrait-overlay" aria-hidden="true" />
              <figcaption className="portrait-caption"><span>01 / 04</span><span>QUEBRE O PADRÃO</span></figcaption>
              <span className="portrait-index" aria-hidden="true">RF—01</span>
            </figure>
          </div>

          <footer className="hero-footer">
            <span>6 ANOS DE EXPERIÊNCIA EM MARKETING</span>
            <span className="footer-center">COPYWRITING · TRÁFEGO PAGO · DESIGN</span>
            <a href="#portfolio">DESCUBRA O TRABALHO <ArrowDown size={14} /></a>
          </footer>
        </div>
      </section>
      <section ref={credibilitySectionRef} className="credibility-section" aria-labelledby="credibility-title">
        <div className="credibility-shell">
          <div className="credibility-topline">
            <span>02 / A PRESENÇA ANTES DA CONVERSA</span>
            <span>QUEBRE O PADRÃO · RAFAEL FONSECA</span>
          </div>

          <div className="credibility-layout">
            <div className="credibility-copy">
              <p className="credibility-kicker scroll-reveal"><span /> O PADRÃO QUE VALE A PENA QUEBRAR</p>
              <h2 id="credibility-title" className="scroll-reveal">
                <span className="credibility-heading-desktop">Um site genérico pode<br />fazer um bom negócio<br />parecer igual a todos.</span>
                <span className="credibility-heading-mobile">Um site genérico<br />pode fazer um bom<br />negócio parecer<br />igual a todos.</span>
              </h2>
              <p className="credibility-body scroll-reveal">
                Alguém recebe seu nome por indicação, encontra um anúncio ou visita seu perfil. Antes de chamar, pode procurar mais informações sobre o que você faz. Se a página é confusa, desatualizada ou poderia pertencer a qualquer empresa, fica mais difícil perceber o cuidado por trás do seu trabalho.
              </p>
              <div className="credibility-takeaway scroll-reveal">
                <span>UMA PÁGINA COM INTENÇÃO</span>
                <p>Organiza a mensagem, mostra o que você oferece e deixa o próximo passo claro.</p>
              </div>
            </div>

            <aside ref={proofPanelRef} className="credibility-proof scroll-reveal" aria-label="Dado de pesquisa sobre confiança em empresas com site">
              <span className="proof-rail" aria-hidden="true">
                <span className="proof-rail-fill" ref={proofRailFillRef} />
                <span className="proof-rail-head" ref={proofRailHeadRef} />
              </span>
              <div className="proof-label"><span>UM DADO SOBRE CREDIBILIDADE</span><span>01 — PESQUISA</span></div>
              <div className="proof-number" role="img" aria-label="66 por cento">
                <span className="proof-count" ref={proofCountRef} aria-hidden="true">0</span><span aria-hidden="true">%</span>
              </div>
              <p className="proof-copy">dos consumidores pesquisados concordaram que uma empresa com site próprio parece mais confiável do que uma empresa sem site.</p>
              <div className="proof-source">
                <span>Pesquisa encomendada pela Verisign à 451 Research, com 5.450 consumidores. O levantamento mediu percepção, não aumento de vendas.</span>
                <a href="https://www.verisign.com/assets/Websites_BrandedEmail_Key_SMB_Internet_Services.pdf" target="_blank" rel="noreferrer">CONSULTAR A FONTE <ArrowRight size={14} aria-hidden="true" /></a>
              </div>
            </aside>
          </div>

          <div className="credibility-footer">
            <span>DESIGN QUE MOSTRA O QUE TORNA SEU NEGÓCIO PRÓPRIO.</span>
            <span>CONTINUA ↓</span>
          </div>
        </div>
      </section>
      <div id="portfolio" className="next-section-marker" aria-label="Portfólio" />
      <div id="contato" className="contact-marker" aria-label="Contato" />
    </main>
  );
}
