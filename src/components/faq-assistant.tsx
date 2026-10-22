import { useRef, useState, type FormEvent } from "react";
import { askFaqAssistant } from "@/utils/faq-assistant.functions";

type Message = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Quais são os planos e valores?",
  "Como funciona o pagamento?",
  "Quanto tempo leva?",
  "Como funciona o suporte?",
];

const initialMessage: Message = {
  role: "assistant",
  content: "Oi! Sou a assistente virtual do Rafael. Pergunte sobre planos, prazos, briefing, pagamento ou suporte. Se alguma condição ainda não estiver definida, eu aviso.",
};

export function FaqAssistant() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [question, setQuestion] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  const submitQuestion = async (rawQuestion: string) => {
    const content = rawQuestion.trim();
    if (!content || isSending || content.length > 800) return;

    const nextMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setQuestion("");
    setIsSending(true);

    try {
      const result = await askFaqAssistant({ data: { messages: nextMessages.slice(-8) } });
      setMessages((current) => [...current, { role: "assistant", content: result.answer }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "Não consegui responder agora. Tente novamente em instantes." }]);
    } finally {
      setIsSending(false);
      window.requestAnimationFrame(() => messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight, behavior: "smooth" }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitQuestion(question);
  };

  return (
    <section className="faq-assistant" aria-labelledby="faq-assistant-title">
      <div className="faq-assistant-shell">
        <div className="faq-assistant-copy">
          <p className="faq-assistant-kicker"><span /> 09 / DÚVIDAS FREQUENTES</p>
          <h2 id="faq-assistant-title">Pergunte sobre<br /><em>o seu projeto.</em></h2>
          <p className="faq-assistant-lead">Uma assistente virtual responde com as informações dos planos e do processo de trabalho.</p>
          <p className="faq-assistant-note">Respostas geradas por IA a partir das condições informadas por Rafael.</p>
        </div>

        <div className="faq-chat" aria-label="Conversa com a assistente virtual">
          <div className="faq-chat-topbar">
            <div className="faq-chat-avatar" aria-hidden="true">RF<span>.</span></div>
            <div className="faq-chat-identity"><strong>Assistente virtual</strong><small>QUEBRE O PADRÃO · DÚVIDAS SOBRE O PROJETO</small></div>
            <span className="faq-chat-mark" aria-hidden="true">IA</span>
          </div>

          <div className="faq-chat-messages" ref={messageListRef} role="log" aria-live="polite" aria-relevant="additions text">
            {messages.map((message, index) => (
              <div className={`faq-chat-message is-${message.role}`} key={`${message.role}-${index}`}>
                {message.role === "assistant" && <span className="faq-chat-message-mark" aria-hidden="true">RF<span>.</span></span>}
                <p>{message.content}</p>
              </div>
            ))}
            {isSending && <div className="faq-chat-message is-assistant is-typing" aria-label="A assistente está respondendo"><span /><span /><span /></div>}
          </div>

          <div className="faq-chat-suggestions" aria-label="Sugestões de perguntas">
            {suggestions.map((suggestion) => (
              <button key={suggestion} type="button" disabled={isSending} onClick={() => void submitQuestion(suggestion)}>{suggestion}</button>
            ))}
          </div>

          <form className="faq-chat-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="faq-chat-question">Escreva sua pergunta</label>
            <input id="faq-chat-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Escreva sua pergunta..." maxLength={800} disabled={isSending} />
            <button type="submit" aria-label="Enviar pergunta" disabled={isSending || !question.trim()}><span aria-hidden="true">↗</span></button>
          </form>
          <p className="faq-chat-footnote">Não inclua dados pessoais ou informações confidenciais.</p>
        </div>
      </div>
      <div className="faq-assistant-footer"><span>RAFAEL FONSECA · RESPOSTAS SOBRE PLANOS E PROCESSO</span><a href="#top">VOLTAR AO INÍCIO <span aria-hidden="true">↗</span></a></div>
    </section>
  );
}
