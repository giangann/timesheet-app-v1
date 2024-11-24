import { Ionicons } from "@expo/vector-icons";
import type {
  CalendarKitHandle,
  DateOrDateTime,
  DraggingEventProps,
  EventItem,
  HeaderItemProps,
  LocaleConfigsProps,
  OnEventResponse,
  ResourceItem,
  SelectedEventType,
  UnavailableHourProps,
} from "@howljs/calendar-kit";
import { CalendarBody, CalendarContainer, CalendarHeader, DraggingEvent, ResourceHeaderItem, parseDateTime } from "@howljs/calendar-kit";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, StyleSheet, View, useColorScheme } from "react-native";
import { Text } from "react-native-paper";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomUnavailableHour from "./CustomUnavaiableHour";
import Header from "./Header";
import { _mockEvents } from "@/constants/Misc";
type Props = {
  onEventSelected: (event: OnEventResponse) => void;
};
export const TeamWeekCalendar: React.FC<Props> = memo(({ onEventSelected }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const { bottom: safeBottom } = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const calendarRef = useRef<CalendarKitHandle>(null);
  // const { configs } = useAppContext();
  const params = useLocalSearchParams<SearchParams>();
  const router = useRouter();
  const currentDate = useSharedValue(INITIAL_DATE);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEventType>();
  const [calendarWidth, setCalendarWidth] = useState(Dimensions.get("window").width);

  const isResourcesMode = params.viewMode === "resources";

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setCalendarWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const _onChange = (date: string) => {
    currentDate.value = date;
  };

  const _onPressDayNumber = (date: string) => {
    calendarRef.current?.setVisibleDate(date);
    router.setParams({ viewMode: "day", numberOfDays: "1" });
  };

  const _onPressToday = useCallback(() => {
    calendarRef.current?.goToDate({
      date: new Date().toISOString(),
      animatedDate: true,
      hourScroll: true,
    });
  }, []);

  const unavailableHours = useMemo(
    () => [
      { start: 0, end: 6 * 60, enableBackgroundInteraction: true },
      { start: 20 * 60, end: 24 * 60, enableBackgroundInteraction: true },
    ],
    []
  );
  const highlightDates = useMemo(
    () => ({
      "6": { dayNumber: { color: "blue" }, dayName: { color: "blue" } },
      "7": { dayNumber: { color: "red" }, dayName: { color: "red" } },
    }),
    []
  );

  const _onPressBackground = (props: DateOrDateTime) => {
    // if (selectedEvent) {
    //   const startISO = new Date(date).toISOString();
    //   const duration =
    //     new Date(selectedEvent.end).getTime() -
    //     new Date(selectedEvent.start).getTime();
    //   const end = new Date(date).getTime() + duration;
    //   const endISO = new Date(end).toISOString();
    //   const newEvent = { ...selectedEvent, start: startISO, end: endISO };
    //   if (newEvent.id) {
    //     let newEvents = events.filter((item) => item.id !== newEvent.id);
    //     newEvents.push({ ...newEvent, id: newEvent.id });
    //     setEvents(newEvents);
    //   }
    //   setSelectedEvent(newEvent);
    // }
    if (props.date) {
      console.log(new Date(props.date).toISOString());
    }
    if (props.dateTime) {
      console.log(new Date(props.dateTime).toISOString());
    }
    setSelectedEvent(undefined);
  };

  const isWorkWeek = params.viewMode === "week" && params.numberOfDays === "5";
  const hideWeekDays: number[] = [];

  const onPressPrevious = () => {
    calendarRef.current?.goToPrevPage();
  };

  const onPressNext = () => {
    calendarRef.current?.goToNextPage();
  };

  const resources = useMemo(() => {
    return new Array(TOTAL_RESOURCES).fill(0).map((_, index) => {
      return {
        id: `resource_${index + 1}`,
        title: `Resource ${index + 1}`,
      };
    });
  }, []);

  const _renderResource = useCallback((resource: ResourceItem) => {
    return (
      <View style={styles.resourceContainer}>
        <Ionicons name="person-circle-outline" size={24} color="black" />
        <Text>{resource.title}</Text>
      </View>
    );
  }, []);

  const _renderResourceHeaderItem = useCallback(
    (item: HeaderItemProps) => {
      const start = parseDateTime(item.startUnix);
      const dateStr = start.toFormat("yyyy-MM-dd");

      return (
        <ResourceHeaderItem
          startUnix={item.startUnix}
          resources={item.extra.resources}
          renderResource={_renderResource}
          DateComponent={
            <View style={styles.dateContainer}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>{dateStr}</Text>
            </View>
          }
        />
      );
    },
    [_renderResource]
  );

  const _renderCustomHorizontalLine = useCallback((props: { index: number; borderColor: string }) => {
    // Check if index is a whole number (not 0.5, 1.5, etc)
    const isWholeNumber = Number.isInteger(props.index);
    if (isWholeNumber) {
      return (
        <View
          pointerEvents="none"
          style={{
            height: 1,
            backgroundColor: props.borderColor,
          }}
        />
      );
    }

    return (
      <View
        pointerEvents="none"
        style={{
          height: 1,
          borderWidth: 1,
          borderColor: props.borderColor,
          borderStyle: "dashed",
        }}
      />
    );
  }, []);

  const _renderCustomUnavailableHour = useCallback(
    (
      props: UnavailableHourProps & {
        width: SharedValue<number>;
        height: SharedValue<number>;
      }
    ) => {
      return <CustomUnavailableHour {...props} />;
    },
    []
  );

  const _renderDraggingEvent = useCallback((props: DraggingEventProps) => {
    return <DraggingEvent {...props} containerStyle={{ backgroundColor: "#1a73e8", opacity: 0.5 }} />;
  }, []);

  console.log("re-render with new numberOfDays: ", params.numberOfDays);
  return (
    <View style={styles.container}>
      <Header currentDate={currentDate} onPressToday={_onPressToday} onPressPrevious={onPressPrevious} onPressNext={onPressNext} />
      <CalendarContainer
        ref={calendarRef}
        calendarWidth={calendarWidth}
        numberOfDays={Number(params.numberOfDays)}
        scrollByDay={Number(params.numberOfDays) < 5}
        firstDay={1}
        hideWeekDays={hideWeekDays}
        initialLocales={initialLocales}
        locale="en"
        minRegularEventMinutes={5}
        // theme={
        //   configs.themeMode === "auto" ? (colorScheme === "dark" ? CALENDAR_THEME.dark : CALENDAR_THEME.light) : CALENDAR_THEME[configs.themeMode]
        // }
        showWeekNumber={true}
        allowPinchToZoom={false}
        onChange={_onChange}
        onDateChanged={console.log}
        minDate={MIN_DATE}
        maxDate={MAX_DATE}
        initialDate={INITIAL_DATE}
        onPressDayNumber={_onPressDayNumber}
        onPressBackground={_onPressBackground}
        unavailableHours={unavailableHours}
        highlightDates={highlightDates}
        events={_mockEvents}
        onPressEvent={onEventSelected}
        dragToCreateMode={undefined}
        scrollToNow
        useHaptic
        allowDragToEdit={false}
        allowDragToCreate={false}
        useAllDayEvent
        rightEdgeSpacing={4}
        overlapEventsSpacing={1}
        onLongPressEvent={(event) => {
          if (event.id !== selectedEvent?.id) {
            setSelectedEvent(undefined);
          }
        }}
        selectedEvent={selectedEvent}
        start={8 * 60}
        end={17 * 60}
        spaceFromBottom={safeBottom}
        defaultDuration={60}
        onDragEventEnd={undefined}
        onDragSelectedEventEnd={undefined}
        resources={isResourcesMode ? resources : undefined}
        onDragCreateEventEnd={undefined}
      >
        <CalendarHeader dayBarHeight={isResourcesMode ? 120 : 60} renderHeaderItem={isResourcesMode ? _renderResourceHeaderItem : undefined} />
        <CalendarBody
          renderCustomHorizontalLine={_renderCustomHorizontalLine}
          renderCustomUnavailableHour={_renderCustomUnavailableHour}
          renderDraggingEvent={_renderDraggingEvent}
        />
      </CalendarContainer>
    </View>
  );
});
// import { useAppContext } from "../../context/AppProvider";

type SearchParams = { viewMode: string; numberOfDays: string };

const MIN_DATE = new Date(new Date().getFullYear() - 2, new Date().getMonth(), new Date().getDate()).toISOString();

const MAX_DATE = new Date(new Date().getFullYear() + 2, new Date().getMonth(), new Date().getDate()).toISOString();

const INITIAL_DATE = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toISOString();

const CALENDAR_THEME = {
  light: {
    colors: {
      primary: "#1a73e8",
      onPrimary: "#fff",
      background: "#fff",
      onBackground: "#000",
      border: "#dadce0",
      text: "#000",
      surface: "#ECECEC",
    },
  },
  dark: {
    colors: {
      primary: "#4E98FA",
      onPrimary: "#FFF",
      background: "#1A1B21",
      onBackground: "#FFF",
      border: "#46464C",
      text: "#FFF",
      surface: "#545454",
    },
  },
};

const initialLocales: Record<string, Partial<LocaleConfigsProps>> = {
  en: {
    weekDayShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
    meridiem: { ante: "am", post: "pm" },
  },
  ja: {
    weekDayShort: "日_月_火_水_木_金_土".split("_"),
    meridiem: { ante: "午前", post: "午後" },
  },
  vi: {
    weekDayShort: "CN_T2_T3_T4_T5_T6_T7".split("_"),
    meridiem: { ante: "sa", post: "ch" },
  },
};

const TOTAL_RESOURCES = 3;

const styles = StyleSheet.create({
  container: { flex: 1 },
  actions: { flexDirection: "row", gap: 10, padding: 10 },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#23cfde",
  },
  header: {
    backgroundColor: "white",
    padding: 16,
  },
  date: { fontSize: 16, fontWeight: "bold" },
  resourceContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  dateContainer: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
  },
});
