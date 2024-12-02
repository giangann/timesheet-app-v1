import { CreateNewButton } from "@/components/button";
import { TeamWeekCalendar } from "@/components/timesheet";
import { EventItem, OnEventResponse } from "@howljs/calendar-kit";
import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";

export default function WeekCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>();
  const navigation = useNavigation();
  const router = useRouter();

  const onEventSelected = (event: OnEventResponse) => {
    console.log("Selected Event:", event); // Debugging line
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CreateNewButton
          onPressedButton={() => {
            router.navigate("/timesheet/week-calendar/create-week-calendar");
          }}
        />
      ),
    });
  }, []);
  return (
    <>
      <TeamWeekCalendar onEventSelected={onEventSelected} />
    </>
  );
}
