import { ListAccordionGroupContext } from "react-native-paper/src/components/List/ListAccordionGroup";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Checkbox, List } from "react-native-paper";
import { Props as RNPCheckboxProps } from "react-native-paper/src/components/Checkbox/Checkbox";
import { Props as RNPListAccordionProps } from "react-native-paper/src/components/List/ListAccordion";
import { HideChildren } from "../HideChildren";
import { useContext } from "react";
import { OPACITY_TO_HEX } from "@/constants/Colors";

type Props = {
  checkboxProps: RNPCheckboxProps;
  customContainerStyles?: ViewStyle;
  isShowCheckbox?: boolean;
  showDivide?: boolean;
} & RNPListAccordionProps;
export const CustomListAccordionWithCheckbox: React.FC<Props> = ({
  checkboxProps,
  customContainerStyles,
  isShowCheckbox = true,
  showDivide = false,
  ...listAccordionProps
}) => {
  const groupContext = useContext(ListAccordionGroupContext);
  const isExpanding = groupContext?.expandedId === listAccordionProps.id;

  const { style, ...restProps } = listAccordionProps;
  const styleExtend = isExpanding ? (showDivide ? { borderBottomColor: `#000000${OPACITY_TO_HEX["15"]}`, borderBottomWidth: 1 } : {}) : {};

  return (
    <View style={[styles.container, customContainerStyles]}>
      {isShowCheckbox && (
        <View style={styles._absoluteBox}>
          <Checkbox {...checkboxProps} />
        </View>
      )}

      {isShowCheckbox && (
        <List.Accordion
          {...restProps}
          style={[style, styleExtend]}
          left={(props) => (
            <HideChildren>
              <List.Icon {...props} icon="folder" />
            </HideChildren>
          )}
        >
          {listAccordionProps.children}
        </List.Accordion>
      )}

      {!isShowCheckbox && (
        <List.Accordion {...restProps} style={[style, styleExtend]}>
          {listAccordionProps.children}
        </List.Accordion>
      )}
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
