export function generateQuestCircleColor(quest) {
  switch (quest.type) {
    case "trash":
      return "brown";
    case "fire":
      return "orange";
    case "water":
      return "blue";
    case "sewer":
      return "#ADD8E6";
    case "electricity":
      return "yellow";
  }
}
