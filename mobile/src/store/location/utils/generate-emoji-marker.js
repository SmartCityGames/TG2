export const generateEmojiMarker = () => {
  const emojis = ["👱", "👨", "👩", "👩‍🦱", "👴", "👵"];

  let currentIndex = emojis.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [emojis[currentIndex], emojis[randomIndex]] = [
      emojis[randomIndex],
      emojis[currentIndex],
    ];
  }

  return emojis[randomIndex];
};
