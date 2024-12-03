import { memo } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Avatar, Card, Checkbox, Text, TouchableRipple } from "react-native-paper";

type Props = {
  isChecked: boolean;
};

export const GroupUserCard: React.FC<Props> = memo(({ isChecked }) => {
  const LeftContent = (props: any) => <Avatar.Icon {...props} icon="account" />;
  return (
    <Card style={styles.card}>
      <TouchableRipple borderless rippleColor="rgba(0, 0, 0, .32)" onPress={() => {}}>
        <View style={styles.userCardWrapper}>
          <Card.Title title={"Đặng Minh Chính"} subtitle={`P. ${"Lãnh đạo"}`} left={LeftContent} />
          <Card.Content>
            <Text variant="bodyMedium">Chức vụ: {"Lãnh Đạo Phòng"}</Text>
          </Card.Content>
          <View style={styles.userCheckboxWrapper}>
            <Checkbox status={isChecked ? "checked" : "unchecked"} />
          </View>
        </View>
      </TouchableRipple>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {},
  userCardWrapper: {
    position: "relative",
    paddingBottom: 16,
  },
  userCheckboxWrapper: {
    position: "absolute",
    right: 20,
    top: 20,
  },
});
