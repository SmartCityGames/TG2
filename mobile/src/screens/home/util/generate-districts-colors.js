export const generateDistrictsColors = ({
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

    colours.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
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
