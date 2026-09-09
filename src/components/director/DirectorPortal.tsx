"use client";

import { useMemo, useState } from "react";
import styles from "./DirectorPortal.module.css";

type TabId = "visao-geral" | "membros" | "eventos" | "recuperacao" | "fortuna" | "repasses";

const NAV_ITEMS: { id: TabId; icon: string; label: string }[] = [
  { id: "visao-geral", icon: "fa-chart-pie", label: "Visão Geral" },
  { id: "membros", icon: "fa-users", label: "Gestão de Membros" },
  { id: "eventos", icon: "fa-ticket", label: "Gestão de Eventos" },
  { id: "recuperacao", icon: "fa-handshake", label: "Recup. de Crédito" },
  { id: "fortuna", icon: "fa-store", label: "Caixa Fortuna" },
  { id: "repasses", icon: "fa-money-bill-transfer", label: "Contas e Repasses" },
];

// Dados de demonstração — serão substituídos por dados reais (Prisma) quando o Supabase estiver conectado.
const MEMBERS = [
  { id: "21596", name: "Luiz Henrique Zanchi Borges", tags: ["Fortuna", "Doação (PCPB)"], total: "210,00", status: "paid" as const },
  { id: "18204", name: "Maria Rita Almeida", tags: [], total: "130,00", status: "paid" as const },
  { id: "19402", name: "Carlos Eduardo Mendes", tags: [], total: "130,00", status: "danger" as const, statusLabel: "Atrasado (1 mês)" },
  { id: "20111", name: "Juliana Souza", tags: ["Oficina de Pintura"], total: "150,00", status: "pending" as const, statusLabel: "Em Negociação" },
  { id: "15002", name: "Roberto Farias", tags: [], total: "130,00", status: "danger" as const, statusLabel: "Atrasado (3 meses)" },
  { id: "22031", name: "Ana Beatriz Costa", tags: ["Fortuna"], total: "180,00", status: "paid" as const },
  { id: "21008", name: "Amanda Lima", tags: ["Doação (PCPB)"], total: "160,00", status: "paid" as const },
  { id: "20455", name: "Fernanda Oliveira", tags: [], total: "130,00", status: "danger" as const, statusLabel: "Atrasado (1 mês)" },
  { id: "22105", name: "Carolina Mendes", tags: ["Oficina", "Doação (PCPB)"], total: "200,00", status: "paid" as const },
];

const TRANSACOES = [
  { name: "Luiz H. Zanchi", desc: "Contribuição + Fortuna", when: "Hoje, 09:14", method: "PIX", bruto: "180,00", liquido: "174,60" },
  { name: "Maria Rita Almeida", desc: "Contribuição", when: "Ontem, 18:30", method: "Cartão", bruto: "130,00", liquido: "126,10" },
  { name: "João Pedro Santos", desc: "Ingresso Evento", when: "Ontem, 14:20", method: "PIX", bruto: "20,00", liquido: "19,30" },
];

const PORTARIA_INICIAL = [
  { id: "maria", name: "Maria Rita Almeida", sub: "Membro Regular", pgto: "Pago (Pix)", checkedIn: true },
  { id: "joao", name: "João Pedro Santos", sub: "Público Externo", pgto: "Pago (Cartão)", checkedIn: true },
  { id: "carlos", name: "Carlos Eduardo Mendes", sub: "Membro Regular", pgto: "Cortesia", checkedIn: false },
  { id: "fernanda", name: "Fernanda Oliveira", sub: "Público Externo", pgto: "Pendente", checkedIn: false, pending: true },
];

const CRM_QUEUE = [
  { name: "Roberto Farias", info: "Atraso: 3 meses (R$ 390,00)", tag: "Sem contato", kind: "danger" as const },
  { name: "Juliana Souza", info: "Atraso: 2 meses (R$ 260,00)", tag: "Promessa de Pgto (Cartão)", kind: "warning" as const, historico: true },
  { name: "Fernanda Oliveira", info: "Atraso: 1 mês (R$ 130,00)", tag: "Deixou recado", kind: "warning" as const },
];

const ANTECIPACAO_QUEUE = [
  { name: "Carlos Eduardo Mendes", divida: "520,00", parcelas: "Parcelou em 4x" },
  { name: "Ana Beatriz Costa", divida: "260,00", parcelas: "Parcelou em 2x" },
];

const FORTUNA_MOVS = [
  { name: "Luiz Henrique Zanchi", when: "Hoje, 09:14", tipo: "Recarga via PIX", valor: "+ R$ 50,00", positive: true },
  { name: "Amanda Lima", when: "Ontem, 20:15", tipo: "Consumo (Café Sophia)", valor: "- R$ 12,50", positive: false },
  { name: "Carlos Eduardo Mendes", when: "Ontem, 19:40", tipo: "Consumo (Livraria)", valor: "- R$ 45,00", positive: false },
];

const PAYABLES = [
  { vendor: "Aluguel da Sede", sub: "Imobiliária Centro", venc: "10/08/2026", valor: "3.500,00", nf: "ok" as const, bpo: "aprovar" as const },
  { vendor: "Energia Elétrica", sub: "Manutenção", venc: "12/08/2026", valor: "450,00", nf: "ok" as const, bpo: "aprovar" as const },
  { vendor: "Gráfica Rápida (Flyers)", sub: "Secretaria de Difusão", venc: "15/08/2026", valor: "280,00", nf: "pendente" as const, bpo: "processando" as const },
  { vendor: "Internet (Fibra)", sub: "Manutenção", venc: "05/08/2026", valor: "120,00", nf: "ok" as const, bpo: "pago" as const },
];

export default function DirectorPortal() {
  const [activeTab, setActiveTab] = useState<TabId>("visao-geral");
  const [portaria, setPortaria] = useState(PORTARIA_INICIAL);
  const [crmModal, setCrmModal] = useState<{ name: string; kind: "danger" | "warning" } | null>(null);
  const [anticipationTarget, setAnticipationTarget] = useState<{ name: string; amount: number } | null>(null);
  const [anticipationStage, setAnticipationStage] = useState<"idle" | "processing" | "done">("idle");
  const [doorModalOpen, setDoorModalOpen] = useState(false);
  const [doorStage, setDoorStage] = useState<"idle" | "processing">("idle");
  const [attachModalOpen, setAttachModalOpen] = useState(false);

  const presentes = useMemo(() => portaria.filter((p) => p.checkedIn).length, [portaria]);

  const toggleCheckin = (id: string) => {
    setPortaria((prev) => prev.map((p) => (p.id === id ? { ...p, checkedIn: !p.checkedIn } : p)));
  };

  const activeLabel = NAV_ITEMS.find((n) => n.id === activeTab)?.label ?? "";

  const openAnticipation = (name: string, amountStr: string) => {
    setAnticipationTarget({ name, amount: parseFloat(amountStr.replace(",", ".")) });
    setAnticipationStage("idle");
  };

  const processAnticipation = () => {
    setAnticipationStage("processing");
    setTimeout(() => {
      setAnticipationStage("done");
      setTimeout(() => {
        setAnticipationTarget(null);
        alert(
          "A demonstração foi concluída. Na prática, este valor entra automaticamente no extrato da escola no dia seguinte.",
        );
      }, 1500);
    }, 1000);
  };

  const confirmDoorRegistration = () => {
    setDoorStage("processing");
    setTimeout(() => {
      alert("Pagamento aprovado! O membro foi adicionado à lista de presenças.");
      setDoorModalOpen(false);
      setDoorStage("idle");
    }, 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className="text-white font-bold text-lg mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            Nova Acrópole
          </div>
          <span className={styles.schoolTag}>Barra do Garças</span>
        </div>
        <nav className={styles.navMenu}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              className={`${styles.navItem} ${activeTab === item.id ? styles.navItemActive : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <i className={`fa-solid ${item.icon}`} /> <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div>
            <h2 className={styles.pageTitleH2}>{activeLabel}</h2>
            <p className={styles.pageTitleP}>Governança Financeira - Agosto / 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`text-right ${styles.userProfileName}`}>
              <div className="text-sm font-semibold" style={{ color: "var(--text-dark)" }}>
                Bia (Diretoria)
              </div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Acesso Administrador
              </div>
            </div>
            <div className={styles.avatar}>B</div>
          </div>
        </header>

        <div className={styles.dashboardContainer}>
          {activeTab === "visao-geral" && (
            <div className={styles.fadeIn}>
              <div className={styles.kpiGrid} style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
                <Kpi icon="fa-wallet" title="Receita Prevista (Mensal)" value="R$ 18.720,00" sub="144 Membros Ativos" subIcon="fa-arrow-up" subClass="positive" />
                <Kpi icon="fa-file-invoice-dollar" title="Despesas Previstas (Mensal)" value="R$ 8.450,00" valueColor="var(--na-danger)" sub="Margem Saudável" subIcon="fa-scale-balanced" subClass="negative" variant="danger" />
                <Kpi icon="fa-chart-line" title="Taxa de Inadimplência" value="8.5%" sub="Caiu 3% este mês" subIcon="fa-arrow-down" subClass="positive" variant="warning" />
                <Kpi icon="fa-handshake-angle" title="Recuperação Disponível" value="R$ 2.450,00" valueColor="var(--na-gold)" sub="Pronto para antecipação" variant="gold" />
                <Kpi icon="fa-mug-hot" title="Saldo Caixa Fortuna" value="R$ 1.240,50" sub="Livre circulação" subClass="positive" />
              </div>

              <div className={styles.sectionCard} style={{ marginBottom: 0 }}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>
                    <i className="fa-solid fa-list-check" /> Últimas Transações (Split Automático)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Membro / Descrição</th>
                        <th>Data/Hora</th>
                        <th>Método</th>
                        <th>Valor Bruto</th>
                        <th>Líquido (Escola)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TRANSACOES.map((t) => (
                        <tr key={t.name + t.when}>
                          <td>
                            <strong>{t.name}</strong> <br />
                            <span className="text-[10px]" style={{ color: "gray" }}>
                              {t.desc}
                            </span>
                          </td>
                          <td>{t.when}</td>
                          <td>
                            <i className={t.method === "PIX" ? "fa-brands fa-pix" : "fa-regular fa-credit-card"} style={{ color: t.method === "PIX" ? "#32bcad" : undefined }} />{" "}
                            {t.method}
                          </td>
                          <td>R$ {t.bruto}</td>
                          <td>
                            <strong style={{ color: "var(--na-green)" }}>R$ {t.liquido}</strong>
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${styles.statusPaid}`}>Liquidado</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "membros" && (
            <div className={styles.fadeIn}>
              <div className={styles.sectionCard} style={{ padding: 0, overflow: "hidden" }}>
                <div className="p-6 border-b" style={{ borderColor: "#e2e8f0", background: "#fdfdfd" }}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={styles.sectionTitle}>
                      <i className="fa-solid fa-address-book" /> Base de Alunos (Sincronizada com Mercúrio)
                    </h3>
                    <button className={styles.btnSm}>
                      <i className="fa-solid fa-file-export" /> Exportar Lista
                    </button>
                  </div>
                  <div className={styles.searchBar}>
                    <div className={styles.searchInputWrap}>
                      <i className="fa-solid fa-magnifying-glass" />
                      <input className={styles.searchInput} placeholder="Buscar por nome, matrícula ou status..." />
                    </div>
                    <select className={styles.searchInput} style={{ width: 200, paddingLeft: 10 }}>
                      <option>Todos os Status</option>
                      <option>Apenas Em Dia</option>
                      <option>Apenas Em Atraso</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className={styles.dataTable} style={{ minWidth: 900 }}>
                    <thead style={{ background: "#f8fafc" }}>
                      <tr>
                        <th style={{ paddingLeft: 24 }}>Aluno</th>
                        <th>Composição Mensal</th>
                        <th>Valor Total</th>
                        <th>Status</th>
                        <th style={{ textAlign: "center", paddingRight: 24 }}>Contato</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MEMBERS.map((m) => (
                        <tr key={m.id} style={m.status !== "paid" ? { background: "#fffafa" } : undefined}>
                          <td className={styles.memberInfoTd} style={{ paddingLeft: 24 }}>
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random`}
                              className={styles.memberAvatar}
                              alt=""
                            />
                            <div>
                              <span className={styles.memberNameText}>{m.name}</span>
                              <span className={styles.memberId}>Matrícula: #{m.id}</span>
                            </div>
                          </td>
                          <td>
                            <div className={styles.compTags}>
                              <span className={`${styles.tagComp} ${styles.tagCompMain}`}>Contribuição</span>
                              {m.tags.map((t) => (
                                <span key={t} className={styles.tagComp}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <strong>R$ {m.total}</strong>
                          </td>
                          <td>
                            <span
                              className={`${styles.statusBadge} ${
                                m.status === "paid" ? styles.statusPaid : m.status === "danger" ? styles.statusDanger : styles.statusPending
                              }`}
                            >
                              {m.status === "paid" ? "Em Dia" : m.statusLabel}
                            </span>
                          </td>
                          <td style={{ textAlign: "center", paddingRight: 24 }}>
                            <a href="#" className={styles.btnWhatsapp}>
                              <i className="fa-brands fa-whatsapp" /> WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center p-4 px-6 border-t" style={{ borderColor: "#e2e8f0", background: "#fdfdfd" }}>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Exibindo {MEMBERS.length} de 144 membros
                  </span>
                  <div className="flex gap-2">
                    <button className={styles.btnOutline}>Anterior</button>
                    <button className={styles.btnOutline}>Próxima</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "eventos" && (
            <div className={styles.fadeIn}>
              <div className="flex justify-between items-center mb-6">
                <select className={styles.formSelect} style={{ maxWidth: 400, marginBottom: 0, fontWeight: 600, color: "var(--na-green-dark)" }}>
                  <option>Oficina de Pintura e Artesanato (Hoje, 19h)</option>
                  <option>A Odisseia: Quem Não Governa a Si Mesmo... (29/08)</option>
                  <option>Filosofilme: Invictus (04/09)</option>
                </select>
                <button className={styles.btnSm} style={{ padding: "10px 16px" }}>
                  <i className="fa-solid fa-file-export" /> Relatório Consolidado
                </button>
              </div>

              <div className={styles.kpiGrid}>
                <Kpi icon="fa-ticket" title="Inscritos Totais" value="45" sub="Vagas Preenchidas" variant="blue" />
                <Kpi icon="fa-users" title="Comparecimento" value={String(presentes)} sub={`${Math.round((presentes / (portaria.length || 1)) * 100)}% de Show-up`} subClass="positive" variant="gold" />
                <Kpi icon="fa-sack-dollar" title="Receita Bruta" value="R$ 900,00" sub="Ticket: R$ 20,00" subIcon="fa-arrow-up" subClass="positive" />
                <Kpi icon="fa-file-invoice" title="Custos Operacionais" value="R$ 150,00" valueColor="var(--na-danger)" sub="Materiais da Oficina" subClass="negative" variant="danger" />
              </div>

              <div className={styles.twoColsUneven}>
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>
                      <i className="fa-solid fa-clipboard-list" /> Controle de Portaria
                    </h3>
                  </div>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Nome do Inscrito</th>
                        <th>Status Pgto.</th>
                        <th style={{ textAlign: "right" }}>Ação na Porta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portaria.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <strong>{p.name}</strong>
                            <br />
                            <span className="text-[10px]" style={{ color: "gray" }}>
                              {p.sub}
                            </span>
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${p.pending ? styles.statusPending : styles.statusPaid}`}>{p.pgto}</span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              className={`${styles.btnCheckin} ${p.checkedIn ? styles.btnCheckinChecked : ""}`}
                              onClick={() => toggleCheckin(p.id)}
                            >
                              {p.checkedIn ? (
                                <>
                                  <i className="fa-solid fa-check" /> Presente
                                </>
                              ) : (
                                "Aguardando"
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.sectionCard} style={{ background: "#fdfaf5", borderColor: "var(--na-gold)" }}>
                  <h3 className={styles.sectionTitle} style={{ marginBottom: 16 }}>
                    <i className="fa-solid fa-bolt" /> Ações Rápidas
                  </h3>
                  <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                    Use esta opção para registrar membros ou visitantes que chegaram sem inscrição prévia.
                  </p>
                  <button
                    className={styles.btnGold}
                    style={{ width: "100%", justifyContent: "center", padding: 12, fontSize: 14 }}
                    onClick={() => setDoorModalOpen(true)}
                  >
                    <i className="fa-solid fa-user-plus" /> Inscrição de Última Hora
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "recuperacao" && (
            <div className={styles.fadeIn}>
              <div className={styles.sectionCard} style={{ borderTop: "4px solid var(--na-green)" }}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>
                    <i className="fa-solid fa-layer-group" /> Construtor de Réguas de Cobrança
                  </h3>
                  <button className={styles.btnPrimary} style={{ padding: "8px 16px", borderRadius: 8 }} onClick={() => alert("Iniciando criação de nova régua em branco...")}>
                    <i className="fa-solid fa-plus" /> Nova Régua
                  </button>
                </div>
                <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                  Crie fluxos de mensagens personalizados por nível de turma ou configure exceções para alunos específicos.
                </p>

                <div className="flex gap-4 mb-6 items-end p-4 rounded-lg" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <div style={{ flex: 1 }}>
                    <label className="text-[11px] font-bold uppercase block mb-2" style={{ color: "var(--text-muted)" }}>
                      Editando a Régua:
                    </label>
                    <select className={styles.formSelect} style={{ marginBottom: 0, fontWeight: 600, color: "var(--na-green-dark)" }} onChange={() => alert("Carregando configurações da régua selecionada...")}>
                      <option>Régua Padrão (Alunos do 1º Nível)</option>
                      <option>Régua Suave (Alunos do 2º Nível em diante)</option>
                      <option>Régua de Resgate (Inadimplentes &gt; 60 dias)</option>
                    </select>
                  </div>
                  <button className={styles.btnOutline} style={{ height: 42 }}>
                    <i className="fa-solid fa-pen" /> Renomear
                  </button>
                  <button className={styles.btnOutline} style={{ height: 42, color: "var(--na-danger)", borderColor: "#fca5a5" }}>
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>

                <h4 className="text-[13px] font-bold mb-3" style={{ color: "var(--text-dark)" }}>
                  Momentos de Disparo (Ativos nesta Régua)
                </h4>
                <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                  <TriggerCard title="Dia 01 (Início do Mês)" desc="Mensagem sutil informando que o novo mês iniciou." checked={false} />
                  <TriggerCard title="Dia 10 (Vencimento)" desc="Lembrete do último dia de desconto com botões PIX." checked active />
                  <TriggerCard title="Dia 30 (Fim do Mês)" desc="Apelo para manter a escola no azul (Valor integral)." checked active />
                  <TriggerCard title="Dia 10 Seguinte (+30 dias)" desc="Alerta de atraso." checked danger />
                  <TriggerCard title="+60 Dias em Atraso" desc="Abertura de negociação para parcelamento no cartão." checked={false} />
                  <div
                    className="border border-dashed rounded-lg flex items-center justify-center cursor-pointer p-3"
                    style={{ borderColor: "#cbd5e1" }}
                    onClick={() => alert("Painel para desenhar um novo momento de disparo de mensagem.")}
                  >
                    <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                      <i className="fa-solid fa-plus" /> Adicionar Momento
                    </span>
                  </div>
                </div>

                <div className="border-t my-6" style={{ borderColor: "#e2e8f0" }} />

                <h4 className="text-[13px] font-bold mb-3">
                  <i className="fa-solid fa-user-pen" /> Personalização Individual (Exceções)
                </h4>
                <p className="text-[11px] mb-4" style={{ color: "var(--text-muted)" }}>
                  Precisa aplicar uma regra diferente para um aluno específico independente da turma dele? Faça o ajuste aqui.
                </p>
                <div className="bg-white border rounded-lg p-4 flex gap-4 items-center" style={{ borderColor: "#e2e8f0" }}>
                  <div style={{ flex: 1 }}>
                    <input className={styles.searchInput} placeholder="Buscar aluno para alterar a régua..." />
                  </div>
                  <div style={{ width: 300 }}>
                    <select className={styles.formSelect} style={{ marginBottom: 0, padding: "8px 12px", fontSize: 12 }}>
                      <option>Usar Régua da Turma (Padrão)</option>
                      <option>Mudar para: Régua Suave</option>
                      <option>Mudar para: Régua de Resgate</option>
                      <option>Não cobrar (Isento/Congelado)</option>
                    </select>
                  </div>
                  <button className={styles.btnSm} style={{ padding: "8px 16px" }} onClick={() => alert("Regra individual salva com sucesso! Este aluno seguirá o fluxo definido.")}>
                    Salvar Alteração
                  </button>
                </div>
              </div>

              <div className={styles.twoCols}>
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>
                      <i className="fa-solid fa-headset" /> CRM: Fila de Negociação (Agência)
                    </h3>
                  </div>
                  <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                    Contatos em andamento pela equipe de atendimento para reverter a inadimplência.
                  </p>
                  {CRM_QUEUE.map((c) => (
                    <div
                      key={c.name}
                      className={`${styles.crmItem} ${c.kind === "danger" ? styles.crmItemDanger : styles.crmItemWarning}`}
                      style={c.kind === "warning" && !c.historico ? { opacity: 0.8 } : undefined}
                    >
                      <div className={styles.crmInfo}>
                        <h4>{c.name}</h4>
                        <p>{c.info}</p>
                        <span
                          className={styles.crmTag}
                          style={
                            c.kind === "danger"
                              ? { background: "#fecaca", color: "#991b1b" }
                              : c.historico
                                ? { background: "#fef3c7", color: "#92400e" }
                                : { background: "#f1f5f9", color: "#64748b" }
                          }
                        >
                          {c.tag}
                        </span>
                      </div>
                      <div className={styles.crmActions}>
                        {c.historico ? (
                          <button className={styles.btnSm} onClick={() => setCrmModal({ name: c.name, kind: c.kind })}>
                            <i className="fa-solid fa-clock-rotate-left" /> Histórico
                          </button>
                        ) : (
                          <button className={styles.btnSm} style={{ background: "#25D366", color: "white" }} onClick={() => setCrmModal({ name: c.name, kind: c.kind })}>
                            <i className="fa-brands fa-whatsapp" /> Abordar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="text-[11px] text-center mt-3" style={{ color: "var(--text-muted)" }}>
                    <i className="fa-solid fa-lock" /> Acesso compartilhado Agência/Diretoria
                  </div>
                </div>

                <div className={styles.sectionCard} style={{ borderTop: "4px solid var(--na-gold)", background: "#fdfaf5" }}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>
                      <i className="fa-solid fa-bolt" style={{ color: "var(--na-gold)" }} /> Pronto para Antecipação
                    </h3>
                  </div>
                  <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                    Acordos fechados pela agência e parcelados pelo aluno. Caixa disponível para resgate imediato.
                  </p>
                  {ANTECIPACAO_QUEUE.map((a) => (
                    <div key={a.name} className={`${styles.crmItem} ${styles.crmItemSuccess}`}>
                      <div className={styles.crmInfo}>
                        <h4>{a.name}</h4>
                        <p>
                          Dívida Total: <strong style={{ color: "var(--text-dark)" }}>R$ {a.divida}</strong>
                        </p>
                        <span className="text-[10px]" style={{ color: "var(--na-success)" }}>
                          <i className="fa-solid fa-credit-card" /> {a.parcelas}
                        </span>
                      </div>
                      <button className={styles.btnGold} onClick={() => openAnticipation(a.name, a.divida)}>
                        Antecipar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "fortuna" && (
            <div className={styles.fadeIn}>
              <div className={styles.kpiGrid} style={{ gridTemplateColumns: "1fr 2fr" }}>
                <Kpi icon="fa-mug-hot" title="Saldo Consolidado (Todos os Alunos)" value="R$ 1.240,50" valueColor="var(--na-green-dark)" sub="Disponível para compras da Lanchonete" subClass="positive" variant="gold" />
                <div className={styles.kpiCard} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 className="text-base mb-2">Fim do Dinheiro Físico</h3>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Todo o consumo da escola agora é digital, evitando furos no caixa diário.
                    </p>
                  </div>
                  <button className={styles.btnOutline}>
                    <i className="fa-solid fa-download" /> Relatório de Consumo
                  </button>
                </div>
              </div>

              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle} style={{ marginBottom: 16 }}>
                  <i className="fa-solid fa-arrow-right-arrow-left" /> Últimas Movimentações (Lanchonete e Livraria)
                </h3>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Membro</th>
                      <th>Data/Hora</th>
                      <th>Tipo de Operação</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FORTUNA_MOVS.map((m) => (
                      <tr key={m.name + m.when}>
                        <td>
                          <strong>{m.name}</strong>
                        </td>
                        <td>{m.when}</td>
                        <td>
                          <span className={styles.statusBadge} style={m.positive ? { background: "#e0e7ff", color: "#3730a3" } : { background: "#fef2f2", color: "#991b1b" }}>
                            {m.tipo}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: m.positive ? "var(--na-success)" : "var(--na-danger)" }}>{m.valor}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "repasses" && (
            <div className={styles.fadeIn}>
              <div className={styles.kpiGrid}>
                <Kpi icon="fa-file-invoice-dollar" title="Contas a Pagar (Esta Semana)" value="R$ 4.350,00" valueColor="var(--na-danger)" sub="5 boletos agendados" subClass="negative" variant="danger" />
                <Kpi icon="fa-building-columns" title="Aguardando Aprovação" value="3" sub="Requer senha do Diretor" variant="blue" />
                <Kpi icon="fa-money-bill-transfer" title="Repasses a Receber (D+1)" value="R$ 1.840,00" valueColor="var(--na-success)" sub="Líquido de contribuições" subClass="positive" />
                <Kpi icon="fa-scale-balanced" title="Projeção de Fluxo de Caixa" value="Positivo" valueColor="var(--na-gold)" sub="Receitas cobrem as despesas" variant="gold" />
              </div>

              <div className={styles.twoColsUneven}>
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>
                      <i className="fa-solid fa-file-signature" /> Gestão de Contas e Compliance
                    </h3>
                    <select className={styles.formSelect} style={{ marginBottom: 0, padding: "6px 10px", fontSize: 11, width: "auto" }}>
                      <option>Esta Semana</option>
                      <option>Mês Completo</option>
                    </select>
                  </div>
                  <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                    Acompanhe o status do BPO e garanta que todas as despesas tenham documento fiscal associado.
                  </p>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Fornecedor / Despesa</th>
                        <th>Vencimento</th>
                        <th>Valor</th>
                        <th>Comprovação Fiscal</th>
                        <th>Status do BPO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PAYABLES.map((p) => (
                        <tr key={p.vendor}>
                          <td>
                            <strong>{p.vendor}</strong>
                            <br />
                            <span className="text-[10px]" style={{ color: "gray" }}>
                              {p.sub}
                            </span>
                          </td>
                          <td>{p.venc}</td>
                          <td>
                            <strong>R$ {p.valor}</strong>
                          </td>
                          <td>
                            {p.nf === "ok" ? (
                              <span className="text-[11px] font-semibold" style={{ color: "var(--na-success)" }}>
                                <i className="fa-solid fa-file-circle-check" /> {p.vendor.includes("Aluguel") ? "Recibo OK" : "Fatura OK"}
                              </span>
                            ) : (
                              <button
                                className={styles.btnSm}
                                style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fca5a5", padding: "4px 8px", fontSize: 10 }}
                                onClick={() => setAttachModalOpen(true)}
                              >
                                <i className="fa-solid fa-triangle-exclamation" /> Pendente NF
                              </button>
                            )}
                          </td>
                          <td>
                            {p.bpo === "aprovar" && (
                              <span className={styles.statusBadge} style={{ background: "#fef3c7", color: "#92400e" }}>
                                <i className="fa-solid fa-key" /> Aprovar no Banco
                              </span>
                            )}
                            {p.bpo === "processando" && (
                              <span className={styles.statusBadge} style={{ background: "#e0e7ff", color: "#3730a3" }}>
                                <i className="fa-solid fa-gears" /> Em Processamento
                              </span>
                            )}
                            {p.bpo === "pago" && (
                              <span className={`${styles.statusBadge} ${styles.statusPaid}`}>
                                <i className="fa-solid fa-check-double" /> Pago e Conciliado
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-5">
                  <div className={styles.sectionCard} style={{ background: "#fdfaf5", borderColor: "var(--na-gold)" }}>
                    <h3 className={styles.sectionTitle} style={{ marginBottom: 12, fontSize: 14 }}>
                      <i className="fa-solid fa-cloud-arrow-up" /> Central de Documentos
                    </h3>
                    <p className="text-[11px] mb-4" style={{ color: "var(--text-muted)" }}>
                      Arraste aqui boletos para pagamento ou as Notas Fiscais para conciliação contábil.
                    </p>
                    <div
                      className="border-2 border-dashed rounded-xl p-6 text-center bg-white cursor-pointer"
                      style={{ borderColor: "#cbd5e1" }}
                      onClick={() => alert("Navegador de arquivos aberto.")}
                    >
                      <i className="fa-solid fa-file-invoice text-3xl mb-3" style={{ color: "var(--na-green-light)" }} />
                      <div className="text-[13px] font-semibold" style={{ color: "var(--na-green-dark)" }}>
                        Clique ou arraste o PDF/NF aqui
                      </div>
                    </div>
                  </div>

                  <div className={styles.sectionCard}>
                    <h3 className={styles.sectionTitle} style={{ marginBottom: 12, fontSize: 14, color: "var(--text-dark)" }}>
                      <i className="fa-solid fa-scale-balanced" style={{ color: "var(--na-green)" }} /> Malote Contábil (Compliance)
                    </h3>
                    <p className="text-[11px] mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      Como Associação Civil sem fins lucrativos, toda saída de caixa exige comprovação fiscal rigorosa para manutenção da nossa{" "}
                      <strong>Imunidade Tributária (CF Art. 150)</strong>. O BPO atrela automaticamente a NF ao pagamento.
                    </p>
                    <button
                      className={styles.btnPrimary}
                      style={{ width: "100%", padding: 10, borderRadius: 8, fontSize: 12 }}
                      onClick={() =>
                        alert(
                          "Malote Digital gerado com sucesso. Um arquivo ZIP com todos os comprovantes de pagamentos e NFs vinculadas foi enviado para o Contador.",
                        )
                      }
                    >
                      <i className="fa-solid fa-file-zipper" /> Fechar Malote do Mês (Para o Contador)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal CRM */}
      {crmModal && (
        <div className={styles.modalOverlay} onClick={() => setCrmModal(null)}>
          <div className={styles.modalBox} style={{ maxWidth: 550 }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                Gestão de Contato - <span style={{ color: "var(--text-dark)" }}>{crmModal.name}</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setCrmModal(null)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="border rounded-xl p-4 mb-5" style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold uppercase" style={{ color: "var(--text-muted)" }}>
                  <i className="fa-solid fa-building-columns" /> Observação da Diretoria
                </h4>
                <button className={styles.btnSm} style={{ background: "white", border: "1px solid #cbd5e1", color: "var(--text-dark)" }}>
                  <i className="fa-solid fa-pen" /> Editar
                </button>
              </div>

              {crmModal.kind === "danger" ? (
                <div className={`${styles.alertBox} ${styles.alertBoxCritical}`}>
                  <i className="fa-solid fa-triangle-exclamation" />
                  <div>
                    <strong>Alerta Sensível:</strong> Aluno relatou problemas familiares graves recentemente.
                    <br />
                    Diretriz: <em>Não efetuar cobrança ativa neste mês. Acolher na recepção se vier à escola.</em>
                  </div>
                </div>
              ) : (
                <div className={styles.alertBox} style={{ background: "white", border: "1px dashed #cbd5e1", color: "var(--text-muted)" }}>
                  <i className="fa-solid fa-circle-info" />
                  <div>Nenhuma restrição ou observação sensível registrada pela diretoria para este membro.</div>
                </div>
              )}
            </div>

            <div className="border rounded-xl p-4" style={{ borderColor: "#e2e8f0" }}>
              <h4 className="text-xs font-bold uppercase mb-4" style={{ color: "var(--na-green-dark)" }}>
                <i className="fa-solid fa-headset" /> Registro de Atendimento (Agência)
              </h4>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className={styles.formGroup}>
                  <label>Houve Contato?</label>
                  <select className={styles.formSelect} style={{ marginBottom: 0 }}>
                    <option>Sim, respondeu</option>
                    <option>Não respondeu</option>
                    <option>Deixou recado / Caixa Postal</option>
                    <option>Número inválido</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Previsão de Pagamento?</label>
                  <select className={styles.formSelect} style={{ marginBottom: 0 }}>
                    <option>Nenhuma previsão</option>
                    <option>Promessa para esta semana</option>
                    <option>Promessa para o mês que vem</option>
                    <option>Recusou negociação</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Forma de Pagamento Escolhida</label>
                <select className={styles.formSelect}>
                  <option>Ainda não definida</option>
                  <option>Parcelamento no Cartão (Sugerir Antecipação)</option>
                  <option>PIX à vista</option>
                  <option>Boleto Bancário</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Observações Gerais da Negociação</label>
                <textarea className={styles.formTextarea} placeholder="Ex: Aluno informou que o cartão virou e vai pagar pelo link na sexta-feira..." />
              </div>

              <button
                className={`${styles.btnFull} ${styles.btnPrimary}`}
                onClick={() => {
                  alert("Registro salvo com sucesso. O histórico será atualizado.");
                  setCrmModal(null);
                }}
              >
                <i className="fa-solid fa-floppy-disk" /> Salvar Interação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Antecipação */}
      {anticipationTarget && (
        <div className={styles.modalOverlay} onClick={() => anticipationStage === "idle" && setAnticipationTarget(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>Liberação Automática de Caixa</div>
              <button className={styles.closeBtn} onClick={() => setAnticipationTarget(null)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <p className="text-[13px] mb-5" style={{ color: "var(--text-muted)" }}>
              O aluno <strong>{anticipationTarget.name}</strong> renegociou a dívida total de R${" "}
              {anticipationTarget.amount.toFixed(2).replace(".", ",")} no cartão de crédito. Como o aluno assumiu os juros do
              parcelamento, o custo de antecipação para a escola é <strong>ZERO</strong>.
            </p>

            <div className="rounded-xl p-4 mb-5" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div className="flex justify-between mb-2 text-[13px]" style={{ color: "var(--text-muted)" }}>
                <span>Valor total recuperado:</span>
                <span>R$ {anticipationTarget.amount.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between mb-3 text-[13px]" style={{ color: "var(--na-danger)" }}>
                <span>Taxa de Êxito (Agência 20%):</span>
                <span>- R$ {(anticipationTarget.amount * 0.2).toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="border-t border-dashed my-3" style={{ borderColor: "#cbd5e1" }} />
              <div className="flex justify-between text-base font-bold" style={{ color: "var(--na-green-dark)" }}>
                <span>Líquido para a Escola amanhã:</span>
                <span>R$ {(anticipationTarget.amount * 0.8).toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            <div className="text-[11px] text-center mb-4" style={{ color: "var(--text-muted)" }}>
              <i className="fa-solid fa-shield-halved" /> Risco transferido para a operadora do cartão. O caixa da escola está blindado.
            </div>

            <button className={`${styles.btnFull} ${styles.btnSuccess}`} onClick={processAnticipation} disabled={anticipationStage !== "idle"}>
              {anticipationStage === "idle" && (
                <>
                  <i className="fa-solid fa-money-bill-wave" /> Confirmar Antecipação (Receber D+1)
                </>
              )}
              {anticipationStage === "processing" && (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin" /> Processando...
                </>
              )}
              {anticipationStage === "done" && (
                <>
                  <i className="fa-solid fa-check" /> Transferência Agendada!
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Modal Inscrição na Porta */}
      {doorModalOpen && (
        <div className={styles.modalOverlay} onClick={() => doorStage === "idle" && setDoorModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>Inscrição na Recepção</div>
              <button className={styles.closeBtn} onClick={() => setDoorModalOpen(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Selecione o membro no sistema para gerar o pagamento imediato e liberar o acesso.
            </p>
            <select className={styles.formSelect}>
              <option disabled>Digite ou selecione o nome do Membro...</option>
              <option>Luiz Henrique Zanchi Borges</option>
              <option>Gabriel Santos</option>
              <option>Amanda Lima</option>
            </select>
            <div className="rounded-xl p-5 text-center mb-4" style={{ background: "#f8fafc", border: "1px dashed #cbd5e1" }}>
              <i className="fa-solid fa-qrcode text-4xl mb-2" style={{ color: "var(--na-green)" }} />
              <div className="font-bold" style={{ color: "var(--text-dark)" }}>
                Valor: R$ 20,00
              </div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                Apresente este QR Code para o membro pagar no app do banco.
              </div>
            </div>
            <button className={`${styles.btnFull} ${styles.btnSuccess}`} onClick={confirmDoorRegistration} disabled={doorStage === "processing"}>
              {doorStage === "idle" ? (
                <>
                  <i className="fa-solid fa-check-double" /> Confirmar Recebimento e Entrada
                </>
              ) : (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin" /> Processando PIX...
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Modal Anexar NF */}
      {attachModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setAttachModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>Anexar Comprovante Fiscal</div>
              <button className={styles.closeBtn} onClick={() => setAttachModalOpen(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Insira a Nota Fiscal ou Recibo válido referente ao serviço &quot;Gráfica Rápida (Flyers)&quot;.
            </p>
            <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer mb-5" style={{ borderColor: "#cbd5e1", background: "#f8fafc" }}>
              <i className="fa-solid fa-upload text-3xl mb-3" style={{ color: "var(--na-green)" }} />
              <div className="text-[13px] font-semibold" style={{ color: "var(--text-dark)" }}>
                Selecionar Arquivo PDF/XML
              </div>
            </div>
            <button
              className={`${styles.btnFull} ${styles.btnSuccess}`}
              onClick={() => {
                alert("Documento anexado com sucesso! A pendência fiscal foi resolvida.");
                setAttachModalOpen(false);
              }}
            >
              <i className="fa-solid fa-check" /> Salvar Comprovante
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Kpi({
  icon,
  title,
  value,
  valueColor,
  sub,
  subIcon,
  subClass,
  variant,
}: {
  icon: string;
  title: string;
  value: string;
  valueColor?: string;
  sub: string;
  subIcon?: string;
  subClass?: "positive" | "negative";
  variant?: "warning" | "danger" | "gold" | "blue";
}) {
  return (
    <div
      className={`${styles.kpiCard} ${
        variant === "warning"
          ? styles.kpiCardWarning
          : variant === "danger"
            ? styles.kpiCardDanger
            : variant === "gold"
              ? styles.kpiCardGold
              : variant === "blue"
                ? styles.kpiCardBlue
                : ""
      }`}
    >
      <i className={`fa-solid ${icon} ${styles.kpiIcon}`} />
      <div className={styles.kpiTitle}>{title}</div>
      <div className={styles.kpiValue} style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </div>
      <div className={`${styles.kpiSub} ${subClass === "positive" ? styles.kpiSubPositive : subClass === "negative" ? styles.kpiSubNegative : ""}`}>
        {subIcon && <i className={`fa-solid ${subIcon}`} />} {sub}
      </div>
    </div>
  );
}

function TriggerCard({
  title,
  desc,
  checked,
  active,
  danger,
}: {
  title: string;
  desc: string;
  checked: boolean;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className="rounded-lg p-3"
      style={
        danger
          ? { background: "#fff5f5", border: "1px solid #fca5a5" }
          : active
            ? { background: "white", border: "1px solid var(--na-green)", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }
            : { background: "white", border: "1px solid #cbd5e1" }
      }
    >
      <div className="flex justify-between mb-2">
        <span
          className="text-xs font-semibold"
          style={danger ? { color: "#991b1b" } : active ? { color: "var(--na-green-dark)" } : undefined}
        >
          {title}
        </span>
        <input type="checkbox" defaultChecked={checked} readOnly style={{ accentColor: "var(--na-green)" }} />
      </div>
      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
        {desc}
      </div>
    </div>
  );
}
