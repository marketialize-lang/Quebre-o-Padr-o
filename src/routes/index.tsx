import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Pause, Play, Shuffle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const headlineLines = [
  { text: "QUEBRE", style: "" },
  { text: "o padrão", style: "serif" },
  { text: "DO SEU SITE.", style: "indent" },
];

function Index() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const letters = Array.from(stage.querySelectorAll<HTMLElement>(".magnetic-letter"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let pointer = { x: -1000, y: -1000 };
    let pilot = 0;
    let lastActivity = performance.now();
    let touchPointer: { x: number; y: number } | null = null;

    const measure = () => {
      const rect = stage.getBoundingClientRect();
      return { x: pointer.x - rect.left, y: pointer.y - rect.top };
    };

    const movePointer = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      touchPointer = event.pointerType === "touch" ? pointer : null;
      lastActivity = performance.now();
    };

    const animate = (time: number) => {
      if (!paused && !reducedMotion) {
        const idle = time - lastActivity > 1300;
        if (idle) {
          pilot = (Math.sin(time / 1800) + 1) / 2;
        }
        const target = idle
          ? { x: stage.clientWidth * (0.18 + pilot * 0.62), y: stage.clientHeight * 0.48 }
          : touchPointer
            ? { x: touchPointer.x - stage.getBoundingClientRect().left, y: touchPointer.y - stage.getBoundingClientRect().top }
            : measure();

        letters.forEach((letter) => {
          const rect = letter.getBoundingClientRect();
          const stageRect = stage.getBoundingClientRect();
          const cx = rect.left - stageRect.left + rect.width / 2;
          const cy = rect.top - stageRect.top + rect.height / 2;
          const dx = cx - target.x;
          const dy = cy - target.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - distance / 180);
          const push = influence * 20;
          const angle = Math.atan2(dy, dx);
          const rotate = Math.max(-9, Math.min(9, dx * influence * 0.065));
          letter.style.setProperty("--shift-x", `${Math.cos(angle) * push}px`);
          letter.style.setProperty("--shift-y", `${Math.sin(angle) * push}px`);
          letter.style.setProperty("--rotate", `${rotate}deg`);
          letter.style.setProperty("--scale", `${1 + influence * 0.16}`);
          letter.style.setProperty("--hot", `${influence}`);
        });
      }
      frame = requestAnimationFrame(animate);
    };

    stage.addEventListener("pointermove", movePointer);
    stage.addEventListener("pointerdown", movePointer);
    frame = requestAnimationFrame(animate);
    return () => {
      stage.removeEventListener("pointermove", movePointer);
      stage.removeEventListener("pointerdown", movePointer);
      cancelAnimationFrame(frame);
    };
  }, [paused]);

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

              <div className="hero-tools">
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
      <div id="portfolio" className="next-section-marker" aria-label="Portfólio em construção" />
      <div id="contato" className="contact-marker" aria-label="Contato" />
    </main>
  );
}
