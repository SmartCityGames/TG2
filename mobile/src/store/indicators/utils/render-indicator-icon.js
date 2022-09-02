import { FontAwesome5 } from "@expo/vector-icons";

export function renderIndicatorIcon(indicator, props) {
  switch (indicator) {
    case "espvida":
      return (
        <FontAwesome5 name="heartbeat" size={20} color="#5BB320" {...props} />
      );
    case "idhm":
      return <FontAwesome5 name="city" size={20} color="#5BB320" {...props} />;
    case "ivs":
      return (
        <FontAwesome5
          name="exclamation-triangle"
          size={20}
          color="#5BB320"
          {...props}
        />
      );
    case "prosp_soc":
      return (
        <FontAwesome5 name="trophy" size={20} color="#5BB320" {...props} />
      );
    case "renda_per_capita":
      return (
        <FontAwesome5 name="money-bill" size={20} color="#5BB320" {...props} />
      );
    case "t_sem_agua_esgoto":
      return <FontAwesome5 name="water" size={20} color="#5BB320" {...props} />;
    case "t_sem_lixo":
      return <FontAwesome5 name="trash" size={20} color="#5BB320" {...props} />;
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
