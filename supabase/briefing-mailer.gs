const DESTINATION_EMAIL = "marketialize@gmail.com";
const ADMIN_PANEL_URL = "https://hello-maria-idea-garden.lovable.app/painel";

function doPost(event) {
  try {
    const body = JSON.parse(event?.postData?.contents || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("BRIEFING_WEBHOOK_SECRET");
    if (!expectedSecret || !constantTimeEquals(String(body.secret || ""), expectedSecret)) {
      return jsonResponse({ sent: false, error: "unauthorized" });
    }

    const briefing = validateBriefing(body.briefing);
    if (MailApp.getRemainingDailyQuota() < 1) return jsonResponse({ sent: false, error: "quota" });

    const subject = `Novo briefing — ${briefing.nome} — ${briefing.negocio}`.slice(0, 180);
    const message = [
      "NOVO BRIEFING RECEBIDO", "", `Nome: ${briefing.nome}`, `E-mail: ${briefing.email}`,
      `WhatsApp: ${briefing.whatsapp || "Não informado"}`, `Negócio/nicho: ${briefing.negocio}`,
      `Plano: ${briefing.plano}`, `Prazo desejado: ${briefing.prazo}`, "", "OBJETIVO DO PROJETO",
      briefing.objetivo, "", "CONTEÚDO / RECURSOS DISPONÍVEIS", briefing.conteudo || "Não informado",
      "", "REFERÊNCIAS / LINKS", briefing.referencias || "Não informado", "", "DETALHES",
      briefing.detalhes || "Não informado", "", `Abrir painel privado: ${ADMIN_PANEL_URL}`,
    ].join("\n");

    MailApp.sendEmail({ to: DESTINATION_EMAIL, replyTo: briefing.email, subject, body: message, name: "Quebre o Padrão · Briefings" });
    return jsonResponse({ sent: true });
  } catch (error) {
    console.error("Briefing notification failed", error);
    return jsonResponse({ sent: false, error: "delivery-failed" });
  }
}

function validateBriefing(value) {
  if (!value || typeof value !== "object") throw new Error("Invalid briefing");
  ["nome", "email", "negocio", "objetivo", "plano", "prazo"].forEach((field) => {
    if (typeof value[field] !== "string" || !value[field].trim()) throw new Error("Missing required field");
  });
  if (value.consentimento !== true || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.email)) throw new Error("Invalid consent or e-mail");
  const limits = { nome: 120, email: 255, whatsapp: 30, negocio: 200, objetivo: 2000, plano: 40, prazo: 100, conteudo: 2000, referencias: 2000, detalhes: 4000 };
  Object.keys(limits).forEach((field) => {
    const text = value[field] == null ? "" : String(value[field]);
    if (text.length > limits[field]) throw new Error("Field too long");
  });
  if (!["Página objetiva", "Página estratégica", "Página completa", "Ainda não sei"].includes(value.plano)) throw new Error("Invalid plan");
  return value;
}

function constantTimeEquals(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index++) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
