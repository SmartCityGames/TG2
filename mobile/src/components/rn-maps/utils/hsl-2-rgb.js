const rgb2hex = (r, g, b) =>
  `#${[r, g, b]
    .map((x) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, 0)
    )
    .join("")}`;

export function hsl2rgb(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

  return rgb2hex(...[f(0), f(8), f(4)]);
}
