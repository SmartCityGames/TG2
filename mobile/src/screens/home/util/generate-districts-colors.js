export const generateRandomDistrictsColors = ({
  quantity = 1,
  shuffle = false,
  order = "0,360",
  offset = 0,
  saturation = 80,
  lightness = 50,
}) => {
  let colours = [];
  for (let i = 0; i < quantity; i++) {
    let hue;
    if (order == "0,360") hue = (360 / quantity) * (quantity + i) - 360;
    if (order == "360,0") hue = (360 / quantity) * (quantity - i);

    hue += offset;

    colours.push(`hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`);
  }

  if (shuffle) {
    // uses the Fisher-Yates Shuffle to shuffle the colours
    let currentIndex = colours.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [colours[currentIndex], colours[randomIndex]] = [
        colours[randomIndex],
        colours[currentIndex],
      ];
    }
  }

  return colours;
};

export function generateGreenRedGradientColors({
  percentage,
  maxHue = 120,
  minHue = 0,
  opacity = 0.4,
}) {
  const hue = percentage * (maxHue - minHue) + minHue;
  return `hsla(${hue}, 100%, 50%, ${opacity})`;
}
