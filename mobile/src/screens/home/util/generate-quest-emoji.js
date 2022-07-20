export function generateQuestEmoji(quest) {
  switch (quest.type) {
    case "trash":
      return "🗑️";
    case "fire":
      return "🔥";
    case "water":
      return "💧";
    case "sewer":
      return "🪠";
    case "electricity":
      return "⚡";
  }
}
