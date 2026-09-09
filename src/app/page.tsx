import Link from "next/link";

const FEATURES = [
  { icon: "fa-leaf", title: "Autogestão do Aluno", desc: "Status de contribuição, recibos e regularização de pendências direto pelo celular." },
  { icon: "fa-mug-hot", title: "Carteira Digital Fortuna", desc: "Fim do dinheiro físico na lanchonete e livraria — recarga e consumo 100% digitais." },
  { icon: "fa-headset", title: "Recuperação de Crédito Humanizada", desc: "Réguas de cobrança automáticas e uma equipe dedicada para reverter inadimplência com empatia." },
  { icon: "fa-scale-balanced", title: "BPO Financeiro Completo", desc: "Contas a pagar, conciliação e compliance fiscal — sem digitação manual." },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--na-bg)" }}>
      <header className="flex flex-col items-center text-center px-6 pt-16 pb-12">
        <div
          className="text-3xl font-bold mb-3"
          style={{ fontFamily: "var(--font-heading)", color: "var(--na-green-dark)" }}
        >
          Nova Acrópole
        </div>
        <span
          className="text-[11px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-6"
          style={{ background: "var(--na-green-light)", color: "var(--na-green-dark)" }}
        >
          Ambiente de Demonstração
        </span>
        <h1
          className="text-2xl sm:text-4xl font-bold max-w-2xl leading-tight mb-4"
          style={{ color: "var(--text-dark)" }}
        >
          Portal do Membro &amp; BPO Financeiro
        </h1>
        <p className="max-w-xl text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
          Modernização operacional, previsibilidade de caixa e valorização do voluntariado —
          transferindo a autonomia para o aluno e a retaguarda financeira para a agência.
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 pb-16 gap-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
          <PortalCard
            href="/membro"
            icon="fa-id-card"
            title="Portal do Membro"
            desc="A visão do aluno: status, carteira Fortuna, contribuição, histórico e eventos."
            accent="var(--na-green)"
          />
          <PortalCard
            href="/diretor"
            icon="fa-chart-pie"
            title="Painel do Diretor"
            desc="A visão da escola: KPIs, membros, recuperação de crédito, Fortuna e repasses."
            accent="var(--na-gold)"
          />
        </div>

        <section className="w-full max-w-4xl">
          <h2
            className="text-center text-xs font-bold uppercase tracking-wide mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            O que essa plataforma resolve
          </h2>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-5 border"
                style={{ borderColor: "#e5e7eb" }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: "var(--na-green-light)", color: "var(--na-green)" }}
                >
                  <i className={`fa-solid ${f.icon}`} />
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-dark)" }}>
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="text-center text-[11px] pb-8" style={{ color: "var(--text-muted)" }}>
        Aletheia Arquitetura Educacional — MVP em construção
      </footer>
    </div>
  );
}

function PortalCard({
  href,
  icon,
  title,
  desc,
  accent,
}: {
  href: string;
  icon: string;
  title: string;
  desc: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl p-6 border flex flex-col gap-3 transition-transform hover:-translate-y-1"
      style={{ borderColor: "#e5e7eb", borderTopWidth: 4, borderTopColor: accent }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
        style={{ background: `${accent}1a`, color: accent }}
      >
        <i className={`fa-solid ${icon}`} />
      </div>
      <div className="text-base font-bold" style={{ color: "var(--text-dark)" }}>
        {title}
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {desc}
      </p>
      <span className="text-xs font-semibold mt-auto" style={{ color: accent }}>
        Acessar <i className="fa-solid fa-arrow-right" />
      </span>
    </Link>
  );
}
