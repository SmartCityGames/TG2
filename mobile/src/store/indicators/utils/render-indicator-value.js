import {
  INDICATORS_LABELS,
  SOCIAL_PROSPERITY_MAPPER,
} from "./indicators-labels";

export function renderIndicatorValue(district, indicator) {
  return renderSelectedIndicatorValue(indicator, Number(district[indicator]));
}

export function renderSelectedIndicatorValue(selected, num) {
  const value = Number(num);
  switch (selected) {
    case "prosp_soc":
      return SOCIAL_PROSPERITY_MAPPER[(Math.floor(value) * 10).toFixed(0)];
    case "renda_per_capita":
      return `${INDICATORS_LABELS[selected].unit} ${value.toFixed(2)}`;
    case "t_sem_lixo":
      return `${(value * 100).toFixed(2)} ${INDICATORS_LABELS[selected].unit}`;
    case "espvida":
      return `${value.toFixed(0)} ${INDICATORS_LABELS[selected].unit}`;
    default:
      return `${value.toFixed(2)} ${
        INDICATORS_LABELS[selected].unit ?? ""
      }`.trim();
  }
}
