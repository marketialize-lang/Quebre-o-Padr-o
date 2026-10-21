import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play, Shuffle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const headlineLines = [
  { text: "QUEBRE", style: "" },
  { text: "o padrão", style: "serif" },
  { text: "DO SEU SITE", style: "indent" },
];

const portfolioProjects = [
  { number: "01", name: "AERIS X", niche: "AERONÁUTICA", descriptor: "Experiência digital para um drone conceito.", wordmark: "AERIS", theme: "aeris", cover: "/portfolio-aeris.jpg", url: "https://gregarious-biscochitos-146694.netlify.app/" },
  { number: "02", name: "Gravyx", niche: "INTELIGÊNCIA ARTIFICIAL", descriptor: "Apresentação de uma plataforma de IA.", wordmark: "gravyx", theme: "gravyx", cover: "/portfolio-gravyx.webp", url: "https://gravyx-plataforma-ia-rafael.netlify.app/" },
  { number: "03", name: "Tesla Roadster", niche: "AUTOMOTIVO", descriptor: "Página conceito com narrativa visual para o Roadster.", wordmark: "ROADSTER", theme: "roadster", cover: "/portfolio-tesla.jpg", url: "https://tesla-roadster-rafael.netlify.app/" },
  { number: "04", name: "Entre", niche: "ESTÚDIO CRIATIVO", descriptor: "Presença digital para um estúdio de criação.", wordmark: "entre", theme: "entre", cover: "/portfolio-entre.jpg", url: "https://entre-estudio-rafael.netlify.app/" },
  { number: "05", name: "Dr. Henrique Salles", niche: "ODONTOLOGIA", descriptor: "Página de apresentação para implantodontia.", wordmark: "HS", theme: "henrique", cover: "/portfolio-henrique.webp", url: "https://dr-henrique-salles-rafael.netlify.app/" },
  { number: "06", name: "Altano", niche: "MERCADO IMOBILIÁRIO", descriptor: "Experiência para imobiliárias e corretores.", wordmark: "ALTANO", theme: "altano", cover: "/portfolio-altano.webp", url: "https://altano-imobiliarias-rafael.netlify.app/" },
  { number: "07", name: "Advocacia Varela", niche: "JURÍDICO", descriptor: "Presença institucional para um escritório de advocacia.", wordmark: "VARELA", theme: "varela", cover: "/portfolio-varela.webp", url: "https://advocacia-varela-rafael.netlify.app/" },
  { number: "08", name: "Corvelo", niche: "BARBEARIA", descriptor: "Identidade digital para uma barbearia.", wordmark: "CORVELO", theme: "corvelo", cover: "https://images.unsplash.com/photo-1702865263661-9da5ecf6f374?auto=format&fit=crop&w=1024&h=1280&q=70", url: "https://corvelo-barbearia-rafael.netlify.app/" },
  { number: "09", name: "Método Prisma", niche: "EDUCAÇÃO DIGITAL", descriptor: "Página de apresentação para um infoproduto.", wordmark: "PRISMA", theme: "prisma", cover: "/portfolio-prisma.webp", url: "https://metodo-prisma-rafael.netlify.app/" },
  { number: "10", name: "HALO Beauty Lab", niche: "BELEZA", descriptor: "Experiência digital para um salão de beleza.", wordmark: "HALO", theme: "halo", cover: "/portfolio-halo.webp", url: "https://halo-beauty-lab-rafael.netlify.app/" },
];


function Index() {
  const stageRef = useRef<HTMLDivElement>(null);
  const credibilitySectionRef = useRef<HTMLElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const rulerMarkRef = useRef<HTMLSpanElement>(null);
  const rulerTagRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [activeStoryStep, setActiveStoryStep] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const projectsSectionRef = useRef<HTMLElement>(null);
  const projectsRailRef = useRef<HTMLUListElement>(null);
  const projectAutoTouchedRef = useRef(false);
  const projectScrollTimerRef = useRef(0);
  const projectProgrammaticScrollRef = useRef(false);
  const projectProgrammaticScrollTimerRef = useRef(0);
  const projectWheelCooldownRef = useRef(0);

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
    let pointer: { x: number; y: number } | null = null;
    let touchPointer: { x: number; y: number } | null = null;
    let lastActivity = performance.now();
    let lastFrame = lastActivity;
    let pilotTime = 0;
    let magnetX = 0;
    let magnetY = 0;
    let magnetStrength = 0;

    const movePointer = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      touchPointer = event.pointerType === "touch" ? pointer : null;
      lastActivity = performance.now();
    };

    const animate = (time: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (time - lastFrame) / 1000));
      lastFrame = time;
      const stageRect = stage.getBoundingClientRect();
      const rulerRect = ruler?.getBoundingClientRect();
      const fontSize = Number.parseFloat(getComputedStyle(stage).fontSize) || 100;
      const radius = Math.max(90, fontSize * 1.5);
      const idle = time - lastActivity > 1400;
      let targetX = magnetX;
      let targetY = magnetY;
      let want = 0;

      if (!paused && !reducedMotion) {
        const recentPointer = pointer && time - lastActivity < 2400 ? (touchPointer ?? pointer) : null;
        if (recentPointer) {
          targetX = recentPointer.x - stageRect.left;
          targetY = recentPointer.y - stageRect.top;
          const inside = targetX > -radius && targetX < stageRect.width + radius && targetY > -radius && targetY < stageRect.height + radius;
          if (inside) want = 1;
        } else if (idle && letters.length > 0) {
          pilotTime += dt * 1.35;
          const count = letters.length;
          const position = pilotTime % (2 * count - 2);
          const index = position <= count - 1 ? position : 2 * count - 2 - position;
          const current = letters[Math.round(index)]?.getBoundingClientRect();
          if (current) {
            targetX = current.left - stageRect.left + current.width / 2;
            targetY = current.top - stageRect.top + current.height / 2 + Math.sin(pilotTime * 1.05) * fontSize * 0.12;
            want = 0.9;
          }
        }
      }

      const near = want > 0;
      const ease = 1 - Math.exp(-dt * (near ? 18 : 6));
      magnetX += (targetX - magnetX) * ease;
      magnetY += (targetY - magnetY) * ease;
      magnetStrength += (want - magnetStrength) * (1 - Math.exp(-dt * (want > magnetStrength ? 5 : 2.6)));
      if (magnetStrength < 0.002 && want === 0) magnetStrength = 0;

      letters.forEach((letter, index) => {
        const state = letterStates[index];
        const rect = letter.getBoundingClientRect();
        const dx = rect.left - stageRect.left + rect.width / 2 - magnetX;
        const dy = rect.top - stageRect.top + rect.height / 2 - magnetY;
        const distance = Math.hypot(dx, dy);
        const t = Math.max(0, 1 - distance / radius);
        const influence = t * t * (3 - 2 * t) * magnetStrength;
        const direction = distance > 0.001 ? 1 / distance : 0;
        const force = fontSize * 0.2;
        const goals = [
          dx * direction * force * influence,
          dy * direction * force * influence * 0.72,
          Math.max(-30, Math.min(30, dx / radius * 30 * influence)),
          1 + 0.34 * influence,
          influence,
        ];
        const values = [state.x, state.y, state.rotation, state.scale, state.hot];
        const velocities = [state.vx, state.vy, state.vr, state.vs, state.vh];
        const damping = index === 0 ? 22 : 15;
        const nextValues: number[] = [];
        const nextVelocities: number[] = [];
        for (let i = 0; i < goals.length; i++) {
          const acceleration = (goals[i] - values[i]) * 190 - damping * velocities[i];
          const velocity = velocities[i] + acceleration * dt;
          nextValues.push(values[i] + velocity * dt);
          nextVelocities.push(velocity);
        }
        const [x, y, rotation, scale, hot] = nextValues;
        const [vx, vy, vr, vs, vh] = nextVelocities;
        Object.assign(state, { x, y, rotation, scale, hot, vx, vy, vr, vs, vh });
        letter.style.setProperty("--shift-x", `${x}px`);
        letter.style.setProperty("--shift-y", `${y}px`);
        letter.style.setProperty("--rotate", `${rotation}deg`);
        letter.style.setProperty("--scale", `${scale}`);
        letter.style.setProperty("--hot", `${Math.max(0, Math.min(1, hot))}`);
      });

      if (ruler && rulerMark && rulerTag && rulerRect) {
        const rulerX = Math.max(0, Math.min(rulerRect.width - 1, magnetX));
        rulerMark.style.left = `${rulerX}px`;
        rulerMark.style.opacity = String(Math.max(0.25, Math.min(1, magnetStrength)));
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
    if (!section) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const scrollRange = Math.max(1, rect.height - viewport);
      const progress = Math.max(0, Math.min(0.9999, -rect.top / scrollRange));
      setActiveStoryStep(Math.min(3, Math.floor(progress * 4)));
      section.style.setProperty("--story-progress", `${progress * 100}%`);
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
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const section = projectsSectionRef.current;
    if (!section) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    let visible = false;
    const advance = () => {
      if (projectAutoTouchedRef.current || !visible || reduceMotion) return;
      setActiveProjectIndex((index) => (index + 1) % portfolioProjects.length);
      timer = window.setTimeout(advance, 2600);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      window.clearTimeout(timer);
      if (visible && !projectAutoTouchedRef.current && !reduceMotion) timer = window.setTimeout(advance, 1800);
    }, { threshold: 0.25 });
    observer.observe(section);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const track = projectsRailRef.current;
    const rail = track?.parentElement;
    const activeSlide = track?.querySelector<HTMLElement>(`[data-project-index="${activeProjectIndex}"]`);
    if (!rail || !activeSlide) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let fallback = 0;
    const alignActive = () => {
      const railRect = rail.getBoundingClientRect();
      const slideRect = activeSlide.getBoundingClientRect();
      const slideCenter = rail.scrollLeft + slideRect.left - railRect.left + slideRect.width / 2;
      rail.scrollTo({ left: slideCenter - rail.clientWidth / 2, behavior: reduceMotion ? "auto" : "smooth" });
    };
    const finishExpansion = (event: TransitionEvent) => {
      if (event.propertyName !== "flex-basis") return;
      window.clearTimeout(fallback);
      alignActive();
    };
    activeSlide.addEventListener("transitionend", finishExpansion);
    fallback = window.setTimeout(alignActive, reduceMotion ? 0 : 700);
    return () => {
      window.clearTimeout(fallback);
      activeSlide.removeEventListener("transitionend", finishExpansion);
    };
  }, [activeProjectIndex]);

  useEffect(() => {
    const rail = projectsRailRef.current?.parentElement;
    if (!rail) return;
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const direction = Math.sign(event.deltaY);
      const nextIndex = activeProjectIndex + direction;
      if (nextIndex < 0 || nextIndex >= portfolioProjects.length) return;
      event.preventDefault();
      const now = performance.now();
      const pause = activeProjectIndex === 2 ? 1600 : 720;
      if (now - projectWheelCooldownRef.current < pause) return;
      projectWheelCooldownRef.current = now;
      projectAutoTouchedRef.current = true;
      projectProgrammaticScrollRef.current = true;
      window.clearTimeout(projectProgrammaticScrollTimerRef.current);
      projectProgrammaticScrollTimerRef.current = window.setTimeout(() => {
        projectProgrammaticScrollRef.current = false;
      }, 1400);
      setActiveProjectIndex((index) => Math.max(0, Math.min(portfolioProjects.length - 1, index + direction)));
    };
    rail.addEventListener("wheel", handleWheel, { passive: false });
    return () => rail.removeEventListener("wheel", handleWheel);
  }, [activeProjectIndex]);

  const moveProject = (direction: number) => {
    projectAutoTouchedRef.current = true;
    projectProgrammaticScrollRef.current = true;
    window.clearTimeout(projectProgrammaticScrollTimerRef.current);
    projectProgrammaticScrollTimerRef.current = window.setTimeout(() => {
      projectProgrammaticScrollRef.current = false;
    }, 1400);
    setActiveProjectIndex((index) => (index + direction + portfolioProjects.length) % portfolioProjects.length);
  };

  const selectProject = (index: number) => {
    projectAutoTouchedRef.current = true;
    projectProgrammaticScrollRef.current = true;
    window.clearTimeout(projectProgrammaticScrollTimerRef.current);
    projectProgrammaticScrollTimerRef.current = window.setTimeout(() => {
      projectProgrammaticScrollRef.current = false;
    }, 1400);
    setActiveProjectIndex(index);
  };

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
            <span>02 / DA DESCOBERTA À CONFIANÇA</span>
            <span>QUEBRE O PADRÃO · RAFAEL FONSECA</span>
          </div>

          <div className="credibility-layout">
            <div className="credibility-copy">
              <p className="credibility-kicker"><span /> O PADRÃO QUE VALE A PENA QUEBRAR</p>
              <h2 id="credibility-title">
                Antes da conversa,<br />sua página já fala.
              </h2>
              <div className="story-steps" aria-label="Etapas da experiência de quem visita sua página">
                {[
                  { title: "A descoberta", text: "Alguém recebe seu nome por indicação, encontra um anúncio ou visita seu perfil." },
                  { title: "A clareza", text: "Antes de chamar, procura entender melhor o que você faz e oferece." },
                  { title: "A confiança", text: "Uma presença própria ajuda a apresentar seu negócio com mais clareza." },
                  { title: "O próximo passo", text: "Uma página com intenção organiza a mensagem e deixa o caminho claro." },
                ].map((step, index) => (
                  <article className={`story-step${activeStoryStep === index ? " is-active" : ""}`} key={step.title} aria-current={activeStoryStep === index ? "step" : undefined}>
                    <span className="story-step-number">0{index + 1}</span>
                    <div><h3>{step.title}</h3><p>{step.text}</p></div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="story-preview" data-step={activeStoryStep} aria-label={`Prévia ilustrativa, etapa ${activeStoryStep + 1} de 4`}>
              <div className="preview-topbar"><span className="preview-brand">RF<span>/</span></span><span>QUEBRE O PADRÃO</span><span className="preview-window-dots"><i /><i /><i /></span></div>
              <div className="preview-progress"><span /></div>
              <div className="preview-content">
                <div className="preview-copy" key={activeStoryStep}>
                  <span className="preview-eyebrow">{["A PRIMEIRA IMPRESSÃO", "MENSAGEM COM INTENÇÃO", "UM DADO DE PESQUISA", "O PRÓXIMO PASSO"][activeStoryStep]}</span>
                  {activeStoryStep === 0 && <><p className="preview-headline">Seu trabalho<br /><em>merece ser visto.</em></p><span className="preview-note">Uma presença digital que começa com você.</span></>}
                  {activeStoryStep === 1 && <><p className="preview-headline">Clareza para<br /><em>ser entendido.</em></p><span className="preview-note">O que você faz. Para quem. E como começar.</span></>}
                  {activeStoryStep === 2 && <><p className="preview-stat">66<span>%</span></p><span className="preview-note">dos consumidores pesquisados associam site próprio a mais confiança.</span></>}
                  {activeStoryStep === 3 && <><p className="preview-headline">Vamos criar<br /><em>sua página?</em></p><span className="preview-cta">VAMOS CONVERSAR <ArrowRight size={15} /></span></>}
                </div>
                <div className={`preview-art preview-art-${activeStoryStep}`} aria-hidden="true">
                  <img src="/rafael-fonseca-hero.jpg" alt="" />
                  <span className="preview-art-index">0{activeStoryStep + 1} / 04</span>
                  <span className="preview-art-mark">QUEBRE<br />O PADRÃO</span>
                </div>
              </div>
              <div className="preview-footer"><span>ESTRATÉGIA · DESIGN · PRESENÇA DIGITAL</span><span>0{activeStoryStep + 1} — 04</span></div>
              {activeStoryStep === 2 && <div className="preview-source"><span>Pesquisa Verisign / 451 Research · 5.450 consumidores</span><a href="https://www.verisign.com/assets/Websites_BrandedEmail_Key_SMB_Internet_Services.pdf" target="_blank" rel="noreferrer">VER A FONTE <ArrowRight size={13} /></a></div>}
            </aside>
          </div>

          <div className="credibility-footer">
            <span>DESIGN QUE MOSTRA O QUE TORNA SEU NEGÓCIO PRÓPRIO.</span>
            <span>ROLE PARA EXPLORAR <ArrowDown size={12} /></span>
          </div>
        </div>
      </section>
      <section ref={projectsSectionRef} id="portfolio" className="projects-section" aria-labelledby="projects-title">
        <div className="projects-shell">
          <div className="projects-topline">
            <span>03 / PROJETOS EM DIFERENTES MERCADOS</span>
            <span>RAFAEL FONSECA · SELEÇÃO DE PÁGINAS</span>
          </div>
          <div className="projects-intro">
            <p className="projects-kicker"><span /> PORTFÓLIO DIGITAL</p>
            <h2 id="projects-title">Dez ideias.<br /><em>Dez caminhos.</em></h2>
            <div className="projects-aside">
              <p>Uma seleção de páginas conceito para explorar como estratégia e design mudam de acordo com cada mercado.</p>
              <span><strong>10</strong> PROJETOS NO AR</span>
            </div>
          </div>

          <div className="projects-carousel-tools" aria-label="Navegação do portfólio">
            <button type="button" onClick={() => moveProject(-1)} aria-label="Projeto anterior"><ArrowLeft size={17} /></button>
            <span><strong>{String(activeProjectIndex + 1).padStart(2, "0")}</strong><i>/</i>{String(portfolioProjects.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => moveProject(1)} aria-label="Próximo projeto"><ArrowRight size={17} /></button>
          </div>

          <div
            className="projects-rail"
            role="region"
            aria-label="Projetos do portfólio. Arraste para os lados ou use as setas."
            onPointerDown={() => {
              projectAutoTouchedRef.current = true;
              projectProgrammaticScrollRef.current = false;
              window.clearTimeout(projectProgrammaticScrollTimerRef.current);
            }}
            onScroll={(event) => {
              if (projectProgrammaticScrollRef.current) return;
              const rail = event.currentTarget;
              window.clearTimeout(projectScrollTimerRef.current);
              projectScrollTimerRef.current = window.setTimeout(() => {
                const railRect = rail.getBoundingClientRect();
                const center = railRect.left + rail.clientWidth / 2;
                const slides = Array.from(rail.querySelectorAll<HTMLElement>("[data-project-index]"));
                const nearest = slides.reduce((best, slide) => {
                  const rect = slide.getBoundingClientRect();
                  const distance = Math.abs(rect.left + rect.width / 2 - center);
                  return distance < best.distance ? { index: Number(slide.dataset.projectIndex), distance } : best;
                }, { index: activeProjectIndex, distance: Number.POSITIVE_INFINITY });
                setActiveProjectIndex((current) => nearest.index === current ? current : nearest.index);
              }, 110);
            }}
          >
            <ol className="projects-track" ref={projectsRailRef}>
              {portfolioProjects.map((project, index) => {
                const isActive = activeProjectIndex === index;
                const detailsId = `project-details-${project.number}`;
                return (
                  <li className={`project-slide${isActive ? " is-active" : ""}`} key={project.number} data-project-index={index}>
                    <button
                      className={`project-poster project-visual-${project.theme}`}
                      type="button"
                      aria-expanded={isActive}
                      aria-controls={detailsId}
                      onClick={() => selectProject(index)}
                      onPointerEnter={(event) => {
                        if (event.pointerType !== "mouse") return;
                        if (!isActive) selectProject(index);
                      }}
                      onFocus={() => selectProject(index)}
                      onKeyDown={(event) => {
                        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                        event.preventDefault();
                        const nextIndex = (index + (event.key === "ArrowRight" ? 1 : -1) + portfolioProjects.length) % portfolioProjects.length;
                        moveProject(event.key === "ArrowRight" ? 1 : -1);
                        requestAnimationFrame(() => projectsRailRef.current?.querySelectorAll<HTMLButtonElement>(".project-poster")[nextIndex]?.focus({ preventScroll: true }));
                      }}
                    >
                      <span className="project-poster-topline"><span>RF / DIGITAL</span><span>{project.niche}</span></span>
                      <img className={`project-poster-cover${project.theme === "roadster" ? " project-poster-cover-roadster" : project.theme === "henrique" ? " project-poster-cover-henrique" : project.theme === "prisma" ? " project-poster-cover-prisma" : ""}`} src={project.cover} alt="" loading={index < 3 ? "eager" : "lazy"} decoding="async" />
                      <span className="project-poster-index" aria-hidden="true">{project.number}</span>
                      {project.theme === "roadster" && (
                        <span className="project-poster-copy project-poster-copy-roadster">
                          <span className="project-poster-label">PÁGINA CONCEITO</span>
                          <span className="project-poster-title">{project.name}</span>
                        </span>
                      )}
                      {project.theme !== "roadster" && (
                        <span className="project-poster-copy">
                          <span className="project-poster-label">PÁGINA CONCEITO</span>
                          <span className="project-poster-name">{project.wordmark}</span>
                          <span className="project-poster-title">{project.name}</span>
                        </span>
                      )}
                    </button>
                    <div className="project-details" id={detailsId} aria-hidden={!isActive}>
                      <span className="project-detail-number">PROJETO {project.number} · {project.niche}</span>
                      <h3>{project.name}</h3>
                      <p>{project.descriptor}</p>
                      <a href={project.url} target="_blank" rel="noreferrer" tabIndex={isActive ? 0 : -1}>
                        VISITAR PÁGINA <ArrowUpRight size={16} aria-hidden="true" />
                      </a>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <footer className="projects-footer">
            <div className="projects-footer-count" aria-label="10 projetos em diferentes mercados">
              <span className="projects-footer-markers" aria-hidden="true"><i>01</i><i>02</i><i>03</i></span>
              <span><strong>10 PROJETOS</strong><small>EM DIFERENTES MERCADOS</small></span>
            </div>
            <div className="projects-footer-navigation" aria-label="Navegar entre projetos">
              <button type="button" onClick={() => moveProject(-1)} aria-label="Projeto anterior"><ArrowLeft size={15} /></button>
              <span>{String(activeProjectIndex + 1).padStart(2, "0")} <i>/</i> 10</span>
              <button type="button" onClick={() => moveProject(1)} aria-label="Próximo projeto"><ArrowRight size={15} /></button>
            </div>
            <a className="projects-footer-cta" href={portfolioProjects[activeProjectIndex].url} target="_blank" rel="noreferrer">
              ABRIR {portfolioProjects[activeProjectIndex].name.toUpperCase()} <ArrowUpRight size={14} />
            </a>
          </footer>
        </div>
      </section>
      <div id="contato" className="contact-marker" aria-label="Contato" />
    </main>
  );
}
