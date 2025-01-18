import * as React from "react";
import {
  FAB,
  FABGroupProps,
  Portal
} from "react-native-paper";
import { IconSource } from "react-native-paper/src/components/Icon";

type Props = {
  openingIcon?: IconSource;
  closingIcon?: IconSource;
  actions?: FABGroupProps["actions"];
};
export const MyFAB: React.FC<Props> = React.memo(
  ({ openingIcon, closingIcon, actions }) => {
    const [state, setState] = React.useState({ open: false });

    const onStateChange: FABGroupProps["onStateChange"] = ({ open }) =>
      setState({ open });

    const { open } = state;

    return (
      <Portal>
        <FAB.Group
          open={open}
          visible
          icon={
            open ? openingIcon ?? "unfold-less-vertical" : closingIcon ?? "plus"
          }
          actions={actions ?? []}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
          backdropColor="rgba(255, 251, 254, 0.6)"
          color="white"
          fabStyle={{ backgroundColor: "#0B3A82" }}
        />
      </Portal>
    );
  }
);
