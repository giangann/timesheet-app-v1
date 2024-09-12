import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar } from "react-native-calendars";

import React, { useRef, useCallback } from "react";
import { StyleSheet } from "react-native";
import { agendaItems, getMarkedDates } from "../mocks/agendaItem";
import AgendaItem from "../mocks/AgendaItem";

const ITEMS: any[] = agendaItems;
const leftArrowIcon = require("../mocks/previous.png");
const rightArrowIcon = require("../mocks/next.png");

interface Props {
  weekView?: boolean;
}
export const BasicWeekCalendar: React.FC<Props> = ({ weekView }) => {
  const marked = useRef(getMarkedDates());
  const todayBtnTheme = useRef({
    todayButtonTextColor: "red",
  });

  // const onDateChanged = useCallback((date, updateSource) => {
  //   console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
  // }, []);

  // const onMonthChange = useCallback(({dateString}) => {
  //   console.log('ExpandableCalendarScreen onMonthChange: ', dateString);
  // }, []);

  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} />;
  }, []);

  return (
    <CalendarProvider
      date={ITEMS[1]?.title}
      // onDateChanged={onDateChanged}
      // onMonthChange={onMonthChange}
      showTodayButton
      // disabledOpacity={0.6}
      theme={todayBtnTheme.current}
      // todayBottomMargin={16}
    >
      {weekView ? (
        <WeekCalendar firstDay={1} markedDates={marked.current} />
      ) : (
        <ExpandableCalendar
          // horizontal={false}
          // hideArrows
          // disablePan
          // hideKnob
          // initialPosition={ExpandableCalendar.positions.OPEN}
          // calendarStyle={styles.calendar}
          // headerStyle={styles.header} // for horizontal only
          // disableWeekScroll
          //   theme={theme.current}
          // disableAllTouchEventsForDisabledDays
          firstDay={1}
          markedDates={marked.current}
          leftArrowImageSource={leftArrowIcon}
          rightArrowImageSource={rightArrowIcon}
          // animateScroll
          // closeOnDayPress={false}
        />
      )}
      <AgendaList
        sections={ITEMS}
        renderItem={renderItem}
        // scrollToNextEvent
        sectionStyle={styles.section}
        // dayFormat={'yyyy-MM-d'}
      />
    </CalendarProvider>
  );
};
const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    backgroundColor: "lightgrey",
  },
  section: {
    backgroundColor: "white",
    color: "grey",
    textTransform: "capitalize",
  },
});
