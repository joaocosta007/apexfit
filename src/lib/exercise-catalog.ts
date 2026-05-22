export type ExerciseCatalogItem = {
  id: string;
  name: string;
  group: string;
  videoUrl: string | null;
};

export const exerciseCatalog: ExerciseCatalogItem[] = [
  // Pernas
  { id: "agachamento-livre",      name: "Agachamento Livre",       group: "Pernas",     videoUrl: null },
  { id: "agachamento-guiada",     name: "Agachamento Guiada",      group: "Pernas",     videoUrl: null },
  { id: "agachamento-hack-squat", name: "Agachamento Hack Squat",  group: "Pernas",     videoUrl: null },
  { id: "leg-press",              name: "Leg Press",               group: "Pernas",     videoUrl: null },
  { id: "extensao",               name: "Extensão",                group: "Pernas",     videoUrl: null },
  { id: "avanco",                 name: "Avanço",                  group: "Pernas",     videoUrl: null },
  { id: "aducao",                 name: "Adução",                  group: "Pernas",     videoUrl: null },
  { id: "flexao-pernas",          name: "Flexão",                  group: "Pernas",     videoUrl: null },
  { id: "abducao",                name: "Abdução",                 group: "Pernas",     videoUrl: null },
  { id: "stiff",                  name: "Stiff",                   group: "Pernas",     videoUrl: null },
  { id: "gluteos",                name: "Glúteos",                 group: "Pernas",     videoUrl: null },
  { id: "panturrilha",            name: "Panturrilha",             group: "Pernas",     videoUrl: null },
  { id: "mesa-flexora",           name: "Mesa Flexora",            group: "Pernas",     videoUrl: null },
  { id: "cadeira-flexora",        name: "Cadeira Flexora",         group: "Pernas",     videoUrl: null },

  // Peito
  { id: "supino-reto",            name: "Supino Reto",             group: "Peito",      videoUrl: null },
  { id: "supino-inclinado",       name: "Supino Inclinado",        group: "Peito",      videoUrl: null },
  { id: "supino-declinado",       name: "Supino Declinado",        group: "Peito",      videoUrl: null },
  { id: "supino-convergente",     name: "Supino Convergente",      group: "Peito",      videoUrl: null },
  { id: "fly-peito",              name: "Fly Peito",               group: "Peito",      videoUrl: null },
  { id: "fly-inclinado",          name: "Fly Inclinado",           group: "Peito",      videoUrl: null },
  { id: "fly-declinado",          name: "Fly Declinado",           group: "Peito",      videoUrl: null },
  { id: "pec-deck",               name: "Pec Deck",                group: "Peito",      videoUrl: null },
  { id: "cross-over",             name: "Cross Over",              group: "Peito",      videoUrl: null },
  { id: "pullover",               name: "Pullover",                group: "Peito",      videoUrl: null },
  { id: "crucifixo",              name: "Crucifixo",               group: "Peito",      videoUrl: null },

  // Bíceps
  { id: "rosca-direta",           name: "Rosca Direta",            group: "Bíceps",     videoUrl: null },
  { id: "rosca-scott",            name: "Rosca Scott",             group: "Bíceps",     videoUrl: null },
  { id: "rosca-alternada",        name: "Rosca Alternada",         group: "Bíceps",     videoUrl: null },
  { id: "rosca-concentrada",      name: "Rosca Concentrada",       group: "Bíceps",     videoUrl: null },
  { id: "rosca-martelo",          name: "Rosca Martelo",           group: "Bíceps",     videoUrl: null },
  { id: "rosca-polia",            name: "Rosca Polia",             group: "Bíceps",     videoUrl: null },
  { id: "rosca-americana",        name: "Rosca Americana",         group: "Bíceps",     videoUrl: null },
  { id: "banco-co",               name: "Banco C.O",               group: "Bíceps",     videoUrl: null },

  // Ombros
  { id: "desenvolvimento-barra",  name: "Desenvolvimento Barra Livre",   group: "Ombros", videoUrl: null },
  { id: "desenvolvimento-maquina",name: "Desenvolvimento Máquina",       group: "Ombros", videoUrl: null },
  { id: "desenvolvimento-halter", name: "Desenvolvimento com Halter",    group: "Ombros", videoUrl: null },
  { id: "arnold-press",           name: "Arnold Press",                  group: "Ombros", videoUrl: null },
  { id: "elevacao-lateral",       name: "Elevação Lateral",              group: "Ombros", videoUrl: null },
  { id: "elevacao-frontal-barra", name: "Elevação Frontal Barra",        group: "Ombros", videoUrl: null },
  { id: "cruzamento-nocarb",      name: "Cruzamento Nocarb",             group: "Ombros", videoUrl: null },
  { id: "crucifixo-invertido",    name: "Crucifixo Invertido",           group: "Ombros", videoUrl: null },

  // Costas
  { id: "pulley-costas",          name: "Pulley Costas",           group: "Costas",     videoUrl: null },
  { id: "pulley-frente",          name: "Pulley Frente",           group: "Costas",     videoUrl: null },
  { id: "remada-pulley",          name: "Remada Pulley",           group: "Costas",     videoUrl: null },
  { id: "remada-sentado",         name: "Remada Sentado",          group: "Costas",     videoUrl: null },
  { id: "remada-cavalo",          name: "Remada Cavalo",           group: "Costas",     videoUrl: null },
  { id: "serrote",                name: "Serrote",                 group: "Costas",     videoUrl: null },
  { id: "barra-fixa",             name: "Barra Fixa",              group: "Costas",     videoUrl: null },
  { id: "pulldown",               name: "Pulldown",                group: "Costas",     videoUrl: null },

  // Tríceps
  { id: "pulley-triceps",         name: "Pulley",                  group: "Tríceps",    videoUrl: null },
  { id: "polia-invertida",        name: "Polia Invertida",         group: "Tríceps",    videoUrl: null },
  { id: "testa",                  name: "Testa",                   group: "Tríceps",    videoUrl: null },
  { id: "frances",                name: "Francês",                 group: "Tríceps",    videoUrl: null },
  { id: "corda",                  name: "Corda",                   group: "Tríceps",    videoUrl: null },
  { id: "coice",                  name: "Coice",                   group: "Tríceps",    videoUrl: null },
  { id: "supino-fechado",         name: "Supino Fechado",          group: "Tríceps",    videoUrl: null },
  { id: "mergulho",               name: "Mergulho",                group: "Tríceps",    videoUrl: null },

  // Trapézio
  { id: "remada-alta",            name: "Remada Alta",             group: "Trapézio",   videoUrl: null },
  { id: "encolhimento",           name: "Encolhimento",            group: "Trapézio",   videoUrl: null },

  // Antebraço
  { id: "rosca-inversa",          name: "Rosca Inversa",           group: "Antebraço",  videoUrl: null },
  { id: "flexao-punho",           name: "Flexão de Punho",         group: "Antebraço",  videoUrl: null },
  { id: "extensao-punho",         name: "Extensão de Punho",       group: "Antebraço",  videoUrl: null },

  // Abdominais
  { id: "supra",                  name: "Supra",                   group: "Abdominais", videoUrl: null },
  { id: "infra",                  name: "Infra",                   group: "Abdominais", videoUrl: null },
  { id: "lateral-abdominal",      name: "Lateral",                 group: "Abdominais", videoUrl: null },
  { id: "prancha-frontal",        name: "Prancha Frontal",         group: "Abdominais", videoUrl: null },
  { id: "prancha-lateral",        name: "Prancha Lateral",         group: "Abdominais", videoUrl: null },
];

export const exerciseGroups = Array.from(
  new Set(exerciseCatalog.map((e) => e.group))
);

export function findExerciseByCatalogId(catalogId: string): ExerciseCatalogItem | undefined {
  return exerciseCatalog.find((e) => e.id === catalogId);
}
