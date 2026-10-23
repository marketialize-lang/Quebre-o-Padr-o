import { createFileRoute } from "@tanstack/react-router";
import { FaqAssistant } from "@/components/faq-assistant";
import { BriefingForm, type BriefingPlan } from "@/components/briefing-form";
import { ExitDiscountPopup } from "@/components/exit-discount-popup";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Instagram, Pause, Play, ShieldCheck, Shuffle } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";

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

const servicePlans = [
  {
    number: "01",
    name: "Página objetiva",
    description: "Para apresentar seu serviço ou oferta com uma estrutura direta e bem organizada.",
    price: 497,
    supportDays: 7,
    timeline: { days: 2, label: "dias" },
    emphasis: "Uma página mais direta",
  },
  {
    number: "02",
    name: "Página estratégica",
    description: "Para projetos que precisam apresentar mais contexto e organizar diferentes partes da oferta.",
    price: 1000,
    supportDays: 30,
    timeline: { days: 3, label: "dias úteis" },
    emphasis: "Mais camadas de conteúdo",
  },
  {
    number: "03",
    name: "Página completa",
    description: "Para uma apresentação mais elaborada, com estrutura e copy persuasiva.",
    price: 1500,
    supportDays: 60,
    timeline: { days: 3, label: "dias úteis" },
    emphasis: "Estrutura e copy persuasiva",
  },
];

const fitProfiles = [
  { match: true, title: "Quero apresentar meu serviço com mais clareza.", detail: "PÁGINA OBJETIVA · A PARTIR DE R$ 497" },
  { match: true, title: "Estou lançando uma oferta e preciso de uma página própria.", detail: "ESTRUTURA PENSADA PARA A SUA OFERTA" },
  { match: true, title: "Meu negócio cresceu e a presença digital precisa acompanhar.", detail: "PÁGINA OU SITE ALINHADO AO ESCOPO" },
  { match: true, title: "Quero organizar melhor as informações para meus clientes.", detail: "CONTEÚDO DEFINIDO EM BRIEFING" },
  { match: false, title: "Espero que o site, sozinho, garanta vendas ou resultados.", detail: "RESULTADOS TAMBÉM DEPENDEM DE OUTROS FATORES" },
  { match: false, title: "Ainda não quero participar do briefing nem definir o projeto.", detail: "TODO PROJETO COMEÇA COM ALINHAMENTO" },
];

const processSteps = [
  { label: "ALINHAMENTO", title: "Tudo começa pelo briefing.", description: "Entendo seu negócio, seus objetivos, seu público e o que a página precisa comunicar.", screen: "Briefing recebido", note: "Objetivos e conteúdo mapeados", time: "ETAPA 01" },
  { label: "ESTRUTURA", title: "Organizamos a mensagem.", description: "Definimos a ordem das informações e a estrutura mais adequada ao escopo do projeto.", screen: "Estrutura definida", note: "Seções organizadas para o seu projeto", time: "ETAPA 02" },
  { label: "DESIGN E DESENVOLVIMENTO", title: "A página ganha forma.", description: "Design e desenvolvimento trabalham juntos para apresentar sua marca com clareza e intenção.", screen: "Página em construção", note: "Design aplicado ao conteúdo aprovado", time: "ETAPA 03" },
  { label: "REVISÃO E ENTREGA", title: "Conferimos e colocamos no ar.", description: "Depois dos ajustes previstos no escopo, você recebe a página pronta para compartilhar.", screen: "Projeto publicado", note: "Revisado e pronto para acessar", time: "ETAPA 04" },
];

const portfolioStoryExamples = [
  "Quero que a página mostre a ideia do projeto antes mesmo de explicar cada detalhe.",
  "É mais fácil entender a proposta quando as informações estão bem organizadas.",
  "Uma apresentação visual marcante ajuda a contar a história desse conceito.",
  "A identidade do projeto aparece sem competir com a mensagem.",
  "Ficou mais simples mostrar o que torna essa ideia diferente.",
  "O visual combina com o mercado em que esse projeto se apresenta.",
  "Agora há um caminho claro para conhecer e explorar esse conceito.",
];

function PriceOdometer({ value, className = "" }: { value: number; className?: string }) {
  const formatted = value.toLocaleString("pt-BR");
  const digitCount = (formatted.match(/\d/g) ?? []).length;
  let digitPosition = 0;
  return (
    <span className={`pricing-amount${className ? ` ${className}` : ""}`} aria-hidden="true">
      {formatted.split("").map((character, index) => {
        if (!/\d/.test(character)) return <span className="pricing-thousands" key={`separator-${index}`}>{character}</span>;
        const rollTo = Number(character) + 10 * (digitCount - digitPosition);
        const wheelOrder = digitPosition++;
        return (
          <span className="pricing-digit-window" key={`digit-${index}`}>
            <span className="pricing-digit-strip" data-wheel-index={rollTo} style={{ "--wheel-delay": `${wheelOrder * 95}ms` } as CSSProperties}>
              {Array.from({ length: 50 }, (_, digit) => <span key={digit}>{digit % 10}</span>)}
            </span>
          </span>
        );
      })}
    </span>
  );
}

function PortfolioStories() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ id: number; x: number; y: number; held: boolean } | null>(null);
  const holdTimerRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [isPageHidden, setIsPageHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const activeProject = portfolioProjects[activeIndex]!;
  const paused = isPaused || isHovered || hasFocus || isHolding || isPageHidden || !isInView;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver((entries) => setIsInView(entries[0]!.isIntersecting && entries[0]!.intersectionRatio > 0.12), { threshold: [0, 0.12, 0.3, 0.5] });
    observer.observe(section);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(media.matches);
    const updateVisibility = () => setIsPageHidden(document.hidden);
    updateMotionPreference();
    updateVisibility();
    media.addEventListener("change", updateMotionPreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateMotionPreference);
      document.removeEventListener("visibilitychange", updateVisibility);
      window.clearTimeout(holdTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (paused || prefersReducedMotion) return;
    const timer = window.setTimeout(() => setActiveIndex((current) => (current + 1) % portfolioStoryExamples.length), 5600);
    return () => window.clearTimeout(timer);
  }, [activeIndex, paused, prefersReducedMotion]);

  const selectStory = (index: number) => {
    setActiveIndex((index + portfolioStoryExamples.length) % portfolioStoryExamples.length);
    const rail = railRef.current;
    const button = document.getElementById(`portfolio-story-tab-${index}`);
    if (rail && button && rail.scrollWidth > rail.clientWidth + 2) {
      rail.scrollTo({ left: button.offsetLeft - (rail.clientWidth - button.offsetWidth) / 2, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  const finishPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    window.clearTimeout(holdTimerRef.current);
    const wasHolding = pointer.held;
    pointerRef.current = null;
    if (wasHolding) { setIsHolding(false); return; }
    const deltaX = event.clientX - pointer.x;
    const deltaY = event.clientY - pointer.y;
    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) selectStory(activeIndex + (deltaX < 0 ? 1 : -1));
  };

  return (
    <section ref={sectionRef} className={`portfolio-stories${paused || prefersReducedMotion ? " is-paused" : ""}`} aria-labelledby="portfolio-stories-title" onFocusCapture={() => setHasFocus(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHasFocus(false); }}>
      <div className="portfolio-stories-shell">
        <div className="portfolio-stories-copy">
          <p className="portfolio-stories-kicker"><span /> 07 / STORIES DE PROJETOS</p>
          <p className="portfolio-stories-disclosure">DEMONSTRAÇÃO · FALAS FICTÍCIAS</p>
          <h2 id="portfolio-stories-title">Uma ideia bem apresentada<br /><em>fica na memória.</em></h2>
          <p className="portfolio-stories-lead">Explore cenários ilustrativos inspirados nos projetos conceito do portfólio.</p>
          <p className="portfolio-stories-notice">As falas são fictícias e não representam relatos de clientes nem resultados reais.</p>

          <div ref={railRef} className="portfolio-stories-rail" role="tablist" aria-label="Escolha um projeto conceito">
            {portfolioProjects.slice(0, portfolioStoryExamples.length).map((project, index) => (
              <button className={`portfolio-story-tab${activeIndex === index ? " is-active" : ""}`} type="button" role="tab" aria-selected={activeIndex === index} aria-controls="portfolio-story-panel" id={`portfolio-story-tab-${index}`} key={project.number} onClick={() => selectStory(index)} onKeyDown={(event) => {
                if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const next = event.key === "Home" ? 0 : event.key === "End" ? portfolioStoryExamples.length - 1 : activeIndex + (event.key === "ArrowRight" ? 1 : -1);
                selectStory(next);
                document.getElementById(`portfolio-story-tab-${(next + portfolioStoryExamples.length) % portfolioStoryExamples.length}`)?.focus();
              }}>
                <span className="portfolio-story-ring"><span>{project.number}</span></span>
                <span className="portfolio-story-tab-name">{project.name}</span>
              </button>
            ))}
          </div>

          <div className="portfolio-stories-controls">
            <button type="button" className="portfolio-stories-arrow" aria-label="Projeto anterior" onClick={() => selectStory(activeIndex - 1)}><ArrowLeft size={16} /></button>
            <span className="portfolio-stories-count">{String(activeIndex + 1).padStart(2, "0")} <i>/</i> {String(portfolioStoryExamples.length).padStart(2, "0")}</span>
            <button type="button" className="portfolio-stories-arrow" aria-label="Próximo projeto" onClick={() => selectStory(activeIndex + 1)}><ArrowRight size={16} /></button>
            <button type="button" className="portfolio-stories-pause" aria-pressed={isPaused} onClick={() => setIsPaused((value) => !value)}>
              {isPaused ? <Play size={14} /> : <Pause size={14} />}{isPaused ? "RETOMAR" : "PAUSAR"}
            </button>
          </div>
        </div>

        <div className="portfolio-stories-viewer" onPointerEnter={(event) => { if (event.pointerType === "mouse") setIsHovered(true); }} onPointerLeave={(event) => { if (event.pointerType === "mouse") setIsHovered(false); }}>
          <span className="portfolio-stories-glow" aria-hidden="true" />
          <div className="portfolio-stories-phone">
            <div className="portfolio-stories-screen" onPointerDown={(event) => {
              if (event.button !== 0 || (event.target as HTMLElement).closest("a,button")) return;
              pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, held: false };
              holdTimerRef.current = window.setTimeout(() => { if (pointerRef.current) { pointerRef.current.held = true; setIsHolding(true); } }, 260);
            }} onPointerUp={finishPointer} onPointerCancel={(event) => { window.clearTimeout(holdTimerRef.current); if (pointerRef.current?.id === event.pointerId) { pointerRef.current = null; setIsHolding(false); } }}>
              <div className="portfolio-stories-progress" aria-hidden="true">
                {portfolioStoryExamples.map((_, index) => <span key={index} className={index < activeIndex ? "is-done" : index === activeIndex ? "is-current" : ""}><i key={activeIndex === index ? activeIndex : undefined} /></span>)}
              </div>
              <div className="portfolio-stories-profile"><span className="portfolio-stories-avatar">{activeProject.number}</span><span><strong>{activeProject.name}</strong><small>{activeProject.niche} · CONCEITO</small></span><span className="portfolio-stories-time">EXEMPLO</span></div>
              <div className="portfolio-stories-story" id="portfolio-story-panel" role="tabpanel" aria-labelledby={`portfolio-story-tab-${activeIndex}`} key={activeProject.number}>
                <span className="portfolio-stories-story-label">CENÁRIO FICTÍCIO · {activeProject.niche}</span>
                <blockquote>“{portfolioStoryExamples[activeIndex]}”</blockquote>
                <span className="portfolio-stories-sticker">EXEMPLO ILUSTRATIVO</span>
              </div>
              <a className="portfolio-stories-visit" href={activeProject.url} target="_blank" rel="noreferrer">VER PÁGINA CONCEITO <ArrowUpRight size={14} /></a>
              <div className="portfolio-stories-touch-hint" aria-hidden="true">SEGURE PARA PAUSAR · DESLIZE PARA TROCAR</div>
            </div>
          </div>
          <span className="portfolio-stories-caption">{activeProject.name} · {activeProject.niche}</span>
        </div>
      </div>

      <div className="portfolio-stories-footer">
        <div><strong>10</strong><span>PROJETOS CONCEITO</span></div>
        <div><strong>10</strong><span>SEGMENTOS</span></div>
        <div className="portfolio-stories-footer-note">CENÁRIOS E FALAS FICTÍCIAS, APENAS PARA DEMONSTRAR O FORMATO</div>
      </div>
    </section>
  );
}

const guaranteeConcerns = [
  { label: "Escopo indefinido", weight: "ESCOPO", response: "O escopo é alinhado antes de começar." },
  { label: "Pagar antes da entrega", weight: "PAGAMENTO", response: "O pagamento acontece após o alinhamento e a entrega." },
  { label: "Dúvidas depois", weight: "SUPORTE", response: "O suporte segue o período do plano contratado." },
];

type GuaranteePlacement = { index: number; side: "client" | "commitment"; phase: "falling" | "dust" | "settled" };

function ProjectGuarantee({ openBriefing }: { openBriefing: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const scaleRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ pointerId: number; index: number; x: number; y: number; moved: boolean } | null>(null);
  const skipClickRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [placement, setPlacement] = useState<GuaranteePlacement | null>(null);
  const [announcement, setAnnouncement] = useState("Escolha um ponto para ver como ele vira um compromisso claro.");
  const tilt = placement?.phase === "falling" && placement.side === "client" ? -8 : 8;
  const panLeftY = tilt < 0 ? 146 : 98;
  const panRightY = tilt > 0 ? 146 : 98;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver((entries) => setIsVisible(entries[0]!.isIntersecting), { threshold: 0.12 });
    observer.observe(section);
    return () => {
      observer.disconnect();
      timersRef.current.forEach(window.clearTimeout);
    };
  }, []);

  const placeConcern = (index: number, side: GuaranteePlacement["side"]) => {
    timersRef.current.forEach(window.clearTimeout);
    const concern = guaranteeConcerns[index]!;
    setPlacement({ index, side, phase: "falling" });
    setAnnouncement(side === "client" ? `${concern.label} colocado no prato Seu lado.` : `${concern.label} levado ao prato Nosso compromisso.`);
    timersRef.current = [
      window.setTimeout(() => setPlacement((current) => current?.index === index ? { ...current, phase: "dust" } : current), 780),
      window.setTimeout(() => {
        setPlacement({ index, side: "commitment", phase: "settled" });
        setAnnouncement(`${concern.label}: ${concern.response}`);
      }, side === "client" ? 1540 : 820),
    ];
  };

  const handleConcernPointerDown = (event: ReactPointerEvent<HTMLButtonElement>, index: number) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    dragRef.current = { pointerId: event.pointerId, index, x: event.clientX, y: event.clientY, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleConcernPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 10) drag.moved = true;
  };

  const handleConcernPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.moved) return;
    skipClickRef.current = true;
    window.setTimeout(() => { skipClickRef.current = false; }, 0);
    const bounds = scaleRef.current?.getBoundingClientRect();
    if (!bounds || event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) return;
    placeConcern(drag.index, event.clientX < bounds.left + bounds.width / 2 ? "client" : "commitment");
  };

  return (
    <section ref={sectionRef} className={`project-guarantee${isVisible ? " is-visible" : ""}`} aria-labelledby="guarantee-title">
      <div className="project-guarantee-shell">
        <div className="project-guarantee-copy">
          <p className="project-guarantee-kicker"><span /> 08 / GARANTIA E COMPROMISSO</p>
          <p className="project-guarantee-label"><ShieldCheck size={15} aria-hidden="true" /> COMBINADOS CLAROS EM CADA PLANO</p>
          <h2 id="guarantee-title">Clareza no escopo.<br /><em>Compromisso na entrega.</em></h2>
          <p className="project-guarantee-lead">Você só paga depois que o escopo estiver alinhado e o projeto for entregue. O suporte acompanha o plano escolhido.</p>

          <ol className="project-guarantee-terms">
            <li><span>I</span><p><strong>Alinhamento antes de começar.</strong> O briefing define o escopo do projeto.</p></li>
            <li><span>II</span><p><strong>Pagamento após alinhamento e entrega.</strong> Você recebe o projeto antes de pagar.</p></li>
            <li><span>III</span><p><strong>Suporte conforme o plano contratado.</strong> Cada opção tem um período definido.</p></li>
          </ol>

        </div>

        <div className="project-guarantee-stage">
          <div className="project-guarantee-scale-wrap">
            <span className="project-guarantee-halo" aria-hidden="true" />
            <svg ref={scaleRef} className="project-guarantee-scale" viewBox="0 0 560 445" role="img" aria-label="Balança ilustrativa dos compromissos do projeto">
              <defs>
                <linearGradient id="guarantee-brass" x1="0" x2="0" y2="1"><stop offset="0" stopColor="#f1d9a6" /><stop offset=".52" stopColor="#bc965a" /><stop offset="1" stopColor="#806039" /></linearGradient>
                <linearGradient id="guarantee-pan" x1="0" x2="0" y2="1"><stop offset="0" stopColor="#ead3a0" /><stop offset="1" stopColor="#8b6939" /></linearGradient>
                <radialGradient id="guarantee-shadow"><stop offset="0" stopColor="#111" stopOpacity=".2" /><stop offset="1" stopColor="#111" stopOpacity="0" /></radialGradient>
              </defs>
              <circle cx="280" cy="236" r="198" fill="rgba(255,255,255,.62)" />
              <circle cx="280" cy="236" r="210" fill="none" stroke="rgba(176,141,87,.24)" />
              <ellipse cx="280" cy="425" rx="150" ry="11" fill="url(#guarantee-shadow)" />
              <path d="M24 426H536" stroke="rgba(17,17,17,.16)" />
              <rect x="203" y="405" width="154" height="18" rx="4" fill="url(#guarantee-brass)" />
              <rect x="225" y="389" width="110" height="18" rx="4" fill="url(#guarantee-brass)" />
              <path d="M269 390L274 133h12l5 257z" fill="url(#guarantee-brass)" />
              <path d="M280 126L242 69a73 73 0 0 1 76 0z" fill="#f8f2e7" stroke="#b08d57" strokeWidth="2" />
              <path d="M250 77l-5-8m14 4-4-11m15 10-2-12m12 12V59m12 13 2-12m11 14 4-11m9 14 5-8" fill="none" stroke="#8b6939" strokeWidth="2" />
              <text x="238" y="103" textAnchor="end" className="project-guarantee-dial">SEU LADO</text>
              <text x="322" y="103" className="project-guarantee-dial">NOSSO LADO</text>
              <g className="project-guarantee-beam" transform={`rotate(${tilt} 280 126)`}>
                <path d="M91 122l189-7 189 7v8l-189 8-189-8z" fill="url(#guarantee-brass)" />
                <circle cx="94" cy="126" r="7" fill="#a98349" /><circle cx="466" cy="126" r="7" fill="#a98349" />
                <circle cx="280" cy="126" r="15" fill="#a98349" /><circle cx="280" cy="126" r="5" fill="#554022" />
              </g>
              <g className="project-guarantee-pan" transform={`translate(103 ${panLeftY})`}>
                <path d="M0 0v27m-78 0v123m78-123v123m78-123v123" fill="none" stroke="#927344" strokeWidth="2" strokeDasharray="2 5" />
                <rect x="-82" y="27" width="164" height="7" rx="3" fill="url(#guarantee-brass)" />
                {placement?.side === "client" && <g className={`project-guarantee-weight project-guarantee-client-weight is-${placement.phase}`} transform="translate(0 99)"><g className="project-guarantee-weight-motion"><rect x="-72" y="-10" width="144" height="23" rx="4" fill="#f4f1ea" stroke="#b08d57" /><text y="5" textAnchor="middle">{guaranteeConcerns[placement.index]?.weight}</text></g></g>}
                <path d="M-90 151H90c-7 24-37 33-90 33s-83-9-90-33z" fill="url(#guarantee-pan)" />
                <rect x="-93" y="147" width="186" height="7" rx="3" fill="url(#guarantee-brass)" />
                <text className="project-guarantee-plate-label" y="211" textAnchor="middle">SEU LADO</text>
              </g>
              <g className="project-guarantee-pan" transform={`translate(457 ${panRightY})`}>
                <path d="M0 0v27m-78 0v123m78-123v123m78-123v123" fill="none" stroke="#927344" strokeWidth="2" strokeDasharray="2 5" />
                <rect x="-82" y="27" width="164" height="7" rx="3" fill="url(#guarantee-brass)" />
                {servicePlans.map((plan, index) => <g className={`project-guarantee-weight project-guarantee-commitment${isVisible ? " is-entered" : ""}`} style={{ "--weight-delay": `${index * 220}ms` } as CSSProperties} transform={`translate(0 ${91 + index * 22})`} key={plan.number}><g className="project-guarantee-weight-drop"><rect x="-75" y="-9" width="150" height="19" rx="4" fill="#c32f1b" /><text y="4" textAnchor="middle">SUPORTE · {plan.supportDays} DIAS</text></g></g>)}
                {placement?.side === "commitment" && <g className={`project-guarantee-weight is-${placement.phase}${placement.phase === "settled" ? " is-returning" : ""}`} transform="translate(0 60)"><g className="project-guarantee-weight-motion"><rect x="-75" y="-9" width="150" height="19" rx="4" fill="#111" /><text y="4" textAnchor="middle">{guaranteeConcerns[placement.index]?.weight} ALINHADO</text></g></g>}
                <path d="M-90 151H90c-7 24-37 33-90 33s-83-9-90-33z" fill="url(#guarantee-pan)" />
                <rect x="-93" y="147" width="186" height="7" rx="3" fill="url(#guarantee-brass)" />
                <text className="project-guarantee-plate-label" y="211" textAnchor="middle">NOSSO COMPROMISSO</text>
              </g>
              {placement?.phase === "dust" && Array.from({ length: 9 }, (_, index) => {
                const angle = (index / 9) * Math.PI * 2;
                const x = placement.side === "client" ? 103 : 457;
                const y = (placement.side === "client" ? panLeftY + 99 : panRightY + 60);
                return <circle key={index} className="project-guarantee-dust" style={{ "--dust-index": index, "--dust-x": `${Math.cos(angle) * 24}px`, "--dust-y": `${Math.sin(angle) * 19}px` } as CSSProperties} cx={x} cy={y} r="3" />;
              })}
            </svg>
          </div>

          <div className="project-guarantee-support">
            <p>SUPORTE EM CADA PLANO</p>
            <div>{servicePlans.map((plan) => <article key={plan.number}><span>PLANO {plan.number}</span><strong>{plan.name}</strong><b>{plan.supportDays} dias <small>de suporte</small></b></article>)}</div>
          </div>

          <div className="project-guarantee-tray">
            <div className="project-guarantee-tray-title"><span>SEUS PONTOS</span><span>Arraste para a balança ou toque</span></div>
            <div className="project-guarantee-chips">{guaranteeConcerns.map((concern, index) => <button type="button" key={concern.weight} onClick={() => { if (!skipClickRef.current) placeConcern(index, "client"); }} onPointerDown={(event) => handleConcernPointerDown(event, index)} onPointerMove={handleConcernPointerMove} onPointerUp={handleConcernPointerUp} onPointerCancel={() => { dragRef.current = null; }} onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); placeConcern(index, event.key === "ArrowLeft" ? "client" : "commitment"); } }} aria-label={`${concern.label}. Enter pesa no seu lado; setas esquerda e direita escolhem o lado.`}>{concern.label}<ArrowUpRight size={12} aria-hidden="true" /></button>)}</div>
            <p className="project-guarantee-status" aria-live="polite">{announcement}</p>
          </div>
        </div>
        <div className="project-guarantee-action">
          <a href="#briefing" onClick={(event) => { event.preventDefault(); openBriefing(); }}>VAMOS ALINHAR SEU PROJETO <ArrowUpRight size={15} aria-hidden="true" /></a>
          <span>Escopo e condições apresentados no briefing.</span>
        </div>
      </div>

      <footer className="project-guarantee-footer"><span>RAFAEL FONSECA · ESCOPO ALINHADO, ENTREGA E SUPORTE</span><a href="#briefing" onClick={(event) => { event.preventDefault(); openBriefing(); }}>CONVERSAR SOBRE MEU PROJETO <ArrowUpRight size={13} /></a></footer>
    </section>
  );
}


function Index() {
  const stageRef = useRef<HTMLDivElement>(null);
  const credibilitySectionRef = useRef<HTMLElement>(null);
  const pricingTrackRef = useRef<HTMLDivElement>(null);
  const pricingShadeRef = useRef<HTMLDivElement>(null);
  const pricingLensRef = useRef<SVGGElement>(null);
  const pricingBladesRef = useRef<SVGGElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const rulerMarkRef = useRef<HTMLSpanElement>(null);
  const rulerTagRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [activeStoryStep, setActiveStoryStep] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [pricingMode, setPricingMode] = useState<"investment" | "timeline">("investment");
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [briefingPlan, setBriefingPlan] = useState<BriefingPlan | undefined>();
  const [fitAnswers, setFitAnswers] = useState<boolean[]>([]);
  const [fitDragX, setFitDragX] = useState(0);
  const [fitExitDirection, setFitExitDirection] = useState<"yes" | "no" | null>(null);
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const processSectionRef = useRef<HTMLElement>(null);
  const processAutoTouchedRef = useRef(false);
  const fitPointerStart = useRef<number | null>(null);
  const fitExitTimerRef = useRef(0);
  const projectsSectionRef = useRef<HTMLElement>(null);
  const projectsRailRef = useRef<HTMLOListElement>(null);
  const projectAutoTouchedRef = useRef(false);
  const projectWheelCooldownRef = useRef(0);
  const projectSuppressClickRef = useRef(false);
  const projectKickRef = useRef<() => void>(() => {});
  const projectMotionRef = useRef<{
    x: number;
    velocity: number;
    target: number | null;
    frame: number;
    lastTime: number;
    drag: { pointerId: number; startX: number; startY: number; originX: number; lastTime: number; moved: number; velocity: number; axis: "horizontal" | "vertical" | null } | null;
    settleOnStop: boolean;
  }>({ x: 0, velocity: 0, target: null, frame: 0, lastTime: 0, drag: null, settleOnStop: false });

  useEffect(() => {
    const track = projectsRailRef.current;
    const rail = track?.parentElement;
    if (!track || !rail) return;
    const motion = projectMotionRef.current;
    const minX = () => Math.min(0, rail.clientWidth - track.scrollWidth);
    const settleOnNearestProject = () => {
      const center = rail.clientWidth / 2 - motion.x;
      const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-project-index]"));
      const nearest = slides.reduce((best, slide) => {
        const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
        return distance < best.distance ? { index: Number(slide.dataset["projectIndex"]), distance } : best;
      }, { index: activeProjectIndex, distance: Number.POSITIVE_INFINITY });
      setActiveProjectIndex((current) => current === nearest.index ? current : nearest.index);
    };
    const animate = (time: number) => {
      motion.frame = 0;
      const dt = motion.lastTime ? Math.min(.05, (time - motion.lastTime) / 1000) : 1 / 60;
      motion.lastTime = time;
      let moving = false;

      if (!motion.drag) {
        if (motion.target !== null) {
          motion.x += (motion.target - motion.x) * Math.min(1, dt * 6);
          if (Math.abs(motion.target - motion.x) < .5) {
            motion.x = motion.target;
            motion.target = null;
          } else moving = true;
        } else if (Math.abs(motion.velocity) > 5) {
          motion.x += motion.velocity * dt;
          motion.velocity *= Math.exp(-dt * 4);
          moving = true;
        } else motion.velocity = 0;

        const boundary = minX();
        if (motion.x > 0) {
          if (motion.x < .5) motion.x = 0;
          else {
            motion.x += (0 - motion.x) * Math.min(1, dt * 10);
            moving = true;
          }
        } else if (motion.x < boundary) {
          if (boundary - motion.x < .5) motion.x = boundary;
          else {
            motion.x += (boundary - motion.x) * Math.min(1, dt * 10);
            moving = true;
          }
        }
      }

      track.style.transform = `translate3d(${motion.x.toFixed(2)}px, 0, 0)`;
      if (moving || motion.drag) motion.frame = requestAnimationFrame(animate);
      else {
        motion.lastTime = 0;
        if (motion.settleOnStop) {
          motion.settleOnStop = false;
          settleOnNearestProject();
        }
      }
    };
    const kick = () => {
      if (!motion.frame) motion.frame = requestAnimationFrame(animate);
    };
    projectKickRef.current = kick;
    const resizeObserver = new ResizeObserver(() => {
      if (motion.drag) return;
      const activeSlide = track.querySelector<HTMLElement>(".project-slide.is-active");
      const desired = activeSlide ? rail.clientWidth / 2 - (activeSlide.offsetLeft + activeSlide.offsetWidth / 2) : motion.x;
      motion.target = Math.max(minX(), Math.min(0, desired));
      kick();
    });
    resizeObserver.observe(rail);
    return () => {
      resizeObserver.disconnect();
      projectKickRef.current = () => {};
      if (motion.frame) cancelAnimationFrame(motion.frame);
    };
  }, []);

  useEffect(() => {
    const section = processSectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    let timer = 0;
    const advance = () => {
      if (!visible || processAutoTouchedRef.current) return;
      setActiveProcessStep((current) => (current + 1) % processSteps.length);
      timer = window.setTimeout(advance, 2800);
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]!.isIntersecting;
      window.clearTimeout(timer);
      if (visible && !processAutoTouchedRef.current) timer = window.setTimeout(advance, 1100);
    }, { threshold: 0.35 });

    observer.observe(section);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const track = pricingTrackRef.current;
    const shade = pricingShadeRef.current;
    const lens = pricingLensRef.current;
    const bladesGroup = pricingBladesRef.current;
    const stage = track?.querySelector<HTMLElement>(".pricing-entry-stage");
    const copy = stage?.querySelector<HTMLElement>(".pricing-entry-copy");
    if (!track || !shade || !lens || !bladesGroup || !stage || !copy) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blades = Array.from(bladesGroup.querySelectorAll<SVGPathElement>("path"));
    const bladeCount = blades.length;
    const outerRadius = 430;
    let cameraActive = false;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reduceMotion) {
        if (cameraActive) { cameraActive = false; track.classList.remove("is-camera-active"); }
        track.style.setProperty("--iris-progress", "1");
        shade.style.setProperty("--iris-clear-radius", "150vmax");
        lens.style.opacity = "0";
        return;
      }

      const rect = track.getBoundingClientRect();
      const distance = Math.max(1, rect.height - stage.offsetHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / distance));
      const active = rect.top < window.innerHeight && rect.bottom > 0;
      if (cameraActive !== active) {
        cameraActive = active;
        track.classList.toggle("is-camera-active", active);
      }
      const radius = 12 + 410 * Math.pow(progress, 1.45);
      const clearRadius = Math.hypot(window.innerWidth, window.innerHeight) * 0.72 * Math.pow(progress, 1.1);
      track.style.setProperty("--iris-progress", String(progress));
      const revealProgress = Math.max(0, Math.min(1, (progress - 0.32) / 0.46));
      stage.style.setProperty("--camera-paper-cover", String(1 - revealProgress));
      copy.style.opacity = String(Math.max(0, 1 - progress / 0.28));
      shade.style.setProperty("--iris-clear-radius", `${clearRadius}px`);
      lens.style.opacity = String(Math.max(0, Math.min(1, (0.94 - progress) / 0.23)));
      lens.style.transform = `scale(${0.88 + progress * 1.12}) rotate(${progress * 28}deg)`;

      const points = Array.from({ length: bladeCount }, (_, index) => {
        const angle = -Math.PI / 2 + index * (2 * Math.PI / bladeCount);
        return [radius * Math.cos(angle), radius * Math.sin(angle)] as const;
      });

      blades.forEach((blade, index) => {
        const [x1, y1] = points[index] ?? ([0, 0] as const);
        const [x2, y2] = points[(index + 1) % bladeCount] ?? ([0, 0] as const);
        let dx = x2 - x1;
        let dy = y2 - y1;
        const length = Math.hypot(dx, dy) || 1;
        dx /= length;
        dy /= length;
        const projection = x1 * dx + y1 * dy;
        const constant = x1 * x1 + y1 * y1 - outerRadius * outerRadius;
        const discriminant = Math.sqrt(Math.max(0, projection * projection - constant));
        const ax = x1 + (-projection - discriminant) * dx;
        const ay = y1 + (-projection - discriminant) * dy;
        const bx = x1 + (-projection + discriminant) * dx;
        const by = y1 + (-projection + discriminant) * dy;
        const sweep = bx * ay - by * ax > 0 ? 1 : 0;
        blade.setAttribute("d", `M${ax.toFixed(1)} ${ay.toFixed(1)}L${bx.toFixed(1)} ${by.toFixed(1)}A${outerRadius} ${outerRadius} 0 0 ${sweep} ${ax.toFixed(1)} ${ay.toFixed(1)}Z`);
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("pageshow", requestUpdate);
    update();
    window.requestAnimationFrame(() => window.requestAnimationFrame(requestUpdate));
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("pageshow", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const prices = Array.from(document.querySelectorAll<HTMLElement>(".pricing-roll-line"));
    if (!prices.length) return;
    prices.forEach((price) => {
      price.classList.remove("is-rolling");
      price.querySelectorAll<HTMLElement>(".pricing-digit-strip").forEach((strip) => {
        strip.style.transition = "none";
        strip.style.transform = "translateY(0em)";
      });
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        window.requestAnimationFrame(() => {
          entry.target.classList.add("is-rolling");
          entry.target.querySelectorAll<HTMLElement>(".pricing-digit-strip").forEach((strip) => {
            strip.style.transition = "";
            strip.style.transform = `translateY(-${strip.dataset["wheelIndex"]}em)`;
          });
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    prices.forEach((price) => observer.observe(price));
    return () => observer.disconnect();
  }, [pricingMode]);

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
        const state = letterStates[index]!;
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
          const acceleration = (goals[i]! - values[i]!) * 190 - damping * velocities[i]!;
          const velocity = velocities[i]! + acceleration * dt;
          nextValues.push(values[i]! + velocity * dt);
          nextVelocities.push(velocity);
        }
        const [x = 0, y = 0, rotation = 0, scale = 1, hot = 0] = nextValues;
        const [vx = 0, vy = 0, vr = 0, vs = 0, vh = 0] = nextVelocities;
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
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const narrowViewportQuery = window.matchMedia("(max-width: 640px)");
    let touchDevice = coarsePointerQuery.matches || narrowViewportQuery.matches;
    let timer = 0;
    let visible = false;
    const advance = () => {
      if (projectAutoTouchedRef.current || !visible || reduceMotion || touchDevice) return;
      setActiveProjectIndex((index) => (index + 1) % portfolioProjects.length);
      timer = window.setTimeout(advance, 2600);
    };
    const syncDeviceMode = () => {
      touchDevice = coarsePointerQuery.matches || narrowViewportQuery.matches;
      window.clearTimeout(timer);
      if (visible && !projectAutoTouchedRef.current && !reduceMotion && !touchDevice) {
        timer = window.setTimeout(advance, 1800);
      }
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]!.isIntersecting;
      window.clearTimeout(timer);
      if (visible && !projectAutoTouchedRef.current && !reduceMotion && !touchDevice) timer = window.setTimeout(advance, 1800);
    }, { threshold: 0.25 });
    observer.observe(section);
    coarsePointerQuery.addEventListener("change", syncDeviceMode);
    narrowViewportQuery.addEventListener("change", syncDeviceMode);
    window.addEventListener("resize", syncDeviceMode, { passive: true });
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      coarsePointerQuery.removeEventListener("change", syncDeviceMode);
      narrowViewportQuery.removeEventListener("change", syncDeviceMode);
      window.removeEventListener("resize", syncDeviceMode);
    };
  }, []);

  useEffect(() => {
    const track = projectsRailRef.current;
    const rail = track?.parentElement;
    const activeSlide = track?.querySelector<HTMLElement>(`[data-project-index="${activeProjectIndex}"]`);
    if (!rail || !activeSlide) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motion = projectMotionRef.current;
    let fallback = 0;
    const alignActive = () => {
      const minimum = Math.min(0, rail.clientWidth - track!.scrollWidth);
      const target = Math.max(minimum, Math.min(0, rail.clientWidth / 2 - (activeSlide.offsetLeft + activeSlide.offsetWidth / 2)));
      motion.velocity = 0;
      motion.settleOnStop = false;
      if (reduceMotion) {
        motion.x = target;
        motion.target = null;
        track!.style.transform = `translate3d(${target.toFixed(2)}px, 0, 0)`;
        return;
      }
      motion.target = target;
      projectKickRef.current();
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
      setActiveProjectIndex((index) => Math.max(0, Math.min(portfolioProjects.length - 1, index + direction)));
    };
    rail.addEventListener("wheel", handleWheel, { passive: false });
    return () => rail.removeEventListener("wheel", handleWheel);
  }, [activeProjectIndex]);

  const moveProject = (direction: number) => {
    projectAutoTouchedRef.current = true;
    setActiveProjectIndex((index) => (index + direction + portfolioProjects.length) % portfolioProjects.length);
  };

  const selectProject = (index: number) => {
    projectAutoTouchedRef.current = true;
    setActiveProjectIndex(index);
  };

  useEffect(() => {
    const rail = projectsRailRef.current?.parentElement;
    const track = projectsRailRef.current;
    if (!rail || !track) return;
    const motion = projectMotionRef.current;
    const minX = () => Math.min(0, rail.clientWidth - track.scrollWidth);
    let verticalGesture: { startY: number; lastY: number } | null = null;
    const advanceFromVerticalTouch = (endY?: number) => {
      const gesture = verticalGesture;
      verticalGesture = null;
      if (!gesture) return;
      const distance = (endY ?? gesture.lastY) - gesture.startY;
      if (Math.abs(distance) < 32) return;
      const now = performance.now();
      if (now - projectWheelCooldownRef.current < 260) return;
      projectWheelCooldownRef.current = now;
      projectAutoTouchedRef.current = true;
      setActiveProjectIndex((index) => Math.max(0, Math.min(portfolioProjects.length - 1, index + (distance < 0 ? 1 : -1))));
    };
    const handleTouchStart = (event: TouchEvent) => {
      verticalGesture = null;
      if (event.touches.length !== 1) {
        motion.drag = null;
        return;
      }
      const touch = event.touches[0]!;
      if (motion.frame) cancelAnimationFrame(motion.frame);
      motion.frame = 0;
      motion.target = null;
      motion.velocity = 0;
      motion.drag = { pointerId: -1, startX: touch.clientX, startY: touch.clientY, originX: motion.x, lastTime: performance.now(), moved: 0, velocity: 0, axis: null };
      projectAutoTouchedRef.current = true;
    };
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (verticalGesture && touch) {
        verticalGesture.lastY = touch.clientY;
        return;
      }
      const drag = motion.drag;
      if (!drag || drag.pointerId !== -1 || event.touches.length !== 1) return;
      if (!touch) return;
      const dx = touch.clientX - drag.startX;
      const dy = touch.clientY - drag.startY;
      if (drag.axis === null) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
        drag.axis = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
        if (drag.axis === "vertical") {
          verticalGesture = { startY: drag.startY, lastY: touch.clientY };
          motion.drag = null;
          return;
        }
      }
      if (drag.axis !== "horizontal") return;
      if (event.cancelable) event.preventDefault();
      const now = performance.now();
      let nextX = drag.originX + dx;
      const minimum = minX();
      if (nextX > 0) nextX *= .35;
      else if (nextX < minimum) nextX = minimum + (nextX - minimum) * .35;
      drag.velocity = (nextX - motion.x) / Math.max(.008, (now - drag.lastTime) / 1000) * .6 + drag.velocity * .4;
      drag.lastTime = now;
      drag.moved = Math.max(drag.moved, Math.abs(dx));
      motion.x = nextX;
      track.style.transform = `translate3d(${nextX.toFixed(2)}px, 0, 0)`;
    };
    const handleTouchEnd = (event: TouchEvent) => {
      if (verticalGesture) {
        advanceFromVerticalTouch(event.changedTouches[0]?.clientY);
        return;
      }
      const drag = motion.drag;
      if (!drag || drag.pointerId !== -1) return;
      motion.drag = null;
      if (drag.axis === "vertical") return;
      motion.velocity = Math.max(-2600, Math.min(2600, drag.velocity));
      motion.settleOnStop = drag.moved > 6;
      if (drag.axis === "horizontal") {
        projectSuppressClickRef.current = true;
        window.setTimeout(() => { projectSuppressClickRef.current = false; }, 350);
      } else {
        const touch = event.changedTouches[0];
        const target = touch && document.elementFromPoint(touch.clientX, touch.clientY)?.closest<HTMLElement>("[data-project-index]");
        if (target) {
          projectAutoTouchedRef.current = true;
          setActiveProjectIndex(Number(target.dataset["projectIndex"]));
        }
      }
      projectKickRef.current();
    };
    const handleTouchCancel = (event: TouchEvent) => {
      if (verticalGesture) {
        advanceFromVerticalTouch(event.changedTouches[0]?.clientY);
        return;
      }
      const drag = motion.drag;
      if (!drag || drag.pointerId !== -1) return;
      const moved = drag.moved;
      motion.drag = null;
      motion.velocity = 0;
      motion.settleOnStop = moved > 6;
      projectKickRef.current();
    };
    rail.addEventListener("touchstart", handleTouchStart, { passive: true });
    rail.addEventListener("touchmove", handleTouchMove, { passive: false });
    rail.addEventListener("touchend", handleTouchEnd, { passive: true });
    rail.addEventListener("touchcancel", handleTouchCancel, { passive: true });
    return () => {
      rail.removeEventListener("touchstart", handleTouchStart);
      rail.removeEventListener("touchmove", handleTouchMove);
      rail.removeEventListener("touchend", handleTouchEnd);
      rail.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, []);

  const openBriefing = (plan?: BriefingPlan) => {
    setBriefingPlan(plan);
    setBriefingOpen(true);
    window.setTimeout(() => document.getElementById("briefing")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }), 0);
  };

  const answerFit = (isMatch: boolean) => {
    if (fitExitTimerRef.current || fitAnswers.length >= fitProfiles.length) return;
    setFitExitDirection(isMatch ? "yes" : "no");
    setFitDragX(0);
    fitPointerStart.current = null;
    fitExitTimerRef.current = window.setTimeout(() => {
      setFitAnswers((answers) => answers.length < fitProfiles.length ? [...answers, isMatch] : answers);
      setFitExitDirection(null);
      fitExitTimerRef.current = 0;
    }, 380);
  };

  const undoFit = () => { if (!fitExitTimerRef.current) setFitAnswers((answers) => answers.slice(0, -1)); };

  const resetFit = () => { window.clearTimeout(fitExitTimerRef.current); fitExitTimerRef.current = 0; setFitExitDirection(null); setFitAnswers([]); };

  const fitScore = fitAnswers.length
    ? Math.round((fitAnswers.filter((answer, index) => answer === fitProfiles[index]?.match).length / fitAnswers.length) * 100)
    : 0;

  const handleFitKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target instanceof HTMLElement && event.target.closest("a")) return;
    if (event.key === "ArrowRight") { event.preventDefault(); answerFit(true); }
    if (event.key === "ArrowLeft") { event.preventDefault(); answerFit(false); }
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
            onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
              if (event.pointerType === "touch") return;
              if (event.button > 0) return;
              const track = projectsRailRef.current;
              if (!track) return;
              const motion = projectMotionRef.current;
              if (motion.frame) cancelAnimationFrame(motion.frame);
              motion.frame = 0;
              motion.target = null;
              motion.velocity = 0;
              motion.drag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: motion.x, lastTime: performance.now(), moved: 0, velocity: 0, axis: "horizontal" };
              projectAutoTouchedRef.current = true;
              event.currentTarget.classList.add("is-drag");
              try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* fallback: retain pointer events on the rail */ }
            }}
            onPointerMove={(event: ReactPointerEvent<HTMLDivElement>) => {
              if (event.pointerType === "touch") return;
              const motion = projectMotionRef.current;
              const drag = motion.drag;
              const track = projectsRailRef.current;
              if (!drag || !track || drag.pointerId !== event.pointerId) return;
              const now = performance.now();
              let nextX = drag.originX + event.clientX - drag.startX;
              const minimum = Math.min(0, event.currentTarget.clientWidth - track.scrollWidth);
              if (nextX > 0) nextX *= .35;
              else if (nextX < minimum) nextX = minimum + (nextX - minimum) * .35;
              drag.velocity = (nextX - motion.x) / Math.max(.008, (now - drag.lastTime) / 1000) * .6 + drag.velocity * .4;
              drag.lastTime = now;
              drag.moved = Math.max(drag.moved, Math.abs(event.clientX - drag.startX));
              motion.x = nextX;
              track.style.transform = `translate3d(${nextX.toFixed(2)}px, 0, 0)`;
            }}
            onPointerUp={(event: ReactPointerEvent<HTMLDivElement>) => {
              if (event.pointerType === "touch") return;
              const motion = projectMotionRef.current;
              const drag = motion.drag;
              const track = projectsRailRef.current;
              if (!drag || drag.pointerId !== event.pointerId) return;
              motion.drag = null;
              motion.velocity = Math.max(-2600, Math.min(2600, drag.velocity));
              motion.settleOnStop = drag.moved > 6;
              event.currentTarget.classList.remove("is-drag");
              projectSuppressClickRef.current = true;
              window.setTimeout(() => { projectSuppressClickRef.current = false; }, 350);
              if (drag.moved <= 6) {
                const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-project-index]");
                if (target) selectProject(Number(target.dataset["projectIndex"]));
              }
              if (track) projectKickRef.current();
            }}
            onPointerCancel={(event: ReactPointerEvent<HTMLDivElement>) => {
              if (event.pointerType === "touch") return;
              const motion = projectMotionRef.current;
              if (!motion.drag || motion.drag.pointerId !== event.pointerId) return;
              motion.settleOnStop = motion.drag.moved > 6;
              motion.drag = null;
              motion.velocity = 0;
              event.currentTarget.classList.remove("is-drag");
              projectKickRef.current();
            }}
            onClickCapture={(event) => {
              if (!projectSuppressClickRef.current) return;
              projectSuppressClickRef.current = false;
              event.preventDefault();
              event.stopPropagation();
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
                      onDragStart={(event) => event.preventDefault()}
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
                      <img className={`project-poster-cover${project.theme === "roadster" ? " project-poster-cover-roadster" : project.theme === "henrique" ? " project-poster-cover-henrique" : project.theme === "prisma" ? " project-poster-cover-prisma" : ""}`} src={project.cover} alt="" loading={Math.abs(index - activeProjectIndex) <= 2 ? "eager" : "lazy"} fetchPriority={index === activeProjectIndex ? "high" : "auto"} decoding="async" />
                      {project.theme === "roadster" && (
                        <span className="project-poster-copy">
                          <span className="project-poster-label">PÁGINA CONCEITO</span>
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
            <a className="projects-footer-cta" href={portfolioProjects[activeProjectIndex]!.url} target="_blank" rel="noreferrer">
              ABRIR {portfolioProjects[activeProjectIndex]!.name.toUpperCase()} <ArrowUpRight size={14} />
            </a>
          </footer>
        </div>
      </section>
      <section id="contato" className="pricing-section" aria-labelledby="pricing-title">
        <div className="pricing-entry-track" ref={pricingTrackRef}>
          <div className="pricing-entry-stage">
            <div className="pricing-entry-copy">
              <p className="pricing-kicker"><span /> 04 / INVESTIMENTO</p>
              <h2 id="pricing-title">Um projeto com<br /><em>o tamanho certo.</em></h2>
              <p>O investimento acompanha a complexidade da página e do conteúdo.</p>
              <span className="pricing-scroll-cue"><ArrowDown size={14} /> ROLE PARA REVELAR</span>
            </div>
            <div className="pricing-camera-shade" ref={pricingShadeRef} aria-hidden="true" />
            <div className="pricing-camera-ui" aria-hidden="true">
              <span className="pricing-camera-brand">RF <i /> DIGITAL</span>
              <span className="pricing-camera-spec">LENTE 35 MM · FOCO MANUAL</span>
              <span className="pricing-camera-meter"><i /></span>
              <svg className="pricing-camera-lens" viewBox="-500 -500 1000 1000" role="presentation">
                <defs>
                  <linearGradient id="pricing-lens-metal" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#898783" />
                    <stop offset=".3" stopColor="#242322" />
                    <stop offset=".72" stopColor="#101010" />
                    <stop offset="1" stopColor="#6c6965" />
                  </linearGradient>
                </defs>
                <g ref={pricingLensRef} className="pricing-lens-mechanism">
                  <circle r="480" fill="none" stroke="#0b0b0b" strokeWidth="30" />
                  <circle r="481" fill="none" stroke="#45423e" strokeWidth="21" strokeDasharray="3 5" />
                  <circle r="458" fill="none" stroke="url(#pricing-lens-metal)" strokeWidth="4" />
                  <circle r="392" fill="none" stroke="#706b65" strokeOpacity=".35" strokeWidth="2" />
                  <circle r="332" fill="none" stroke="#050505" strokeWidth="26" />
                  <circle r="316" fill="none" stroke="#d2ccc1" strokeOpacity=".2" strokeWidth="2" />
                  {Array.from({ length: 24 }, (_, index) => (
                    <line key={index} transform={`rotate(${index * 15})`} y1="-444" y2={index % 3 === 0 ? "-420" : "-430"} stroke="#e7e2d9" strokeOpacity={index % 3 === 0 ? ".65" : ".3"} strokeWidth={index % 3 === 0 ? "2" : "1"} />
                  ))}
                  <g ref={pricingBladesRef} className="pricing-iris-blades">
                    {Array.from({ length: 9 }, (_, index) => <path key={index} fill={`hsl(30 3% ${12 + (index % 3) * 2}%)`} stroke="rgba(244,241,234,.16)" strokeWidth="1.5" />)}
                  </g>
                  <circle r="429" fill="none" stroke="#f4f1ea" strokeOpacity=".25" strokeWidth="2" />
                  <path d="M-236 -168A292 292 0 0 1 -42 -285" fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth="16" strokeLinecap="round" />
                  <circle cx="-92" cy="-226" r="6" fill="#fff" fillOpacity=".42" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div className="pricing-content">
          <div className="pricing-content-heading">
            <p className="pricing-kicker"><span /> PÁGINAS E SITES</p>
            <h3>Escolha o escopo<br /><em>do seu projeto.</em></h3>
            <p>Os valores são por projeto. Todos começam com um briefing completo.</p>
            <div className={`pricing-mode-switch${pricingMode === "timeline" ? " is-timeline" : ""}`} role="group" aria-label="Alternar informação dos planos">
              <span className="pricing-mode-knob" aria-hidden="true" />
              <button type="button" className={pricingMode === "investment" ? "is-active" : ""} aria-pressed={pricingMode === "investment"} onClick={() => setPricingMode("investment")}>Investimento</button>
              <button type="button" className={pricingMode === "timeline" ? "is-active" : ""} aria-pressed={pricingMode === "timeline"} onClick={() => setPricingMode("timeline")}>Prazo estimado</button>
            </div>
            <p className="pricing-mode-note">O prazo é uma estimativa e pode variar conforme o escopo e a demanda.</p>
          </div>

          <div className="pricing-cards">
            {servicePlans.map((plan, index) => (
              <article className={`pricing-card${index === 1 ? " pricing-card-featured" : ""}`} key={plan.number}>
                <div className="pricing-card-topline"><span>PLANO {plan.number}</span><span>{plan.emphasis}</span></div>
                <h4>{plan.name}</h4>
                <p className="pricing-card-description">{plan.description}</p>
                <div className={`pricing-price-block${pricingMode === "timeline" ? " is-hidden" : ""}`} aria-hidden={pricingMode !== "investment"}>
                  <span className="pricing-price-label">INVESTIMENTO POR PROJETO</span>
                  <div className="pricing-price-line pricing-roll-line" aria-label={`R$ ${plan.price.toLocaleString("pt-BR")} por projeto`}>
                    <span className="pricing-currency">R$</span>
                    <PriceOdometer value={plan.price} />
                  </div>
                </div>
                <div className={`pricing-price-block pricing-timeline-block${pricingMode === "investment" ? " is-hidden" : ""}`} aria-hidden={pricingMode !== "timeline"}>
                  <span className="pricing-price-label">PRAZO ESTIMADO</span>
                  <p className="pricing-timeline-value pricing-roll-line" aria-label={`Até ${plan.timeline.days} ${plan.timeline.label}`}>
                    <span>Até</span><PriceOdometer value={plan.timeline.days} className="pricing-timeline-odometer" /><span>{plan.timeline.label}</span>
                  </p>
                </div>
                <a className="pricing-card-link" href="#briefing" onClick={(event) => { event.preventDefault(); openBriefing(plan.name as BriefingPlan); }}>
                  Entenda a próxima etapa <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>

          <aside className="pricing-briefing pricing-briefing--form" id="briefing" hidden={!briefingOpen}>
            <span className="pricing-briefing-index">ANTES DE COMEÇAR</span>
            <div>
              <h4>Todo projeto começa com um briefing completo.</h4>
              <p>É nessa etapa que vamos entender seu negócio, seus objetivos e o conteúdo necessário para estruturar a página.</p>
            </div>
            <span className="pricing-briefing-mark" aria-hidden="true">RF<span>.</span></span>
            {briefingOpen && <BriefingForm key={briefingPlan ?? "generic"} initialPlan={briefingPlan} />}
          </aside>
          <div className="pricing-footer"><span>RAFAEL FONSECA · ESTRATÉGIA, DESIGN E PRESENÇA DIGITAL</span><a href="#top">VOLTAR AO INÍCIO <ArrowUpRight size={13} /></a></div>
        </div>
      </section>
      <section className="fit-section" aria-labelledby="fit-title" onKeyDown={handleFitKeyDown}>
        <div className="fit-shell">
          <div className="fit-copy">
            <p className="fit-kicker"><span /> 05 / PARA QUEM É</p>
            <h2 id="fit-title">Deslize os perfis.<br /><em>Veja se combina.</em></h2>
            <p className="fit-lead">Marque “sou eu” ou “não sou eu”. No fim, você vê o quanto esse tipo de projeto faz sentido para o seu momento.</p>
            <div className="fit-meter" aria-live="polite" aria-atomic="true">
              <div className="fit-meter-label"><span>COMPATIBILIDADE</span><span>{String(fitAnswers.length).padStart(2, "0")} / {fitProfiles.length}</span></div>
              <div className="fit-meter-score">{fitScore}<small>%</small></div>
              <div className="fit-meter-bars" aria-hidden="true">{fitProfiles.map((profile, index) => <i className={index < fitAnswers.length ? (fitAnswers[index] === profile.match ? "is-match" : "is-miss") : ""} key={index} />)}</div>
              <p>{fitAnswers.length === fitProfiles.length ? fitScore >= 70 ? "Parece que seu projeto combina com o meu trabalho." : fitScore >= 40 ? "Há pontos em comum. O briefing ajuda a entender o escopo." : "Talvez ainda não seja o momento ideal para este serviço." : "Sua leitura dos perfis atualiza o resultado."}</p>
            </div>
            <span className="fit-hint">USE AS SETAS, OS BOTÕES OU ARRASTE O CARTÃO</span>
          </div>
          <div className={`fit-stage${fitAnswers.length === fitProfiles.length ? " is-complete" : ""}`}>
            <span className="fit-ghost" aria-hidden="true">MATCH</span>
            {fitAnswers.length < fitProfiles.length ? (
              <div className="fit-deck" onPointerDown={(event) => { if (event.button !== 0) return; fitPointerStart.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { if (fitPointerStart.current !== null) setFitDragX(event.clientX - fitPointerStart.current); }} onPointerUp={() => { if (fitPointerStart.current === null) return; const delta = fitDragX; if (Math.abs(delta) > 60) answerFit(delta > 0); else setFitDragX(0); fitPointerStart.current = null; }} onPointerCancel={() => { fitPointerStart.current = null; setFitDragX(0); }}>
                {fitProfiles.map((profile, index) => {
                  const depth = index - fitAnswers.length;
                  if (depth < 0 || depth > 2) return null;
                  return <article className={`fit-card${depth === 0 ? " is-current" : ""}${depth === 0 && fitExitDirection ? ` is-exiting-${fitExitDirection}` : ""}`} key={index} aria-hidden={depth !== 0} style={{ "--fit-depth": depth, zIndex: 5 - depth, ...(depth === 0 && !fitExitDirection ? { transform: `translate3d(${fitDragX}px, ${Math.abs(fitDragX) * -0.04}px, 0) rotate(${fitDragX * 0.035}deg)` } : {}) } as CSSProperties}>
                    <div className="fit-card-top"><span>PERFIL {String(index + 1).padStart(2, "0")}</span><span>{String(index + 1).padStart(2, "0")} / {fitProfiles.length}</span></div>
                    <span className="fit-orb" aria-hidden="true">{profile.match ? <ArrowUpRight size={24} /> : <span>×</span>}</span>
                    <h3>{profile.title}</h3>
                    <p className="fit-card-detail">{profile.detail}</p>
                    <div className="fit-card-bottom"><span>← NÃO SOU EU</span><span>SOU EU →</span></div>
                    {(fitDragX !== 0 || fitExitDirection) && depth === 0 && <span className={`fit-stamp ${(fitExitDirection ? fitExitDirection === "yes" : fitDragX > 0) ? "is-yes" : "is-no"}`}>{(fitExitDirection ? fitExitDirection === "yes" : fitDragX > 0) ? "SOU EU" : "NÃO SOU"}</span>}
                  </article>;
                })}
              </div>
            ) : (
              <div className="fit-result"><span>SEU RESULTADO</span><strong>{fitScore}<small>%</small></strong><p>{fitScore >= 70 ? "Esse tipo de projeto parece fazer sentido para você." : fitScore >= 40 ? "Alguns pontos combinam. Vamos entender melhor no briefing." : "Talvez este serviço não seja o melhor encaixe agora."}</p><a href="#briefing" onClick={(event) => { event.preventDefault(); openBriefing(); }}>CONVERSAR SOBRE MEU PROJETO <ArrowUpRight size={15} /></a><button type="button" onClick={resetFit}>REFAZER O TESTE</button></div>
            )}
            {fitAnswers.length < fitProfiles.length && <div className="fit-controls"><button type="button" className="fit-no" aria-label="Não sou eu" disabled={fitExitDirection !== null} onClick={() => answerFit(false)}>×</button><button type="button" className="fit-yes" aria-label="Sou eu" disabled={fitExitDirection !== null} onClick={() => answerFit(true)}>✓</button><button type="button" className="fit-undo" disabled={!fitAnswers.length || fitExitDirection !== null} onClick={undoFit}>↶ DESFAZER</button></div>}
          </div>
        </div>
        <div className="fit-footer"><span>RAFAEL FONSECA · ESTRATÉGIA, DESIGN E PRESENÇA DIGITAL</span><a href="#contato">VER OS PLANOS <ArrowUpRight size={13} /></a></div>
      </section>
      <section ref={processSectionRef} className={`process-section${activeProcessStep === processSteps.length - 1 ? " is-process-complete" : ""}`} aria-labelledby="process-title" onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--process-mx", (((event.clientX - bounds.left) / bounds.width - 0.5) * 2).toFixed(3));
        event.currentTarget.style.setProperty("--process-my", (((event.clientY - bounds.top) / bounds.height - 0.5) * 2).toFixed(3));
      }} onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--process-mx", "0");
        event.currentTarget.style.setProperty("--process-my", "0");
      }}>
        <div className="process-shell">
          <div className="process-copy">
            <p className="process-kicker"><span /> 06 / COMO FUNCIONA</p>
            <h2 id="process-title">Do primeiro alinhamento<br /><em>à página no ar.</em></h2>
            <p className="process-lead">Um caminho claro para transformar seu briefing em uma presença digital pronta para apresentar seu trabalho.</p>
            <div className="process-steps" role="tablist" aria-label="Etapas do projeto" onKeyDown={(event) => { if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return; event.preventDefault(); const direction = event.key === "ArrowRight" ? 1 : -1; const next = (activeProcessStep + direction + processSteps.length) % processSteps.length; processAutoTouchedRef.current = true; setActiveProcessStep(next); document.getElementById(`process-tab-${next}`)?.focus(); }}>
              {processSteps.map((step, index) => (
                <button className={`process-step${activeProcessStep === index ? " is-active" : ""}`} type="button" role="tab" aria-selected={activeProcessStep === index} aria-controls="process-screen" id={`process-tab-${index}`} key={step.label} onClick={() => { processAutoTouchedRef.current = true; setActiveProcessStep(index); }}>
                  <span className="process-step-number">0{index + 1}</span>
                  <span className="process-step-copy"><strong>{step.label}</strong><small>{step.title}</small></span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </button>
              ))}
            </div>
            <p className="process-active-description" aria-live="polite">{processSteps[activeProcessStep]!.description}</p>
            <a className="process-cta" href="#briefing" onClick={(event) => { event.preventDefault(); openBriefing(); }}>COMEÇAR PELO BRIEFING <ArrowUpRight size={15} /></a>
          </div>
          <div className="process-visual" aria-live="polite">
            <span className="process-glow" aria-hidden="true" />
            <div className="process-phone" key={activeProcessStep}>
              <div className="process-phone-screen">
                <div className="process-phone-top"><span>RF<span>/</span> DIGITAL</span><i /></div>
                <div className="process-phone-time">{String(activeProcessStep + 1).padStart(2, "0")}<small> / 04</small></div>
                <div className="process-phone-status"><i /><span>SEU PROJETO · {processSteps[activeProcessStep]!.time}</span></div>
                <div className="process-notification" id="process-screen" role="tabpanel" aria-labelledby={`process-tab-${activeProcessStep}`} key={activeProcessStep}>
                  <span className="process-notification-icon"><ArrowUpRight size={17} /></span>
                  <span className="process-notification-meta">QUEBRE O PADRÃO <small>AGORA</small></span>
                  <strong>{processSteps[activeProcessStep]!.screen}</strong>
                  <p>{processSteps[activeProcessStep]!.note}</p>
                </div>
                <div className="process-phone-bottom"><span>ETAPA ATUAL</span><strong>{processSteps[activeProcessStep]!.label}</strong></div>
              </div>
            </div>
            <span className="process-visual-caption">UM PROJETO, QUATRO ETAPAS CLARAS</span>
          </div>
        </div>
        <div className="process-footer"><span>RAFAEL FONSECA · ESTRATÉGIA, DESIGN E PRESENÇA DIGITAL</span><a href="#briefing" onClick={(event) => { event.preventDefault(); openBriefing(); }}>VAMOS CONVERSAR <ArrowUpRight size={13} /></a></div>
      </section>
      <PortfolioStories />
      <ProjectGuarantee openBriefing={() => openBriefing()} />
      <FaqAssistant />
      <footer className="site-footer">
        <div className="site-footer-brand">
          <a className="site-footer-mark" href="#top" aria-label="Rafael Fonseca, voltar ao início">RF<span>/</span></a>
          <span>ESTRATÉGIA · DESIGN · PRESENÇA DIGITAL</span>
        </div>
        <nav className="site-footer-contact" aria-label="Canais de contato">
          <a href="https://www.instagram.com/quebradepadrao.oficial/" target="_blank" rel="noreferrer" aria-label="Instagram Quebre o Padrão">
            <Instagram size={16} aria-hidden="true" /><span>INSTAGRAM</span>
          </a>
          <a href="https://wa.me/5521982027149" target="_blank" rel="noreferrer" aria-label="Conversar pelo WhatsApp">
            <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 2.67A13.25 13.25 0 0 0 4.65 22.7L2.9 29.1l6.55-1.72a13.2 13.2 0 0 0 6.58 1.75h.01c7.31 0 13.26-5.95 13.26-13.26 0-3.54-1.38-6.87-3.89-9.38a13.18 13.18 0 0 0-9.37-3.82Zm0 24.2h-.01a10.98 10.98 0 0 1-5.6-1.54l-.4-.24-4.12 1.08 1.1-4.02-.26-.41a10.98 10.98 0 0 1-1.7-5.87c0-6.08 4.95-11.03 11.04-11.03 2.95 0 5.72 1.15 7.8 3.23a10.96 10.96 0 0 1 3.23 7.8c0 6.08-4.95 11-11.08 11Zm6.05-8.25c-.33-.16-1.94-.96-2.24-1.07-.3-.11-.52-.16-.74.16-.22.33-.85 1.07-1.04 1.29-.19.22-.38.25-.71.08-.33-.16-1.4-.52-2.65-1.64-.98-.87-1.64-1.94-1.83-2.27-.19-.33-.02-.5.14-.66.15-.15.33-.38.49-.57.11-.22.22-.33.33-.55.11-.22.06-.41-.03-.57-.08-.16-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41-.3.33-1.14 1.11-1.14 2.7 0 1.59 1.17 3.12 1.34 3.34.16.22 2.3 3.5 5.56 4.9.78.34 1.38.54 1.85.69.78.25 1.49.21 2.05.13.63-.09 1.95-.8 2.22-1.57.27-.77.27-1.43.19-1.57-.08-.14-.3-.22-.63-.38Z" /></svg>
            <span>WHATSAPP</span>
          </a>
        </nav>
        <small>© {new Date().getFullYear()} RAFAEL FONSECA. TODOS OS DIREITOS RESERVADOS.</small>
      </footer>
      <ExitDiscountPopup />
    </main>
  );
}
