export function generateQuestCircleColor(quest) {
  switch (quest.type) {
    case "trash":
      return "#654321";
    case "fire":
      return "#E34A27";
    case "water":
      return "#2D68C4";
    case "sewer":
      return "#ADD8E6";
    case "electricity":
      return "#FFD700";
  }
}
