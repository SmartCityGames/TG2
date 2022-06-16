const xlsx = require("xlsx");

const data = xlsx.utils
  .sheet_to_json(xlsx.readFile("./dados.xlsx").Sheets["Dados"])
  .filter(
    (entry) =>
      entry["Nome do Município"] === "Brasília" && entry["Nome da UDH"] !== "-"
  );

const reducedData = data.reduce(
  (acc, entry) => ({
    ...acc,
    [entry["Ano"]]: {
      ...(acc[entry["Ano"]] ?? {}),
      [entry["Nome da UDH"]]: {
        ...(acc[entry["Ano"]]?.[entry["Nome da UDH"]] ?? {}),
        entry,
      },
    },
  }),
  {}
);

console.log(JSON.stringify(reducedData, null, 2));
