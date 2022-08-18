import pandas as pd 
import numpy as np
import uuid
from unicodedata import normalize

subdistricts = [
    "Brasília",
    "Gama",
    "Taguatinga",
    "Brazlândia",
    "Sobradinho",
    "Planaltina",
    "Paranoá",
    "Riacho Fundo",
    "Núcleo Bandeirante",
    "Ceilândia",
    "Guará",
    "Cruzeiro",
    "Samambaia",
    "Candangolândia",
    "Recanto das Emas",
    "Lago Norte",
    "Lago Sul",
    "Santa Maria",
    "São Sebastião"
]

indicators = pd.read_excel("./dados.xlsx", engine="openpyxl", sheet_name="Dados")
dictionary = pd.read_excel("./dados.xlsx", engine="openpyxl", sheet_name="Dicionário")

indicators = indicators[indicators["Ano"] == 2010]
indicators = indicators.replace("-", 0.0)
indicators = indicators.replace("", 0.0)
indicators = indicators.replace(np.nan, 0.0)

cols = {}
for col in indicators.columns:
  sigla = dictionary[dictionary["Nome"] == col]["Sigla"]

  if sigla.empty:
    continue

  cols[col] = sigla.values[0]

cols["Nome da UDH"] = "udh"
cols["Código da UDH"] = "cod_udh"
cols["Porcentagem de pessoas com renda domiciliar per capita igual ou inferior a meio salário mínimo (de 2010)"] = "t_vulner"

indicators.rename(columns=cols, inplace=True)

indicators.drop(["Município", "Nome do Município"], axis=1, inplace=True)

for i in subdistricts:
    indicators.loc[indicators['udh'].str.contains(i), 'udh'] = i

indicators.loc[indicators['udh'].str.contains("Vicente Pires"), 'udh'] = "Taguatinga"
indicators['udh'] = indicators['udh'].apply(lambda x: normalize('NFKD',x.upper()).encode('ASCII','ignore').decode('ASCII'))

observed_cols = indicators.columns.difference(["Ano", "cod_udh"])
df_observed_cols = indicators[observed_cols]

map_prosp_soc = {'Alto': 4, 'Muito Alto': 5, 'Baixo': 2, 'Médio': 3, 'Muito Baixo': 1}
df_observed_cols["prosp_soc"] = df_observed_cols["prosp_soc"].apply(lambda x: map_prosp_soc[x])

df_observed_cols[df_observed_cols.columns.difference(["udh"])] = df_observed_cols[df_observed_cols.columns.difference(["udh"])].astype('float')
mean_indicators = df_observed_cols.groupby(['udh'], as_index=False).mean()
mean_indicators['id'] = [uuid.uuid4() for _ in range(len(mean_indicators.index))]

indicators_names = mean_indicators[['id', 'udh']]
indicators_names.to_csv('tb_udhs.csv', index=None)

indicator_values = mean_indicators[mean_indicators.columns.difference(["udh"])]

indicator_values["t_vulner"] = indicator_values["t_vulner"].apply(lambda x: x / 100)
indicator_values["t_sem_lixo"] = indicator_values["t_sem_lixo"].apply(lambda x: x / 100)
indicator_values["espvida"] = indicator_values["espvida"].apply(np.ceil)

min_indicators_prosp_soc = indicator_values["prosp_soc"].min()
max_indicators_prosp_soc = indicator_values["prosp_soc"].max()

indicator_values["prosp_soc"] = indicator_values["prosp_soc"].apply(np.ceil).apply(lambda x: (x - min_indicators_prosp_soc) / (max_indicators_prosp_soc - min_indicators_prosp_soc))

indicator_values.to_csv('tb_indicators.csv', index=None)
