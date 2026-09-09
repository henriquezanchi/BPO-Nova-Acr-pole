"use client";

import { useState } from "react";
import styles from "./MemberPortal.module.css";

type ModalKey =
  | "gaf"
  | "contribuicao"
  | "historico"
  | "agenda"
  | "estudos"
  | "voluntariado"
  | "ajuda"
  | "cadastro"
  | "pix"
  | "parcelar"
  | "creditos";

const MODAL_TITLES: Record<ModalKey, string> = {
  gaf: "Conhecer o GAF",
  contribuicao: "Minha Contribuição",
  historico: "Histórico & Recibos",
  agenda: "Agenda & Eventos",
  estudos: "Área de Estudos",
  voluntariado: "Voluntariado",
  ajuda: "Central de Ajuda",
  cadastro: "Atualizar Cadastro",
  pix: "Pagar Contribuição via PIX",
  parcelar: "Parcelar pendência no Cartão",
  creditos: "Adicionar Créditos",
};

// Dados de demonstração — serão substituídos por dados reais (Prisma) quando o Supabase estiver conectado.
const MOCK_MEMBER = {
  name: "Luiz Henrique Zanchi Borges",
  registrationNo: "21596",
  city: "Barra do Garças",
  whatsapp: "5562991729783",
  email: "luiz.zanchi@email.com.br",
  fortunaBalance: "42,50",
};

const SECRETARIAS = [
  "Economia",
  "Difusão",
  "Abertura de Turma",
  "Café Sophia",
  "Artes",
  "Manutenção",
  "Escolástica",
];

export default function MemberPortal() {
  const [isDelayed, setIsDelayed] = useState(false);
  const [openModalKey, setOpenModalKey] = useState<ModalKey | null>(null);
  const [oficinaChecked, setOficinaChecked] = useState(false);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  const openModal = (key: ModalKey) => setOpenModalKey(key);
  const closeModal = () => setOpenModalKey(null);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const total = oficinaChecked ? "230,00" : "210,00";

  return (
    <div className={styles.appContainer}>
      <div className={styles.demoBar}>
        <span>Visão da Demonstração</span>
        <button
          className={styles.demoBtn}
          onClick={() => setIsDelayed((v) => !v)}
        >
          Alternar: Em Dia / Atrasado
        </button>
      </div>

      <header className={styles.header}>
        <div className={styles.logoName}>Nova Acrópole</div>

        <div className={styles.memberBadge}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-semibold" style={{ color: "var(--na-gold)" }}>
              <i className="fa-solid fa-id-card" /> PORTAL DO MEMBRO
            </span>
            <button className={styles.btnEditProfile} onClick={() => openModal("cadastro")}>
              <i className="fa-solid fa-pen" /> Editar Dados
            </button>
          </div>

          <div className={styles.memberName}>{MOCK_MEMBER.name}</div>
          <div className={styles.memberDetails}>
            <span>
              <i className="fa-solid fa-location-dot" /> {MOCK_MEMBER.city}
            </span>
            <span>
              Matrícula: <strong>#{MOCK_MEMBER.registrationNo}</strong>
            </span>
          </div>
        </div>
      </header>

      <main className={styles.content}>
        {/* 1. Status em destaque */}
        <div
          className={`${styles.statusCard} ${
            isDelayed ? styles.statusDelayed : styles.statusUpToDate
          }`}
        >
          <div className={styles.statusHeader}>
            <div className={styles.statusIcon}>
              <i className={isDelayed ? "fa-solid fa-circle-exclamation" : "fa-solid fa-check"} />
            </div>
            <div>
              <h4 className={styles.statusTitle}>
                {isDelayed ? "Contribuição Pendente" : "Contribuição em Dia"}
              </h4>
              <p className={styles.statusDesc}>
                {isDelayed ? (
                  <>
                    Olá, Luiz. Sua contribuição deste mês está <strong>atrasada</strong>.
                  </>
                ) : (
                  "Olá, Luiz. Sua contribuição deste mês está em dia."
                )}
              </p>
            </div>
          </div>

          {!isDelayed ? (
            <div
              className="text-[11px] flex justify-between p-[10px] rounded-lg"
              style={{ background: "rgba(255,255,255,0.7)" }}
            >
              <span>
                <i className="fa-regular fa-credit-card" /> Cartão cadastrado (Débito Automático)
              </span>
              <span className="font-semibold" style={{ color: "var(--success-text)" }}>
                Ativo
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={() => openModal("pix")}
              >
                <i className="fa-brands fa-pix" /> Pagar Contribuição
              </button>
              <button
                className={`${styles.btn} ${styles.btnOutline}`}
                style={{ borderColor: "#fca5a5", color: "#b91c1c" }}
                onClick={() => openModal("parcelar")}
              >
                <i className="fa-solid fa-handshake" /> Parcelar pendência no Cartão
              </button>
            </div>
          )}
        </div>

        {/* 2. Carteira Fortuna */}
        <section className={styles.walletCard}>
          <div className={styles.walletHeader}>
            <span className={styles.walletTag}>
              <i className="fa-solid fa-mug-hot" /> CARTEIRA DIGITAL FORTUNA
            </span>
          </div>
          <div className={styles.walletBalanceBox}>
            <div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Saldo atual na lanchonete
              </div>
              <div className={styles.walletBalanceNum}>R$ {MOCK_MEMBER.fortunaBalance}</div>
            </div>
            <button
              className={`${styles.btn} ${styles.btnPrimary} ${styles.btnAuto}`}
              style={{ padding: "8px 14px", fontSize: 12 }}
              onClick={() => openModal("creditos")}
            >
              <i className="fa-solid fa-plus" /> Adicionar Créditos
            </button>
          </div>
        </section>

        {/* 3. Grid de funcionalidades */}
        <section className={styles.featuresGrid}>
          <div
            className={styles.featureItem}
            style={{ gridColumn: "span 2", borderColor: "var(--na-gold)", background: "#fdfaf5" }}
            onClick={() => openModal("gaf")}
          >
            <div className="flex items-center gap-4">
              <div
                className={styles.featureIcon}
                style={{
                  width: 44,
                  height: 44,
                  fontSize: 20,
                  background: "rgba(197, 160, 89, 0.15)",
                  color: "var(--na-gold)",
                }}
              >
                <i className="fa-solid fa-users-rays" />
              </div>
              <div>
                <h5 style={{ fontSize: 14, color: "var(--na-green-dark)" }}>
                  Grupo de Acompanhamento (GAF)
                </h5>
                <p style={{ fontSize: 11, marginTop: 2 }}>Conheça e faça sua adesão ao grupo</p>
              </div>
            </div>
          </div>

          <FeatureCard icon="fa-leaf" title="Minha Contribuição" desc="Composição e apoios" onClick={() => openModal("contribuicao")} />
          <FeatureCard icon="fa-file-invoice-dollar" title="Histórico & Recibos" desc="Emissão de comprovantes" onClick={() => openModal("historico")} />
          <FeatureCard icon="fa-calendar-check" title="Agenda & Eventos" desc="Palestras e Turmas" onClick={() => openModal("agenda")} />
          <FeatureCard icon="fa-book-open" title="Área de Estudos" desc="Biblioteca e apostilas" onClick={() => openModal("estudos")} />
          <FeatureCard icon="fa-hand-holding-heart" title="Voluntariado" desc="Secretarias e mutirões" onClick={() => openModal("voluntariado")} />
          <FeatureCard icon="fa-regular fa-life-ring" title="Central de Ajuda" desc="Fale com a Economia" onClick={() => openModal("ajuda")} />
        </section>
      </main>

      <a
        href={`https://wa.me/${MOCK_MEMBER.whatsapp}?text=Ol%C3%A1,%20preciso%20de%20ajuda%20com%20o%20Portal%20do%20Membro`}
        target="_blank"
        rel="noreferrer"
        className={styles.whatsappFloat}
      >
        <i className="fa-brands fa-whatsapp" />
      </a>

      {openModalKey && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>{MODAL_TITLES[openModalKey]}</div>
              <button className={styles.closeBtn} onClick={closeModal}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {openModalKey === "gaf" && (
              <div className="text-left">
                <div className="text-center mb-5">
                  <i className="fa-solid fa-users-rays text-4xl mb-3" style={{ color: "var(--na-gold)" }} />
                  <h4 style={{ fontSize: 16, color: "var(--na-green-dark)", fontWeight: 700 }}>
                    O que é o GAF?
                  </h4>
                </div>
                <p className="text-[13px] mb-3 leading-relaxed" style={{ color: "var(--text-dark)" }}>
                  O <strong>Grupo de Acompanhamento Filosófico (GAF)</strong> é um espaço criado para
                  apoiar o aluno em sua jornada de vivência prática da filosofia.
                </p>
                <ul
                  className="text-xs mb-5 pl-5 leading-relaxed list-disc"
                  style={{ color: "var(--text-muted)" }}
                >
                  <li>Encontros periódicos focados no desenvolvimento humano.</li>
                  <li>Acompanhamento próximo por instrutores.</li>
                  <li>Troca de vivências para aplicar o idealismo.</li>
                </ul>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => {
                    alert(
                      "Que alegria! Sua intenção de adesão ao GAF foi registrada. Em breve nosso coordenador entrará em contato com você.",
                    );
                    closeModal();
                  }}
                >
                  <i className="fa-solid fa-hand-holding-heart" /> Solicitar adesão ao GAF
                </button>
              </div>
            )}

            {openModalKey === "contribuicao" && (
              <div className="text-left">
                <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                  Gerencie os itens da composição da sua contribuição mensal:
                </p>

                <div
                  className="rounded-xl p-3 mb-4"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <CompositionLine label="Contribuição de Membro" value="R$ 130,00" />
                  <CompositionLine label="Recarga Automática Fortuna" value="R$ 50,00" />
                  <CompositionLine label="Doação - PCPB" value="R$ 30,00" />
                  {oficinaChecked && (
                    <div
                      className={`${styles.slideDownFade} flex justify-between text-[13px] mb-2`}
                      style={{ color: "var(--na-green-dark)" }}
                    >
                      <span>
                        <i className="fa-solid fa-check" style={{ color: "var(--na-green)" }} /> Oficina
                        de Pintura e Artesanato
                      </span>
                      <strong>R$ 20,00</strong>
                    </div>
                  )}
                  <hr className="my-2 border-dashed" style={{ borderColor: "#cbd5e1" }} />
                  <div
                    className="flex justify-between text-sm font-bold"
                    style={{ color: "var(--na-green-dark)" }}
                  >
                    <span>Total da Composição</span>
                    <span>R$ {total}/mês</span>
                  </div>
                </div>

                <div className="font-bold text-[13px] mb-2" style={{ color: "var(--text-dark)" }}>
                  Adicionar Apoios e Oficinas
                </div>

                <label
                  className="flex justify-between items-center p-[10px] rounded-lg mb-2 cursor-pointer"
                  style={{ border: "1px solid #e5e7eb" }}
                >
                  <div>
                    <div className="text-xs font-semibold">Oficina de Pintura e Artesanato</div>
                    <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      + R$ 20,00 mensais
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={oficinaChecked}
                    onChange={(e) => setOficinaChecked(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: "var(--na-green)", cursor: "pointer" }}
                  />
                </label>

                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => {
                    alert("Composição atualizada! O novo valor será cobrado no próximo ciclo.");
                    closeModal();
                  }}
                >
                  <i className="fa-solid fa-rotate" /> Atualizar Minha Contribuição
                </button>
              </div>
            )}

            {openModalKey === "ajuda" && (
              <div className="text-center p-[10px]">
                <i
                  className="fa-regular fa-comments text-3xl mb-3"
                  style={{ color: "var(--na-gold)" }}
                />
                <div className="font-semibold text-[15px] mb-2">Fale com a Economia</div>
                <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                  Precisa de ajuda com sua composição, recibos ou tem alguma dúvida? Nossa equipe
                  está pronta para te atender via WhatsApp.
                </p>
                <a
                  href={`https://wa.me/${MOCK_MEMBER.whatsapp}?text=Ol%C3%A1,%20preciso%20de%20ajuda%20com%20o%20Portal%20do%20Membro`}
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={closeModal}
                >
                  <i className="fa-brands fa-whatsapp" /> Chamar no WhatsApp
                </a>
              </div>
            )}

            {openModalKey === "cadastro" && (
              <div className="flex flex-col text-left">
                <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                  Mantenha seus dados atualizados para receber os comunicados e informativos da
                  escola.
                </p>
                <div className={styles.formGroup}>
                  <label>Nome Completo</label>
                  <input className={styles.formInput} defaultValue={MOCK_MEMBER.name} />
                </div>
                <div className="flex gap-[10px]">
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label>WhatsApp</label>
                    <input className={styles.formInput} defaultValue="(62) 99172-9783" />
                  </div>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label>Data de Nasc.</label>
                    <input type="date" className={styles.formInput} defaultValue="1990-01-01" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>E-mail</label>
                  <input type="email" className={styles.formInput} defaultValue={MOCK_MEMBER.email} />
                </div>
                <div className={styles.formGroup}>
                  <label>Profissão</label>
                  <input className={styles.formInput} placeholder="Ex: Engenheiro, Professor..." />
                </div>
                <div className={styles.formGroup} style={{ marginBottom: 20 }}>
                  <label>Endereço Completo</label>
                  <input className={styles.formInput} placeholder="Rua, Número, Bairro - CEP" />
                </div>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => {
                    alert("Dados atualizados com sucesso no sistema da escola!");
                    closeModal();
                  }}
                >
                  <i className="fa-solid fa-floppy-disk" /> Salvar Alterações
                </button>
              </div>
            )}

            {openModalKey === "historico" && (
              <div>
                <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                  Consulte suas contribuições anteriores e emita seus comprovantes.
                </p>
                {[
                  { periodo: "Agosto/2026", valor: "210,00", data: "10/08/2026" },
                  { periodo: "Julho/2026", valor: "210,00", data: "10/07/2026" },
                  { periodo: "Junho/2026", valor: "130,00", data: "08/06/2026" },
                ].map((r) => (
                  <div className={styles.listItem} key={r.periodo}>
                    <div>
                      <div className={styles.listItemTitle}>
                        {r.periodo}{" "}
                        <span style={{ color: "var(--na-green)", marginLeft: 6 }}>R$ {r.valor}</span>
                      </div>
                      <div className={styles.listItemSub} style={{ color: "var(--success-text)", marginTop: 2 }}>
                        <i className="fa-solid fa-check-double" /> Pago em {r.data}
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        className={`${styles.btn} ${styles.btnOutline} ${styles.btnAuto}`}
                        style={{ padding: "6px 10px", fontSize: 11 }}
                        onClick={() => alert("Download do PDF iniciado!")}
                        title="Baixar PDF"
                      >
                        <i className="fa-solid fa-download" />
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnOutline} ${styles.btnAuto}`}
                        style={{ padding: "6px 10px", fontSize: 11 }}
                        onClick={() => alert(`Recibo enviado com sucesso para ${MOCK_MEMBER.email}!`)}
                        title="Enviar por E-mail"
                      >
                        <i className="fa-solid fa-envelope" />
                      </button>
                    </div>
                  </div>
                ))}
                <button className={`${styles.btn} ${styles.btnOutline}`} style={{ marginTop: 10 }}>
                  Carregar meses anteriores
                </button>
              </div>
            )}

            {openModalKey === "agenda" && (
              <div>
                <div className={styles.listItem} style={{ flexDirection: "column", alignItems: "flex-start", gap: 10, borderColor: "var(--na-gold)" }}>
                  <div className="w-full">
                    <div className={styles.listItemTitle} style={{ color: "var(--na-green-dark)", fontSize: 14 }}>
                      A Odisseia: Quem Não Governa a Si Mesmo, Não Governa Ítaca
                    </div>
                    <div className={styles.listItemSub} style={{ marginTop: 4 }}>
                      <i className="fa-regular fa-calendar" /> Sábado, 29 de Agosto às 19h
                    </div>
                    <div className={styles.listItemSub} style={{ marginTop: 2 }}>
                      <i className="fa-solid fa-location-dot" /> Auditório Principal
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-bold" style={{ color: "var(--success-text)" }}>
                      Entrada Gratuita
                    </span>
                    <button
                      className={`${styles.btn} ${styles.btnPrimary} ${styles.btnAuto}`}
                      style={{ padding: "8px 16px", fontSize: 12 }}
                      onClick={() => {
                        alert("Inscrição confirmada!");
                        closeModal();
                      }}
                    >
                      <i className="fa-solid fa-check" /> Garantir Vaga
                    </button>
                  </div>
                </div>

                <div className={styles.listItem} style={{ flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
                  <div className="w-full">
                    <div className={styles.listItemTitle} style={{ fontSize: 14 }}>
                      Oficina de Pintura e Artesanato
                    </div>
                    <div className={styles.listItemSub} style={{ marginTop: 4 }}>
                      <i className="fa-regular fa-calendar" /> Sexta, 04 de Setembro às 19h
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-bold" style={{ color: "var(--text-dark)" }}>
                      Vagas Limitadas
                    </span>
                    <button
                      className={`${styles.btn} ${styles.btnPrimary} ${styles.btnAuto}`}
                      style={{ padding: "8px 16px", fontSize: 12 }}
                      onClick={() => {
                        alert("Inscrição confirmada!");
                        closeModal();
                      }}
                    >
                      <i className="fa-solid fa-check" /> Inscrever-se
                    </button>
                  </div>
                </div>

                <div
                  className={styles.listItem}
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 10,
                    background: "var(--na-green-light)",
                    borderColor: "var(--na-green)",
                  }}
                >
                  <div className="w-full">
                    <div className={styles.listItemTitle} style={{ fontSize: 14, color: "var(--na-green-dark)" }}>
                      Abertura de Nova Turma: Curso de Filosofia
                    </div>
                    <div className={styles.listItemSub} style={{ marginTop: 4 }}>
                      <i className="fa-regular fa-calendar" /> Terça, 15 de Setembro às 20h
                    </div>
                    <p className="text-[11px] mt-2" style={{ color: "var(--text-dark)" }}>
                      Ajude a espalhar a filosofia! Convide seus amigos para esta nova jornada.
                    </p>
                  </div>
                  <div className="flex gap-2 w-full">
                    <button
                      className={`${styles.btn} ${styles.btnOutline}`}
                      style={{ flex: 1, padding: 8, fontSize: 11, borderColor: "#25D366", color: "#128C7E" }}
                      onClick={() => alert("Convite copiado e pronto para colar no WhatsApp!")}
                    >
                      <i className="fa-brands fa-whatsapp" /> Enviar a um amigo
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnOutline}`}
                      style={{ flex: 1, padding: 8, fontSize: 11, borderColor: "#E1306C", color: "#C13584" }}
                      onClick={() => alert("Imagem do convite gerada para o seu Story!")}
                    >
                      <i className="fa-brands fa-instagram" /> Postar no Story
                    </button>
                  </div>
                </div>
              </div>
            )}

            {openModalKey === "voluntariado" && (
              <div className="text-left">
                <div className="font-bold text-sm mb-2" style={{ color: "var(--na-green-dark)" }}>
                  Mutirões e Escalas
                </div>
                <div className={styles.listItem} style={{ marginBottom: 20 }}>
                  <div>
                    <div className={styles.listItemTitle}>Sábado de Integração</div>
                    <div className={styles.listItemSub}>Manutenção e Café Compartilhado (29/08)</div>
                  </div>
                  <button
                    className={`${styles.btn} ${styles.btnPrimary} ${styles.btnAuto}`}
                    style={{ padding: "6px 12px", fontSize: 11 }}
                    onClick={() => {
                      alert("Nome adicionado à escala de voluntários!");
                      closeModal();
                    }}
                  >
                    Confirmar
                  </button>
                </div>

                <div
                  className="font-bold text-sm mb-1.5 pt-4"
                  style={{ color: "var(--na-green-dark)", borderTop: "1px solid #e5e7eb" }}
                >
                  Apoio nas Secretarias
                </div>
                <p className="text-[11px] mb-3" style={{ color: "var(--text-muted)" }}>
                  Ofereça-se para ajudar no funcionamento da escola nas seguintes frentes:
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {SECRETARIAS.map((sec) => (
                    <span
                      key={sec}
                      className={`${styles.secTag} ${activeTags.has(sec) ? styles.secTagActive : ""}`}
                      onClick={() => toggleTag(sec)}
                    >
                      {sec}
                    </span>
                  ))}
                </div>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => {
                    alert("Obrigado! O responsável pela secretaria entrará em contato com você.");
                    closeModal();
                  }}
                >
                  <i className="fa-solid fa-hand-holding-heart" /> Me oferecer para apoiar
                </button>
              </div>
            )}

            {openModalKey === "estudos" && (
              <div className="text-center p-5">
                <i className="fa-solid fa-lock-open text-3xl mb-3" style={{ color: "var(--na-gold)" }} />
                <div className="font-semibold text-[15px] mb-2">Acesso Liberado</div>
                <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                  Sua contribuição está em dia. Bons estudos!
                </p>
                <div className="flex flex-col gap-2.5">
                  <a
                    href="https://biblioteca.acropolebrasil.com.br/"
                    target="_blank"
                    rel="noreferrer"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                  >
                    <i className="fa-solid fa-book-open-reader" /> Acessar Biblioteca
                  </a>
                  <button
                    className={`${styles.btn} ${styles.btnOutline}`}
                    onClick={() => {
                      alert("Carregando apostilas em PDF...");
                      closeModal();
                    }}
                  >
                    <i className="fa-solid fa-file-pdf" /> Acessar Apostilas
                  </button>
                </div>
              </div>
            )}

            {openModalKey === "pix" && (
              <div className="text-center">
                <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                  Escaneie o código abaixo com o app do seu banco:
                </p>
                <div
                  className="mx-auto mb-4 flex items-center justify-center rounded-xl"
                  style={{
                    width: 160,
                    height: 160,
                    border: "2px dashed #cbd5e1",
                    background: "#f8fafc",
                    color: "var(--na-green)",
                  }}
                >
                  <i className="fa-solid fa-qrcode fa-5x" />
                </div>
                <div className="text-base font-bold mb-4" style={{ color: "var(--na-green-dark)" }}>
                  Valor: R$ 130,00
                </div>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => {
                    alert("Código Copiado!");
                    closeModal();
                  }}
                >
                  <i className="fa-solid fa-copy" /> Copiar Código PIX
                </button>
              </div>
            )}

            {openModalKey === "parcelar" && (
              <div>
                <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                  Selecione como deseja regularizar sua contribuição pendente (R$ 130,00):
                </p>
                <div className="flex flex-col gap-2 mb-4">
                  <label
                    className="flex justify-between p-3 rounded-lg"
                    style={{ border: "1px solid var(--na-gold)", background: "#fffbeb" }}
                  >
                    <span className="font-semibold text-xs">1x de R$ 130,00 no Cartão</span>
                    <input type="radio" name="parc" defaultChecked style={{ accentColor: "var(--na-green)", width: 16, height: 16 }} />
                  </label>
                  <label className="flex justify-between p-3 rounded-lg" style={{ border: "1px solid #e5e7eb" }}>
                    <span className="font-semibold text-xs" style={{ color: "var(--text-muted)" }}>
                      2x de R$ 68,50 no Cartão
                    </span>
                    <input type="radio" name="parc" style={{ accentColor: "var(--na-green)", width: 16, height: 16 }} />
                  </label>
                </div>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => {
                    alert("Cartão Processado. Obrigado!");
                    closeModal();
                  }}
                >
                  <i className="fa-solid fa-credit-card" /> Processar Pagamento
                </button>
              </div>
            )}

            {openModalKey === "creditos" && (
              <div>
                <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                  Escolha o valor que deseja recarregar no Fortuna via PIX:
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button className={`${styles.btn} ${styles.btnOutline}`} style={{ padding: "12px 0" }}>
                    R$ 20
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnOutline}`}
                    style={{
                      padding: "12px 0",
                      borderColor: "var(--na-green)",
                      color: "var(--na-green)",
                      fontWeight: 700,
                      background: "var(--na-green-light)",
                    }}
                  >
                    R$ 50
                  </button>
                  <button className={`${styles.btn} ${styles.btnOutline}`} style={{ padding: "12px 0" }}>
                    R$ 100
                  </button>
                </div>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => {
                    alert("PIX de Recarga gerado. Escaneie para liberar o saldo.");
                    closeModal();
                  }}
                >
                  <i className="fa-brands fa-pix" /> Gerar PIX de R$ 50,00
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: string;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <div className={styles.featureItem} onClick={onClick}>
      <div className={styles.featureIcon}>
        <i className={icon.startsWith("fa-regular") ? icon : `fa-solid ${icon}`} />
      </div>
      <h5>{title}</h5>
      <p>{desc}</p>
    </div>
  );
}

function CompositionLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between mb-2 text-[13px]">
      <span>
        <i className="fa-solid fa-check" style={{ color: "var(--na-green)" }} /> {label}
      </span>
      <strong>{value}</strong>
    </div>
  );
}
