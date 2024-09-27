import React, { useState, useEffect } from "react";
import { View, Text, TouchableNativeFeedback, TouchableOpacity, ScrollView } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import dayjs from "dayjs";

const CustomCalendar = () => {
  const [arr, setArr] = useState<number[]>([]);
  const [customDate, setCustomDate] = useState(dayjs());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const item = { id: 1 }; // Example static item ID

  useEffect(() => {
    // Populate year array (last 100 years)
    const years = [];
    for (let i = dayjs().year(); i > dayjs().year() - 100; i--) {
      years.push(i);
    }
    setArr(years);
  }, []);

  return (
    <>
      <Calendar
        renderHeader={() => (
          <TouchableNativeFeedback onPress={() => setIsModalVisible(true)}>
            <View>
              <Text>
                {customDate.month() + 1}월 {customDate.year()}
              </Text>
            </View>
          </TouchableNativeFeedback>
        )}
        onPressArrowLeft={() => setCustomDate((prev) => dayjs(prev.format("YYYY-MM-DD")).subtract(1, "month"))}
        onPressArrowRight={() => setCustomDate((prev) => dayjs(prev.format("YYYY-MM-DD")).add(1, "month"))}
        initialDate={customDate.format("YYYY-MM-DD")}
        allowSelectionOutOfRange
        current={customDate.format("YYYY-MM-DD")}
        markingType="multi-dot"
        // @ts-ignore
        markedDates={{ [answers[item.id]]: { selected: true } }}
        onDayPress={({ dateString }) => {
          setAnswers({
            ...answers,
            [item.id]: dateString,
          });
        }}
      />
      {isModalVisible && arr.length > 0 && (
        <View
          style={{
            zIndex: 10,
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Adjusted background for better UX
            justifyContent: "center", // Center modal vertically
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              marginHorizontal: 20,
              height: "70%", // Adjusted height
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, marginBottom: 20 }}>Select Year</Text>
            <ScrollView>
              {arr.map((year) => (
                <TouchableOpacity
                  key={year}
                  onPress={() => {
                    setCustomDate((prev) => dayjs().year(year).month(prev.month())); // Only change year
                    setIsModalVisible(false);
                  }}
                >
                  <View style={{ padding: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{year}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableNativeFeedback onPress={() => setIsModalVisible(false)}>
              <View
                style={{
                  padding: 10,
                  alignItems: "center",
                  backgroundColor: "lightgray",
                  borderRadius: 10,
                  marginTop: 10,
                }}
              >
                <Text style={{ fontSize: 16 }}>Close</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      )}
    </>
  );
};

export default CustomCalendar;
