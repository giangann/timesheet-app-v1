import { TGroupUser } from "@/api/group/type";
import { useWeekCalendarCreateProvider } from "@/providers/WeekCalendarCreateProvider";
import { memo, useCallback, useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Avatar, Card, Checkbox, Text, TouchableRipple } from "react-native-paper";

type Props = {
  isChecked: boolean;
  user: TGroupUser;
};

export const GroupUserCard: React.FC<Props> = memo(({ isChecked, user }) => {
  const { useFieldArrayReturn } = useWeekCalendarCreateProvider();

  const [checked, setChecked] = useState(isChecked);

  const onCardPressed = useCallback(() => {
    useFieldArrayReturn?.append({ userId: user.id, name: user.name, roleName: user.roleName, teamName: user.team.name });
    setChecked((prev) => !prev);
  }, [useFieldArrayReturn]);

  const LeftContent = (props: any) => <Avatar.Icon {...props} icon="account" />;

  return (
    <Card style={styles.card}>
      <TouchableRipple borderless rippleColor="rgba(0, 0, 0, .32)" onPress={onCardPressed}>
        <View style={styles.userCardWrapper}>
          <Card.Title title={user.name} subtitle={`P. ${user.team.name}`} left={LeftContent} />
          <Card.Content>
            <Text variant="bodyMedium">Chức vụ: {user.roleName}</Text>
          </Card.Content>
          <View style={styles.userCheckboxWrapper}>
            <Checkbox status={checked ? "checked" : "unchecked"} />
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
