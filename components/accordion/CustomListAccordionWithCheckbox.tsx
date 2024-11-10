import { View, StyleSheet, ViewStyle } from "react-native";
import { Checkbox, List } from "react-native-paper";
import { Props as RNPCheckboxProps } from "react-native-paper/src/components/Checkbox/Checkbox";
import { Props as RNPListAccordionProps } from "react-native-paper/src/components/List/ListAccordion";
import { HideChildren } from "../HideChildren";

type Props = {
  checkboxProps: RNPCheckboxProps;
  customContainerStyles?: ViewStyle;
} & RNPListAccordionProps;
export const CustomListAccordionWithCheckbox: React.FC<Props> = ({ checkboxProps, customContainerStyles, ...listAccordionProps }) => {
  return (
    <View style={[styles.container, customContainerStyles]}>
      <View style={styles._absoluteBox}>
        <Checkbox {...checkboxProps} />
      </View>

      <List.Accordion
        {...listAccordionProps}
        // Just to align text of title between Accordion with Item
        left={(props) => (
          <HideChildren>
            <List.Icon {...props} icon="folder" />
          </HideChildren>
        )}
      >
        {listAccordionProps.children}
      </List.Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  _absoluteBox: {
    position: "absolute",
    top: 0,
    left: -4,
    padding: 14,
    zIndex: 1, // Ensure checkbox is above other elements,

    borderRadius: 20, // Fix strange behavior of checkbox
  },
});
