import { View } from "react-native";

type ShortModalProps = {
  height: number;
  children: React.ReactNode;
};
export const ShortModal = ({ height, children }: ShortModalProps) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          height,
          backgroundColor: "#fff",
          justifyContent: "center",
        }}
      >
        {children}
      </View>
    </View>
  );
};

export const ShortModalScreenOptions = {
  gestureResponseDistance: 800,
  cardStyle: {
    backgroundColor: "transparent",
    opacity: 0.99,
  },
};
