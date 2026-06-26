"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Wine, Tag, ChevronRight, Instagram, MessageCircle, ArrowRight, Star } from "lucide-react";

interface Loja { id: string; nome: string; slug: string; logo_url: string | null; cor_realce: string; descricao: string | null; }
interface Oferta {
  preco: string; preco_oferta: string;
  vinhos: { nome: string; uva: string; pais: string; imagem_url: string | null } | null;
  lojas: { slug: string; nome: string; cor_realce: string } | null;
}

function fmt(p: string) {
  const n = parseFloat(String(p).replace(",", ".").replace(/[^0-9.]/g, "")) || 0;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function HomePage() {
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [form, setForm] = useState({ nome: "", email: "", whatsapp: "", mensagem: "" });
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    fetch("/api/home").then(r => r.json()).then(d => {
      setLojas(d.lojas ?? []);
      setOfertas(d.ofertas ?? []);
    });
  }, []);

  function handleForm(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Olá! Tenho interesse no CompraVinho.\n\nNome: ${form.nome}\nEmail: ${form.email}\nWhatsApp: ${form.whatsapp}\n\n${form.mensagem}`;
    window.open(`https://wa.me/5549999999999?text=${encodeURIComponent(msg)}`, "_blank");
    setEnviado(true);
  }

  return (
    <div style={{ background: "#0A0612", color: "#fff", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Orbs */}
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(107,33,168,0.5), transparent 70%)" }} />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.3), transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)" }} />

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-6">
          <div className="relative h-8 w-40">
            <Image src="/logo-compravinho.svg" alt="CompraVinho" fill className="object-contain object-left" style={{ filter: "brightness(0) invert(1)" }} />
          </div>
          <div className="flex items-center gap-4">
            {lojas.length > 0 && (
              <a href={`/catalogo/${lojas[0].slug}`}
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-all hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}>
                <Wine className="w-3.5 h-3.5" /> Ver catálogos
              </a>
            )}
            <a href="#contato"
              className="text-sm font-semibold px-4 py-2 rounded-full transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #A855F7, #6B21A8)", boxShadow: "0 4px 16px rgba(107,33,168,0.4)" }}>
              Fale conosco
            </a>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-medium"
            style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#C084FC" }}>
            <MapPin className="w-3 h-3" /> Fronteira Dionísio Cerqueira · Barracão · Bernardo de Irigoyen
          </div>

          <h1 className="font-display font-bold leading-none mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", background: "linear-gradient(135deg, #fff 40%, rgba(192,132,252,0.8))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Vinhos da fronteira<br />na sua tela.
          </h1>

          <p className="text-lg max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            Catálogos digitais para vinotecas da fronteira argentina.<br />
            Preços reais, estoque atualizado, pedido pelo WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a href="#catalogos"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #A855F7, #6B21A8)", boxShadow: "0 8px 32px rgba(107,33,168,0.5)" }}>
              Ver catálogos <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#sobre"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full font-medium text-sm transition-all hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
              Saiba mais
            </a>
          </div>

          {/* Stats */}
          {lojas.length > 0 && (
            <div className="flex items-center gap-8 mt-16">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: "#A855F7" }}>{lojas.length}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Vinotecas</p>
              </div>
              <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.1)" }} />
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: "#A855F7" }}>{ofertas.length}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Ofertas ativas</p>
              </div>
              <div className="w-px h-8" style={{ background: "rgba(255,255,255,0.1)" }} />
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: "#A855F7" }}>🇦🇷</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Vinhos argentinos</p>
              </div>
            </div>
          )}
        </div>

        {/* Scroll hint */}
        <div className="relative z-10 flex justify-center pb-8">
          <div className="w-px h-12" style={{ background: "linear-gradient(to bottom, rgba(168,85,247,0.5), transparent)" }} />
        </div>
      </section>

      {/* ── OFERTAS ── */}
      {ofertas.length > 0 && (
        <section className="relative py-20 overflow-hidden" style={{ background: "#0D0A18" }}>
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(107,33,168,0.2), transparent 70%)" }} />
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4" style={{ color: "#A855F7" }} />
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#A855F7" }}>Ofertas em destaque</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold">Vinhos com desconto agora</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {ofertas.slice(0, 8).map((oferta, i) => {
                const pn = parseFloat(String(oferta.preco).replace(",", ".")) || 0;
                const on = parseFloat(String(oferta.preco_oferta).replace(",", ".")) || 0;
                const disc = Math.round((1 - on / pn) * 100);
                const vinho = Array.isArray(oferta.vinhos) ? oferta.vinhos[0] : oferta.vinhos;
                const loja = Array.isArray(oferta.lojas) ? oferta.lojas[0] : oferta.lojas;
                return (
                  <a key={i} href={loja ? `/catalogo/${loja.slug}` : "#"}
                    className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
                    <div className="relative h-36 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                      {vinho?.imagem_url
                        ? <Image src={vinho.imagem_url} alt={vinho?.nome ?? ""} fill className="object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
                        : <span className="text-4xl opacity-20">🍷</span>}
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: "#dc2626" }}>-{disc}%</div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold leading-tight line-clamp-2 mb-1" style={{ color: "rgba(255,255,255,0.9)" }}>{vinho?.nome}</p>
                      {vinho?.uva && <p className="text-[10px] mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>{vinho.uva}</p>}
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[10px] line-through" style={{ color: "rgba(255,255,255,0.3)" }}>{fmt(oferta.preco)}</p>
                          <p className="text-sm font-bold" style={{ color: "#A855F7" }}>{fmt(oferta.preco_oferta)}</p>
                        </div>
                        <ChevronRight className="w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }} />
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── VINOTECAS ── */}
      {lojas.length > 0 && (
        <section id="catalogos" className="relative py-20" style={{ background: "#0A0612" }}>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(107,33,168,0.15), transparent 70%)" }} />
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-2">
                <Wine className="w-4 h-4" style={{ color: "#A855F7" }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#A855F7" }}>Nossas vinotecas</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold">Parceiros CompraVinho</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lojas.map((loja) => (
                <a key={loja.id} href={`/catalogo/${loja.slug}`}
                  className="group flex items-center gap-4 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-1"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-white font-bold font-display"
                    style={{ background: loja.cor_realce || "#6B21A8", border: "2px solid rgba(255,255,255,0.1)" }}>
                    {loja.logo_url
                      ? <Image src={loja.logo_url} alt={loja.nome} width={48} height={48} className="object-cover w-full h-full" />
                      : loja.nome[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: "rgba(255,255,255,0.9)" }}>{loja.nome}</p>
                    {loja.descricao && <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{loja.descricao}</p>}
                    <p className="text-xs mt-1 font-medium" style={{ color: loja.cor_realce || "#A855F7" }}>Ver catálogo →</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SOBRE A FRONTEIRA ── */}
      <section id="sobre" className="relative py-24 overflow-hidden" style={{ background: "#0D0A18" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(107,33,168,0.12), transparent 70%)" }} />
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4" style={{ color: "#A855F7" }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#A855F7" }}>Nossa origem</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6 leading-tight">
                A fronteira<br />do vinho argentino
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                Dionísio Cerqueira (SC), Barracão (PR) e Bernardo de Irigoyen (Argentina) formam um triângulo único onde o Brasil encontra os melhores rótulos argentinos a preços da fronteira.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
                Malbec, Cabernet Sauvignon, Torrontés e muito mais — direto das vinícolas de Mendoza e da Patagônia, passando pela fronteira com preço justo e qualidade garantida.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { flag: "🇧🇷", local: "Dionísio Cerqueira / SC", desc: "Maior polo de compras da fronteira sul" },
                  { flag: "🇧🇷", local: "Barracão / PR", desc: "Porta de entrada do lado paranaense" },
                  { flag: "🇦🇷", local: "Bernardo de Irigoyen / ARG", desc: "Onde os vinhos argentinos chegam frescos" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-xl">{item.flag}</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{item.local}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Glass card decorativo */}
            <div className="relative">
              <div className="rounded-3xl p-8 relative overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl" style={{ background: "rgba(168,85,247,0.2)" }} />
                <div className="space-y-4 relative z-10">
                  {[
                    { label: "Malbec", origin: "Mendoza · Argentina", score: 95 },
                    { label: "Cabernet Sauvignon", origin: "Valle de Uco · Argentina", score: 92 },
                    { label: "Torrontés", origin: "Cafayate · Salta", score: 90 },
                    { label: "Chardonnay", origin: "Patagônia · Argentina", score: 88 },
                  ].map((v, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0" style={{ background: "rgba(168,85,247,0.15)", color: "#A855F7" }}>🍷</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{v.label}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" style={{ color: "#A855F7" }} />
                            <span className="text-xs font-bold" style={{ color: "#A855F7" }}>{v.score}</span>
                          </div>
                        </div>
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: `${v.score}%`, background: "linear-gradient(to right, #6B21A8, #A855F7)" }} />
                        </div>
                        <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{v.origin}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="relative py-20" style={{ background: "#0A0612" }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#A855F7" }}>Como funciona</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-12">Simples para o cliente.<br />Simples para a vinoteca.</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { n: "01", icon: "🍷", title: "Vinoteca cadastra", desc: "Adicionamos sua vinoteca com logo, cor e catálogo personalizado" },
              { n: "02", icon: "📋", title: "Atualiza preços", desc: "A vinoteca atualiza preços e estoque em tempo real pelo painel" },
              { n: "03", icon: "📱", title: "Cliente compra", desc: "O consumidor vê o catálogo e finaliza o pedido direto pelo WhatsApp" },
            ].map((step, i) => (
              <div key={i} className="p-6 rounded-2xl text-left transition-all hover:-translate-y-1 duration-200"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-xs font-bold mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>{step.n}</div>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-semibold mb-2" style={{ color: "rgba(255,255,255,0.9)" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTATO ── */}
      <section id="contato" className="relative py-24 overflow-hidden" style={{ background: "#0D0A18" }}>
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(107,33,168,0.25), transparent 70%)" }} />
        <div className="max-w-xl mx-auto px-6 relative z-10">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageCircle className="w-4 h-4" style={{ color: "#A855F7" }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#A855F7" }}>Fale conosco</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">Tem interesse?</h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Cadastre sua vinoteca no CompraVinho e tenha seu catálogo digital em minutos.
            </p>
          </div>

          {!enviado ? (
            <form onSubmit={handleForm} className="rounded-3xl p-6 sm:p-8 space-y-4"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>Nome</label>
                  <input required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    placeholder="Seu nome"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                    onFocus={e => { e.target.style.borderColor = "rgba(168,85,247,0.5)"; e.target.style.boxShadow = "0 0 0 2px rgba(168,85,247,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>WhatsApp</label>
                  <input required value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    placeholder="(49) 9 9999-9999"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                    onFocus={e => { e.target.style.borderColor = "rgba(168,85,247,0.5)"; e.target.style.boxShadow = "0 0 0 2px rgba(168,85,247,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>E-mail</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  placeholder="seu@email.com" type="email"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(168,85,247,0.5)"; e.target.style.boxShadow = "0 0 0 2px rgba(168,85,247,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>Nome da vinoteca / mensagem</label>
                <textarea required value={form.mensagem} onChange={e => setForm({ ...form, mensagem: e.target.value })}
                  rows={3} className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                  placeholder="Conte sobre sua vinoteca..."
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                  onFocus={e => { e.target.style.borderColor = "rgba(168,85,247,0.5)"; e.target.style.boxShadow = "0 0 0 2px rgba(168,85,247,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
              </div>
              <button type="submit"
                className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:scale-[1.01]"
                style={{ background: "linear-gradient(135deg, #A855F7, #6B21A8)", boxShadow: "0 8px 32px rgba(107,33,168,0.4)" }}>
                <MessageCircle className="w-4 h-4" /> Enviar pelo WhatsApp
              </button>
            </form>
          ) : (
            <div className="text-center py-12 rounded-3xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <span className="text-5xl mb-4 block">🍷</span>
              <h3 className="font-semibold text-lg mb-2">Mensagem enviada!</h3>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Entraremos em contato em breve.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-6" style={{ background: "#0A0612", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative h-7 w-36">
            <Image src="/logo-compravinho.svg" alt="CompraVinho" fill className="object-contain object-left" style={{ filter: "brightness(0) invert(1)", opacity: 0.5 }} />
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} CompraVinho · Dionísio Cerqueira, SC
          </p>
          <div className="flex items-center gap-3">
            <a href="#contato" className="text-xs transition-opacity hover:opacity-80" style={{ color: "rgba(255,255,255,0.3)" }}>Contato</a>
            <a href={`https://instagram.com`} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
              <Instagram className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
