import { View, StyleSheet } from "react-native";
import { Checkbox, List } from "react-native-paper";
import { Props as RNPCheckboxProps } from "react-native-paper/src/components/Checkbox/Checkbox";
import { Props as RNPListItemProps } from "react-native-paper/src/components/List/ListItem";

type Props = {
  checkboxProps: RNPCheckboxProps;
} & RNPListItemProps;

export const CustomListItemWithCheckbox: React.FC<Props> = ({ checkboxProps, ...listItemProps }) => {
  return (
    <View style={styles.container}>
      <View style={styles._absoluteBox}>
        <Checkbox {...checkboxProps} />
      </View>

      <List.Item {...listItemProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  _absoluteBox: {
    position: "absolute",
    top: -6,
    left: -4,
    padding: 14,
    zIndex: 1, // Ensure checkbox is above other elements,

    borderRadius: 20, // Fix strange behavior of checkbox
  },
});
