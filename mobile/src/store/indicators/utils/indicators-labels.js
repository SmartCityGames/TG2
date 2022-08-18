export const SOCIAL_PROSPERITY_MAPPER = {
  0: "Low",
  3: "Medium",
  6: "High",
  10: "Very High",
};

export const INDICATORS_LABELS = {
  espvida: {
    description_short: "Life expectancy",
    description_long:
      "Average number of years people are expected to live from birth",
    unit: "years",
    order: "RG",
  },
  idhm: {
    description_short: "Municipal Human Development Index",
    description_long:
      "Municipal Human Development Indicator. Geometric mean of the Income, Education and Longevity dimensions indices, with equal weights.",
    order: "RG",
  },
  // idhm_educ: {
  //   description_short: "Synthetic index of the Education dimension",
  //   description_long:
  //     "Synthetic index of the Education dimension, which is one of the 3 components of the IDHM. It is obtained through the geometric mean of the sub-index of children and young people attending school, with a weight of 2/3, and the sub-index of schooling of the adult population, with a weight of 1/3.",
  //   order: "RG",
  // },
  // idhm_educ_sub_esc: {
  //   description_long:
  //     "Subíndice selecionado para compor o IDHM Educação, representando o nível de escolaridade da população adulta. É obtido pelo indicador % de jovens e adultos com 18 anos ou mais com o fundamental completo.",
  //   order: "RG",
  // },
  // idhm_educ_sub_freq: {
  //   description_long:
  //     "Subíndice selecionado para compor o IDHM Educação, representando a frequência de crianças e jovens à escola em séries adequadas à sua idade. É obtido através da média aritmética simples de 4 indicadores: % de crianças de 5 a 6 anos na escola, % de crianças de 11 a 13 anos no 2º ciclo do fundamental, % de jovens de 15 a 17 anos com o fundamental completo e % de jovens de 18 a 20 anos com o médio completo.",
  //   order: "RG",
  // },
  // idhm_long: {
  //   description_short: "Synthetic index of the Longevity dimension",
  //   description_long:
  //     "Longevity dimension index, which is one of the 3 components of the MHDI. It is obtained from the life expectancy at birth indicator, through the formula: [(observed value of the indicator) - (minimum value)] / [(maximum value) - (minimum value)], where the minimum and maximum values are 25 and 85 years, respectively.",
  //   order: "RG",
  // },
  // idhm_renda: {
  //   description_short: "Synthetic index of the Income dimension",
  //   description_long:
  //     "Index of the Income dimension, which is one of the 3 components of the MHDI. It is obtained from the Per capita income indicator, through the formula: [ln (observed value of the indicator) - ln (minimum value)] / [ln (maximum value) - ln (minimum value)], where the minimum and maximum values are R$8.00 and R$4,033.00 (at August 2010 prices).",
  //   order: "RG",
  // },
  ivs: {
    description_short: "Social Vulnerability Index",
    description_long:
      "Social Vulnerability Index. Arithmetic mean of the indices of the dimensions: IVS Urban Infrastructure, IVS Human Capital and IVS Income and Work.",
    order: "GR",
  },
  // ivs_capital_humano: {
  //   description_long:
  //     "Índice da dimensão Capital Humano, é um dos 3 índices que compõem o IVS. Obtido através da média ponderada de índices normalizados construídos a partir dos indicadores que compõem esta dimensão, a saber: 1) Mortalidade até um ano de idade (peso: 0,125); 2) Percentual de crianças de 0 a 5 anos que não frequenta a escola (peso: 0,125); 3) Percentual de crianças de 6 a 14 anos que não frequenta a escola (peso: 0,125) ; 4) Percentual de mulheres de 10 a 17 anos de idade que tiveram filhos (peso: 0,125); 5) Percentual de mães chefes de família, sem fundamental completo e com pelo menos um filho menor de 15 anos de idade, no total de mães chefes de família (peso: 0,125); 6) Taxa de analfabetismo da população de 15 anos ou mais de idade (peso: 0,125); 7) Percentual de crianças que vivem em domicílios em que nenhum dos moradores tem o ensino fundamental completo (peso: 0,125); 8) Percentual de pessoas de 15 a 24 anos que não estudam, não trabalham e são vulneráveis à pobreza, na população total dessa faixa etária (peso: 0,125).",
  //   order: "RG",
  // },
  // ivs_infraestrutura_urbana: {
  //   description_long:
  //     "Índice da dimensão Infraestrutura Urbana, é um dos 3 índices que compõem o IVS. É obtido através da média ponderada de índices normalizados construídos a partir dos indicadores que compõem esta dimensão, a saber: 1) Percentual da população que vive em domicílios urbanos sem o serviço de coleta de lixo (peso: 0,300); 2) Percentual de pessoas em domicílios com abastecimento de água e esgotamento sanitário inadequados (peso: 0,300); 3) Percentual de pessoas em domicílios vulneráveis à pobreza e que gastam mais de uma hora até o trabalho no total de pessoas ocupadas, vulneráveis e que retornam diariamente do trabalho (peso: 0,400).",
  //   order: "RG",
  // },
  // ivs_renda_e_trabalho: {
  //   description_long:
  //     "Índice da dimensão Renda e Trabalho, é um dos 3 índices que compõem o IVS. Obtido através da média ponderada de índices normalizados construídos a partir dos indicadores que compõem esta dimensão, a saber: 1) Proporção de vulneráveis à pobreza (peso: 0,200); 2) Taxa de desocupação da população de 18 anos ou mais de idade (peso: 0,200); 3) Percentual de pessoas de 18 anos ou mais sem fundamental completo e em ocupação informal (peso: 0,200); 4) Percentual de pessoas em domicílios vulneráveis à pobreza e dependentes de idosos (peso: 0,200); 5) Taxa de atividade das pessoas de 10 a 14 anos de idade (peso: 0,200).",
  //   order: "RG",
  // },
  prosp_soc: {
    description_short: "Social Prosperity Index",
    description_long:
      "Level of social prosperity of territoriality, generated through the crossing between its range of the IDHM and the IVS.",
    order: "RG",
  },
  renda_per_capita: {
    description_short: "Per capita income",
    description_long:
      "Ratio between the sum of the income of all individuals residing in permanent private households and the total number of these individuals. Values in Reais as of August 1, 2010.",
    order: "RG",
    unit: "R$",
  },
  // t_analf_15m: {
  //   description_long:
  //     "Razão entre a população de 15 anos ou mais de idade que não sabe ler nem escrever um bilhete simples, e o total de pessoas nesta faixa etária (multiplicada por 100).",
  //   order: "RG",
  // },
  // t_atividade10a14: {
  //   description_long:
  //     "Razão entre as pessoas de 10 a 14 anos de idade que eram economicamente ativas, ou seja, que estavam ocupadas ou desocupadas na semana de referência do censo e o total de pessoas nesta faixa etária (multiplicada por 100). Considera-se desocupada a pessoa que, não estando ocupada na semana de referência, havia procurado trabalho no mês anterior a essa pesquisa.",
  //   order: "RG",
  // },
  // t_c0a5_fora: {
  //   description_long:
  //     "Razão entre o número de crianças de 0 a 5 anos de idade que não frequentam creche ou escola, e o total de crianças nesta faixa etária (multiplicada por 100).",
  //   order: "RG",
  // },
  // t_c6a14_fora: {
  //   description_long:
  //     "Razão entre o número de pessoas de 6 a 14 anos que não frequentam a escola, e o total de pessoas nesta faixa etária (multiplicada por 100).",
  //   order: "RG",
  // },
  // t_cdom_fundin: {
  //   description_long:
  //     "Razão entre o número de crianças de até 14 anos que vivem em domicílios em que nenhum dos moradores tem o ensino fundamental completo, e a população total nesta faixa etária residente em domicílios particulares permanentes (multiplicada por 100).",
  //   order: "RG",
  // },
  // t_desocup18m: {
  //   description_long:
  //     "Percentual da população economicamente ativa (PEA) nessa faixa etária que estava desocupada, ou seja, que não estava ocupada na semana anterior à data do censo, mas havia procurado trabalho ao longo do mês anterior à data dessa pesquisa.",
  //   order: "RG",
  // },
  // t_m10a17_filho: {
  //   description_long:
  //     "Razão entre o número de mulheres de 10 a 17 anos de idade que tiveram filhos, e o total de mulheres nesta faixa etária (multiplicada por 100).",
  //   order: "RG",
  // },
  // t_mchefe_fundin_fmenor: {
  //   description_long:
  //     "Razão entre o número de mulheres que são responsáveis pelo domicílio, que não têm o ensino fundamental completo e têm pelo menos um filho de idade inferior a 15 anos morando no domicílio, e o número total de mulheres chefes de família (multiplicada por 100). São considerados apenas os domicílios particulares permanentes.",
  //   order: "RG",
  // },
  // t_mort1: {
  //   description_long:
  //     "Número de crianças que não deverão sobreviver ao primeiro ano de vida, em cada mil crianças nascidas vivas.",
  //   order: "RG",
  // },
  // t_p15a24_nada: {
  //   description_long:
  //     "Razão entre as pessoas de 15 a 24 anos que não estudam, não trabalham e com renda per capita inferior a meio salário mínimo, de agosto de 2010, e a população total nesta faixa etária (multiplicada por 100). São considerados apenas os domicílios particulares permanentes.",
  //   order: "RG",
  // },
  // t_p18m_fundin_informal: {
  //   description_long:
  //     "Razão entre as pessoas de 18 anos ou mais sem fundamental completo, em ocupação informal, e a população total nesta faixa etária, multiplicada por 100. Ocupção informal implica que trabalham, mas não são: empregados com carteira assinada, militares do exército, da marinha, da aeronáutica, da polícia militar ou do corpo de bombeiros, empregados pelo regime jurídico dos funcionários públicos ou empregadores e trabalhadores por conta própria com contribuição a instituto de previdência oficial.",
  //   order: "RG",
  // },
  // t_pop11a13_ffun: {
  //   description_long:
  //     "Razão entre a população de 11 a 13 anos de idade que frequenta os quatro anos finais do fundamental (do 6º ao 9º ano desse nível de ensino) ou que já concluiu o fundamental e a população total nesta faixa etária multiplicado por 100.",
  //   order: "RG",
  // },
  // t_pop15a17_fundc: {
  //   description_long:
  //     "Razão entre a população de 15 a 17 anos de idade que concluiu o ensino fundamental, em quaisquer de suas modalidades (regular seriado, não seriado, EJA ou supletivo) e o total de pessoas nesta faixa etária multiplicado por 100.",
  //   order: "RG",
  // },
  // t_pop18a20_medioc: {
  //   description_long:
  //     "Razão entre a população de 18 a 20 anos de idade que já concluiu o ensino médio em quaisquer de suas modalidades (regular seriado, não seriado, EJA ou supletivo) e o total de pessoas nesta faixa etária multiplicado por 100. As pessoas de 18 a 20 anos frequentando a 4ª série do ensino médio foram consideradas como já tendo concluído esse nível de ensino.",
  //   order: "RG",
  // },
  // t_pop18m_fundc: {
  //   description_long:
  //     "Razão entre a população de 18 anos ou mais de idade que concluiu o ensino fundamental, em quaisquer de suas modalidades (regular seriado, não seriado, EJA ou supletivo) e o total de pessoas nesta faixa etária multiplicado por 100.",
  //   order: "RG",
  // },
  // t_pop5a6_escola: {
  //   description_long:
  //     "Razão entre a população de 5 a 6 anos de idade que estava frequentando a escola, em qualquer nível ou série e a população total nesta faixa etária multiplicado por 100.",
  //   order: "RG",
  // },
  t_sem_agua_esgoto: {
    description_short: "without water and sewage index",
    description_long:
      "Ratio between the number of people living in households whose water supply does not come from the general network and whose sanitary sewage is not carried out by a sewage collection network or septic tank, and the total population residing in permanent private households, multiplied by 100. only permanent private households are considered.",
    order: "GR",
    unit: "%",
  },
  t_sem_lixo: {
    description_short: "without garbage index",
    description_long:
      "Ratio between the population living in households without garbage collection and the total population residing in permanent private households, multiplied by 100. This includes situations in which garbage collection is carried out directly by a public or private company, or the garbage is deposited in a bucket, tank or warehouse outside the home, for later collection by the service provider. Only permanent private households located in urban areas are considered.",
    order: "GR",
    unit: "%",
  },
  t_vulner: {
    description_short: "vulnerable index",
    description_long:
      "Proportion of people with a per capita household income equal to or less than half the minimum wage (2010)",
    order: "GR",
  },
  // t_vulner_depende_idosos: {
  //   description_long:
  //     "Razão entre as pessoas que vivem em domicílios vulneráveis à pobreza (com renda per capita igual ou inferior a meio salário mínimo de agosto de 2010) e nos quais a renda de moradores com 65 anos ou mais de idade (idosos) corresponde a mais da metade do total da renda domiciliar, e a população total residente em domicílios particulares permanentes (multiplicada por 100).",
  //   order: "RG",
  // },
  // t_vulner_mais1h: {
  //   description_long:
  //     "Razão entre o número de pessoas ocupadas, de 10 anos ou mais de idade, que vivem em domicílios com renda per capita inferior a meio salário mínimo, de agosto de 2010, e que gastam mais de uma hora em deslocamento até o local de trabalho, e o total de pessoas ocupadas nessa faixa etária que vivem em domicílios com renda per capita inferior a meio salário mínimo, de agosto de 2010, e que retornam diariamente ao trabalho, multiplicado por 100.",
  //   order: "RG",
  // },
};
