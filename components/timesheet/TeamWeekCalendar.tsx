import { CalendarBody, CalendarContainer, CalendarHeader, RenderHourProps } from "@howljs/calendar-kit";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
type Props = {};
export const TeamWeekCalendar: React.FC<Props> = ({}) => {
  const renderHour = useCallback(({ hourStr }: RenderHourProps) => {
    return (
      <View style={styles.hourContainer}>
        <View style={styles.dot} />
        <Text style={styles.hourText}>{hourStr}</Text>
      </View>
    );
  }, []);

  return (
    <CalendarContainer numberOfDays={3} minDate="2024-01-01" maxDate="2024-12-31" initialDate="2024-03-11">
      <CalendarHeader />
      <CalendarBody renderHour={renderHour} />
    </CalendarContainer>
  );
};
const styles = StyleSheet.create({
  hourContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: 8,
    right: 0,
    top: -4,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "blue",
  },
  hourText: {
    fontWeight: "bold",
    fontSize: 8,
  },
});
