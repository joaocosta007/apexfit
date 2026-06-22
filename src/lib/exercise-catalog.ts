export type ExerciseCatalogItem = {
  id: string;
  name: string;
  group: string;
  videoUrl: string | null;
};

export const exerciseCatalog: ExerciseCatalogItem[] = [
  // ── Peitoral ──────────────────────────────────────────────────────────────
  { id: "supino-reto-maquina",            name: "Supino Reto Máquina",                    group: "Peitoral",          videoUrl: null },
  { id: "supino-inclinado-maquina",       name: "Supino Inclinado Máquina",               group: "Peitoral",          videoUrl: null },
  { id: "supino-reto-barra",              name: "Supino Reto Barra",                      group: "Peitoral",          videoUrl: "https://www.youtube.com/watch?v=UHa9U-O09_U" },
  { id: "supino-inclinado-barra",         name: "Supino Inclinado Barra",                 group: "Peitoral",          videoUrl: null },
  { id: "supino-reto-halteres",           name: "Supino Reto com Halteres",               group: "Peitoral",          videoUrl: null },
  { id: "supino-inclinado-halteres",      name: "Supino Inclinado com Halteres",          group: "Peitoral",          videoUrl: null },
  { id: "supino-declinado-barra",         name: "Supino Declinado Barra",                 group: "Peitoral",          videoUrl: null },
  { id: "supino-declinado-halteres",      name: "Supino Declinado com Halteres",          group: "Peitoral",          videoUrl: null },
  { id: "crucifixo-maquina",              name: "Crucifixo Máquina",                      group: "Peitoral",          videoUrl: null },
  { id: "crucifixo-polia-alta",           name: "Crucifixo Polia Alta",                   group: "Peitoral",          videoUrl: "https://www.youtube.com/watch?v=_hdQD_E3deE" },
  { id: "crucifixo-polia-baixa",          name: "Crucifixo Polia Baixa",                  group: "Peitoral",          videoUrl: null },
  { id: "crucifixo-polia-meio",           name: "Crucifixo Polia Meio",                   group: "Peitoral",          videoUrl: null },

  // ── Costas ────────────────────────────────────────────────────────────────
  { id: "pulley-maquina",                 name: "Pulley Máquina",                         group: "Costas",            videoUrl: null },
  { id: "pulley-frente-aberta-reta",      name: "Pulley Frente Aberta Barra Reta",        group: "Costas",            videoUrl: "https://www.youtube.com/watch?v=4-PsgYmkDsM" },
  { id: "pulley-frente-aberta-anatomica", name: "Pulley Frente Aberta Barra Anatômica",   group: "Costas",            videoUrl: null },
  { id: "pulley-frente-triangulo",        name: "Pulley Frente Triângulo",                group: "Costas",            videoUrl: null },
  { id: "pulley-frente-supinada-fechada", name: "Pulley Frente Supinada Fechada",         group: "Costas",            videoUrl: null },
  { id: "pulley-frente-pronada-fechada",  name: "Pulley Frente Pronada Fechada",          group: "Costas",            videoUrl: null },
  { id: "remada-articulada",              name: "Remada Articulada",                      group: "Costas",            videoUrl: null },
  { id: "remada-maquina-neutra",          name: "Remada Máquina Neutra",                  group: "Costas",            videoUrl: null },
  { id: "remada-maquina-pronada",         name: "Remada Máquina Pronada",                 group: "Costas",            videoUrl: null },
  { id: "remada-maquina-supinada",        name: "Remada Máquina Supinada",                group: "Costas",            videoUrl: null },
  { id: "remada-baixa-pronada",           name: "Remada Baixa Pronada",                   group: "Costas",            videoUrl: "https://www.youtube.com/watch?v=ICLgUtIo-Ec" },
  { id: "remada-baixa-neutra",            name: "Remada Baixa Neutra",                    group: "Costas",            videoUrl: null },
  { id: "remada-baixa-supinada",          name: "Remada Baixa Supinada",                  group: "Costas",            videoUrl: null },
  { id: "remada-cavalinho-triangulo",     name: "Remada Cavalinho Triângulo",             group: "Costas",            videoUrl: null },
  { id: "remada-curvada-supinada",        name: "Remada Curvada Supinada",                group: "Costas",            videoUrl: null },
  { id: "remada-curvada-pronada",         name: "Remada Curvada Pronada",                 group: "Costas",            videoUrl: null },
  { id: "remada-curvada-supinada-polia",  name: "Remada Curvada Supinada na Polia",       group: "Costas",            videoUrl: null },
  { id: "remada-curvada-pronada-polia",   name: "Remada Curvada Pronada na Polia",        group: "Costas",            videoUrl: null },
  { id: "serrote-neutra",                 name: "Serrote Neutra",                         group: "Costas",            videoUrl: null },
  { id: "serrote-pronada",                name: "Serrote Pronada",                        group: "Costas",            videoUrl: null },

  // ── Ombros ────────────────────────────────────────────────────────────────
  { id: "desenvolvimento-maquina",        name: "Desenvolvimento Máquina",                group: "Ombros",            videoUrl: null },
  { id: "desenvolvimento-halteres",       name: "Desenvolvimento com Halteres",           group: "Ombros",            videoUrl: "https://www.youtube.com/watch?v=DFXtzdXN_iY" },
  { id: "desenvolvimento-smith",          name: "Desenvolvimento no Smith",               group: "Ombros",            videoUrl: null },
  { id: "desenvolvimento-barra-livre",    name: "Desenvolvimento Barra Livre",            group: "Ombros",            videoUrl: null },
  { id: "desenvolvimento-arnold",         name: "Desenvolvimento Arnold",                 group: "Ombros",            videoUrl: null },
  { id: "elevacao-lateral-halteres",      name: "Elevação Lateral com Halteres",          group: "Ombros",            videoUrl: "https://www.youtube.com/watch?v=di4CCpLzsY0" },
  { id: "elevacao-lateral-polia",         name: "Elevação Lateral na Polia",              group: "Ombros",            videoUrl: null },
  { id: "elevacao-frontal-halteres",      name: "Elevação Frontal com Halteres",          group: "Ombros",            videoUrl: null },
  { id: "elevacao-frontal-polia-reta",    name: "Elevação Frontal Polia Barra Reta",      group: "Ombros",            videoUrl: null },
  { id: "elevacao-frontal-polia-corda",   name: "Elevação Frontal Polia Corda",           group: "Ombros",            videoUrl: null },
  { id: "elevacao-frontal-polia-uni",     name: "Elevação Frontal Polia Unilateral",      group: "Ombros",            videoUrl: null },
  { id: "crucifixo-inverso-maquina",      name: "Crucifixo Inverso Máquina",              group: "Ombros",            videoUrl: null },
  { id: "crucifixo-inverso-polia",        name: "Crucifixo Inverso Polia",                group: "Ombros",            videoUrl: null },
  { id: "crucifixo-inverso-polia-uni",    name: "Crucifixo Inverso Polia Unilateral",     group: "Ombros",            videoUrl: null },
  { id: "crucifixo-inverso-halteres",     name: "Crucifixo Inverso com Halteres",         group: "Ombros",            videoUrl: null },

  // ── Bíceps ────────────────────────────────────────────────────────────────
  { id: "rosca-direta-polia-reta",        name: "Rosca Direta Polia Barra Reta",          group: "Bíceps",            videoUrl: null },
  { id: "rosca-polia-corda",              name: "Rosca na Polia Corda",                   group: "Bíceps",            videoUrl: null },
  { id: "rosca-polia-unilateral",         name: "Rosca Polia Unilateral",                 group: "Bíceps",            videoUrl: null },
  { id: "rosca-direta-barra-w",           name: "Rosca Direta Barra W",                   group: "Bíceps",            videoUrl: null },
  { id: "rosca-direta-halteres",          name: "Rosca Direta com Halteres",              group: "Bíceps",            videoUrl: null },
  { id: "rosca-martelo-alternada",        name: "Rosca Martelo Alternada",                group: "Bíceps",            videoUrl: null },
  { id: "rosca-direta-martelo",           name: "Rosca Direta Martelo",                   group: "Bíceps",            videoUrl: null },
  { id: "rosca-martelo-barra-h",          name: "Rosca Martelo Barra H",                  group: "Bíceps",            videoUrl: null },
  { id: "rosca-alternada",                name: "Rosca Alternada",                        group: "Bíceps",            videoUrl: null },
  { id: "rosca-direta-banco-45",          name: "Rosca Direta Banco 45°",                 group: "Bíceps",            videoUrl: null },
  { id: "rosca-martelo-banco-45",         name: "Rosca Martelo Alternada Banco 45°",      group: "Bíceps",            videoUrl: null },
  { id: "rosca-concentrada",              name: "Rosca Concentrada",                      group: "Bíceps",            videoUrl: null },
  { id: "rosca-scott-barra-w",            name: "Rosca Scott Barra W",                    group: "Bíceps",            videoUrl: null },
  { id: "rosca-scott-unilateral",         name: "Rosca Scott Unilateral",                 group: "Bíceps",            videoUrl: null },
  { id: "rosca-maquina",                  name: "Rosca Máquina",                          group: "Bíceps",            videoUrl: null },

  // ── Tríceps ───────────────────────────────────────────────────────────────
  { id: "triceps-testa-halteres",         name: "Tríceps Testa com Halteres",             group: "Tríceps",           videoUrl: null },
  { id: "triceps-testa-barra",            name: "Tríceps Testa Barra",                    group: "Tríceps",           videoUrl: null },
  { id: "triceps-testa-polia-reta",       name: "Tríceps Testa na Polia Barra Reta",      group: "Tríceps",           videoUrl: null },
  { id: "triceps-testa-polia-corda",      name: "Tríceps Testa na Polia com Corda",       group: "Tríceps",           videoUrl: null },
  { id: "triceps-frances-halter",         name: "Tríceps Francês Sentado com Halter",     group: "Tríceps",           videoUrl: null },
  { id: "triceps-frances-barra",          name: "Tríceps Francês Sentado com Barra",      group: "Tríceps",           videoUrl: null },
  { id: "triceps-frances-polia-reta",     name: "Tríceps Francês Polia Barra Reta",       group: "Tríceps",           videoUrl: null },
  { id: "triceps-frances-polia-corda",    name: "Tríceps Francês Polia Corda",            group: "Tríceps",           videoUrl: "https://www.youtube.com/watch?v=-9QOMRXUSIg" },
  { id: "triceps-frances-polia-uni",      name: "Tríceps Francês Polia Unilateral",       group: "Tríceps",           videoUrl: null },
  { id: "triceps-frances-halter-uni",     name: "Tríceps Francês Halter Unilateral",      group: "Tríceps",           videoUrl: null },
  { id: "triceps-mergulho",               name: "Tríceps Mergulho",                       group: "Tríceps",           videoUrl: null },
  { id: "triceps-polia-barra",            name: "Tríceps Polia Barra",                    group: "Tríceps",           videoUrl: "https://www.youtube.com/watch?v=-QGC1cL6ETE" },
  { id: "triceps-polia-corda",            name: "Tríceps Polia Corda",                    group: "Tríceps",           videoUrl: null },
  { id: "triceps-polia-barra-inversa",    name: "Tríceps Polia Barra Inversa",            group: "Tríceps",           videoUrl: null },
  { id: "triceps-polia-unilateral",       name: "Tríceps Polia Unilateral",               group: "Tríceps",           videoUrl: null },
  { id: "triceps-coice-halteres",         name: "Tríceps Coice com Halteres",             group: "Tríceps",           videoUrl: null },
  { id: "triceps-coice-polia",            name: "Tríceps Coice na Polia",                 group: "Tríceps",           videoUrl: null },

  // ── Trapézio ──────────────────────────────────────────────────────────────
  { id: "remada-alta-polia-reta",         name: "Remada Alta Polia Barra Reta",           group: "Trapézio",          videoUrl: null },
  { id: "remada-alta-polia-corda",        name: "Remada Alta Polia Corda",                group: "Trapézio",          videoUrl: null },
  { id: "remada-alta-barra-w",            name: "Remada Alta Barra W",                    group: "Trapézio",          videoUrl: null },
  { id: "remada-alta-smith",              name: "Remada Alta no Smith",                   group: "Trapézio",          videoUrl: null },
  { id: "encolhimento-halteres",          name: "Encolhimento com Halteres",              group: "Trapézio",          videoUrl: null },

  // ── Quadríceps ────────────────────────────────────────────────────────────
  { id: "agachamento-taca",               name: "Agachamento Taça",                       group: "Quadríceps",        videoUrl: null },
  { id: "agachamento-trx",                name: "Agachamento TRX",                        group: "Quadríceps",        videoUrl: null },
  { id: "agachamento-hack",               name: "Agachamento Hack",                       group: "Quadríceps",        videoUrl: null },
  { id: "agachamento-hack-invertido",     name: "Agachamento Hack Invertido",             group: "Quadríceps",        videoUrl: null },
  { id: "agachamento-barra-hexagonal",    name: "Agachamento Barra Hexagonal",            group: "Quadríceps",        videoUrl: null },
  { id: "leg-press-horizontal",           name: "Leg Press Horizontal",                   group: "Quadríceps",        videoUrl: "https://www.youtube.com/watch?v=OlWE5rOjS5o" },
  { id: "leg-press-horizontal-uni",       name: "Leg Press Horizontal Unilateral",        group: "Quadríceps",        videoUrl: null },
  { id: "leg-press-45",                   name: "Leg Press 45°",                          group: "Quadríceps",        videoUrl: null },
  { id: "leg-press-45-uni",               name: "Leg Press 45° Unilateral",               group: "Quadríceps",        videoUrl: null },
  { id: "cadeira-extensora",              name: "Cadeira Extensora",                      group: "Quadríceps",        videoUrl: "https://www.youtube.com/watch?v=qBbuym_tXrs" },
  { id: "cadeira-extensora-uni",          name: "Cadeira Extensora Unilateral",           group: "Quadríceps",        videoUrl: null },
  { id: "afundo",                         name: "Afundo",                                 group: "Quadríceps",        videoUrl: null },
  { id: "afundo-halteres",                name: "Afundo com Halteres",                    group: "Quadríceps",        videoUrl: null },
  { id: "afundo-trx",                     name: "Afundo no TRX",                          group: "Quadríceps",        videoUrl: null },
  { id: "afundo-step-atras",              name: "Afundo com Step Atrás",                  group: "Quadríceps",        videoUrl: null },
  { id: "avanco-unilateral",              name: "Avanço Unilateral",                      group: "Quadríceps",        videoUrl: null },
  { id: "avanco-alternada",               name: "Avanço Alternada",                       group: "Quadríceps",        videoUrl: null },
  { id: "passada",                        name: "Passada",                                group: "Quadríceps",        videoUrl: null },
  { id: "bulgaro-halteres",               name: "Búlgaro com Halteres",                   group: "Quadríceps",        videoUrl: null },
  { id: "bulgaro-maquina",                name: "Búlgaro na Máquina",                     group: "Quadríceps",        videoUrl: null },
  { id: "bulgaro-smith",                  name: "Búlgaro no Smith",                       group: "Quadríceps",        videoUrl: null },

  // ── Posterior de Coxas ────────────────────────────────────────────────────
  { id: "mesa-flexora",                   name: "Mesa Flexora",                           group: "Posterior de Coxas", videoUrl: "https://www.youtube.com/watch?v=umxlbgCK6oc" },
  { id: "mesa-flexora-uni",               name: "Mesa Flexora Unilateral",                group: "Posterior de Coxas", videoUrl: null },
  { id: "cadeira-flexora",                name: "Cadeira Flexora",                        group: "Posterior de Coxas", videoUrl: null },
  { id: "cadeira-flexora-uni",            name: "Cadeira Flexora Unilateral",             group: "Posterior de Coxas", videoUrl: null },
  { id: "stiff-halteres",                 name: "Stiff com Halteres",                     group: "Posterior de Coxas", videoUrl: null },
  { id: "stiff-barra",                    name: "Stiff com Barra",                        group: "Posterior de Coxas", videoUrl: null },
  { id: "stiff-unilateral",               name: "Stiff Unilateral",                       group: "Posterior de Coxas", videoUrl: null },
  { id: "cadeira-adutora",                name: "Cadeira Adutora",                        group: "Posterior de Coxas", videoUrl: null },
  { id: "cadeira-abdutora",               name: "Cadeira Abdutora",                       group: "Posterior de Coxas", videoUrl: null },

  // ── Glúteos ───────────────────────────────────────────────────────────────
  { id: "agachamento-sumo-trx",           name: "Agachamento Sumô no TRX",                group: "Glúteos",           videoUrl: null },
  { id: "agachamento-sumo",               name: "Agachamento Sumô",                       group: "Glúteos",           videoUrl: null },
  { id: "agachamento-smith",              name: "Agachamento no Smith",                   group: "Glúteos",           videoUrl: null },
  { id: "elevacao-pelvica-solo",          name: "Elevação Pélvica Solo",                  group: "Glúteos",           videoUrl: null },
  { id: "elevacao-pelvica-maquina",       name: "Elevação Pélvica Máquina",               group: "Glúteos",           videoUrl: null },
  { id: "elevacao-pelvica-livre",         name: "Elevação Pélvica Livre",                 group: "Glúteos",           videoUrl: null },
  { id: "gluteos-4-apoios-coice",         name: "Glúteos 4 Apoios Coice",                 group: "Glúteos",           videoUrl: null },
  { id: "gluteos-4-apoios-estendida",     name: "Glúteos 4 Apoios Perna Estendida",       group: "Glúteos",           videoUrl: null },
  { id: "abducao-solo",                   name: "Abdução Solo",                           group: "Glúteos",           videoUrl: null },
  { id: "abducao-pe-caneleiras",          name: "Abdução em Pé com Caneleiras",           group: "Glúteos",           videoUrl: null },
  { id: "abducao-polia",                  name: "Abdução na Polia",                       group: "Glúteos",           videoUrl: null },

  // ── Abdominal ─────────────────────────────────────────────────────────────
  { id: "abd-supra-solo",                 name: "Abdominal Supra Solo",                   group: "Abdominal",         videoUrl: null },
  { id: "abd-supra-solo-pernas",          name: "Abdominal Supra Solo Pernas Elevadas",   group: "Abdominal",         videoUrl: null },
  { id: "abd-supra-banco",                name: "Abdominal Supra Banco Declinado",        group: "Abdominal",         videoUrl: null },
  { id: "abd-supra-polia",                name: "Abdominal Supra na Polia",               group: "Abdominal",         videoUrl: null },
  { id: "abd-obliquo-uni",                name: "Abdominal Oblíquo Unilateral",           group: "Abdominal",         videoUrl: null },
  { id: "abd-obliquo-uni-perna",          name: "Abdominal Oblíquo Unilateral Perna Elevada", group: "Abdominal",    videoUrl: null },
  { id: "abd-obliquo-lateral",            name: "Abdominal Oblíquo Lateral",              group: "Abdominal",         videoUrl: null },
  { id: "abd-obliquo-pes",                name: "Abdominal Oblíquo Tocando nos Pés",      group: "Abdominal",         videoUrl: null },
  { id: "abd-obliquo-pedalada",           name: "Abdominal Oblíquo Pedalada",             group: "Abdominal",         videoUrl: null },
  { id: "abd-obliquo-rotacao",            name: "Abdominal Oblíquo Rotação de Quadril",   group: "Abdominal",         videoUrl: null },
  { id: "abd-canivete",                   name: "Abdominal Canivete",                     group: "Abdominal",         videoUrl: null },
  { id: "abd-canivete-uni",               name: "Abdominal Canivete Unilateral",          group: "Abdominal",         videoUrl: null },
  { id: "abd-remador",                    name: "Abdominal Remador",                      group: "Abdominal",         videoUrl: null },
  { id: "abd-infra-solo-joelhos",         name: "Abdominal Infra Solo Flexionando Joelhos", group: "Abdominal",      videoUrl: null },
  { id: "abd-infra-solo-estendidas",      name: "Abdominal Infra Solo Pernas Estendidas", group: "Abdominal",        videoUrl: null },
  { id: "abd-infra-solo-quadril",         name: "Abdominal Infra Solo Elevação de Quadril", group: "Abdominal",      videoUrl: null },
  { id: "abd-infra-banco",                name: "Abdominal Infra Banco Declinado",        group: "Abdominal",         videoUrl: null },
  { id: "abd-infra-paralela-joelhos",     name: "Abdominal Infra Paralela Flexionando Joelhos", group: "Abdominal",  videoUrl: null },
  { id: "abd-infra-paralela-estendidas",  name: "Abdominal Infra Paralela Pernas Estendidas", group: "Abdominal",   videoUrl: null },
  { id: "abd-prancha",                    name: "Abdominal Prancha Isométrica",           group: "Abdominal",         videoUrl: null },
  { id: "abd-rodinha",                    name: "Abdominal com Rodinha",                  group: "Abdominal",         videoUrl: null },
  { id: "extensao-lombar-solo",           name: "Extensão Lombar Solo",                   group: "Abdominal",         videoUrl: null },
  { id: "hipertensao-lombar",             name: "Hipertensão Lombar Banco Romano",        group: "Abdominal",         videoUrl: null },

  // ── Mobilidade ────────────────────────────────────────────────────────────
  { id: "retracao-protracao-escapular",   name: "Retração e Protração Escapular",         group: "Mobilidade",        videoUrl: null },
  { id: "rotacao-ombros-elastico",        name: "Rotação Completa de Ombros com Elástico", group: "Mobilidade",       videoUrl: null },
];

export const exerciseGroups = Array.from(
  new Set(exerciseCatalog.map((e) => e.group))
);

export function findExerciseByCatalogId(catalogId: string): ExerciseCatalogItem | undefined {
  return exerciseCatalog.find((e) => e.id === catalogId);
}

export function findExerciseByName(name: string): ExerciseCatalogItem | undefined {
  const normalized = name.trim().toLowerCase();
  return exerciseCatalog.find((e) => e.name.toLowerCase() === normalized);
}
