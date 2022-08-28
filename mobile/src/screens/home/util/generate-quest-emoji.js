export function generateQuestEmoji(quest) {
  switch (quest.category) {
    case "trash":
      return require("../../../../assets/garbage.jpg");
    case "fire":
      return require("../../../../assets/map_marker.png");
    case "water":
      return require("../../../../assets/map_marker.png");
    case "sewer":
      return require("../../../../assets/sewer.png");
    case "electricity":
      return require("../../../../assets/map_marker.png");
  }
}
