import { View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export const HideChildren: React.FC<Props> = ({ children }) => <View style={{ opacity: 0 }}>{children}</View>;
