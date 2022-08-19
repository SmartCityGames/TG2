export function minMaxNormalization(data) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return data.map((d) => (d - min) / (max - min));
}
