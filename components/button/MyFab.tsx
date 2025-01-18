import { memo, useState } from "react";
import { FAB, FABGroupProps, PaperProvider, Portal } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
// import { Props as FabGroupProps } from "react-native-paper/src/components/FAB/FABGroup";

type Props = {
  openingIcon?: IconSource;
  closingIcon?: IconSource;
  actions?: FABGroupProps["actions"];
};

export const MyFab: React.FC<Props> = memo(
  ({ openingIcon, closingIcon, actions }) => {
    const [state, setState] = useState({ open: false });

    const onStateChange: FABGroupProps["onStateChange"] = ({ open }) => {
      setState({ open });
    };

    const { open } = state;

    return (
      <PaperProvider>
        <Portal>
          <FAB.Group
            open={open}
            visible
            icon={
              open
                ? openingIcon ?? "unfold-less-horizontal"
                : closingIcon ?? "plus"
            }
            actions={actions ?? []}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
          />
        </Portal>
      </PaperProvider>
    );
  }
);
