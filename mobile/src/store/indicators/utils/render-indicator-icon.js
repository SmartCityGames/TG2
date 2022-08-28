import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

export function renderIndicatorIcon(indicator, props) {
  switch (indicator) {
    case "espvida":
      return <FontAwesome name="heart" size={20} color="#5BB320" {...props} />;
    case "idhm":
      return <FontAwesome5 name="city" size={20} color="#5BB320" {...props} />;
    case "ivs":
      return (
        <FontAwesome name="warning" size={20} color="#5BB320" {...props} />
      );
    case "prosp_soc":
      return <FontAwesome name="trophy" size={20} color="#5BB320" {...props} />;
    case "renda_per_capita":
      return <FontAwesome name="money" size={20} color="#5BB320" {...props} />;
    case "t_sem_agua_esgoto":
      return <FontAwesome5 name="water" size={20} color="#5BB320" {...props} />;
    case "t_sem_lixo":
      return <FontAwesome name="trash" size={20} color="#5BB320" {...props} />;
    case "t_vulner":
      return (
        <FontAwesome5
          name="balance-scale-left"
          size={20}
          color="#5BB320"
          {...props}
        />
      );
  }
}
