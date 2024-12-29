import { THoliday } from "@/api/setting/type";
import CustomYearPicker from "@/components/CutomeYearPicker";
import { MyFlatListRefreshable } from "@/components/list";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { UNIT_DIMENSION } from "@/constants/Misc";
import { dayFromDate, getDayOfWeekNameInVietnamese, sortByDate } from "@/helper/date";
import { useFetchHolidays } from "@/hooks/setting";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
const AddNewIconImage = require("@/assets/images/add-new-icon.png");

const currentYear = new Date().getFullYear();

export default function HolidayList() {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const { holidays, onFetchHolidays } = useFetchHolidays(selectedYear);

  const onYearSelected = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <View style={styles.container}>
      <ToolBar leftComponent={<CustomYearPicker year={selectedYear} onYearSelect={onYearSelected} />} />
      <MyFlatListRefreshable data={[holidays]} renderItem={() => <List holidays={sortByDate(holidays)} />} onPullDown={onFetchHolidays} />
    </View>
  );
}

const ToolBar = ({ leftComponent }: { leftComponent: React.ReactNode }) => {
  const router = useRouter();
  return (
    <View style={styles.toolbar}>
      {leftComponent}
      <Pressable onPress={() => router.push("/settings/holidays/add-holiday")}>
        <Image source={AddNewIconImage} />
      </Pressable>
    </View>
  );
};

type ListProps = {
  holidays: THoliday[];
};
const List: React.FC<ListProps> = ({ holidays }) => {
  const listGroupHolidaysByMonth = groupHolidaysByMonth(holidays);
  return (
    <View style={styles.listBox}>
      {listGroupHolidaysByMonth.map((groupHolidays) => (
        <GroupItems key={groupHolidays.id} groupItems={groupHolidays} />
      ))}
    </View>
  );
};

type GroupItemsProps = {
  groupItems: TGroupedHolidays;
};
const GroupItems: React.FC<GroupItemsProps> = ({ groupItems }) => {
  const { holidays, name: monthName } = groupItems;
  return (
    <View style={styles.groupItemsBox}>
      <NunitoText type="body2">{monthName}</NunitoText>
      <View style={styles.itemsWrapper}>
        {holidays.map((holiday) => (
          <Item key={holiday.id} holiday={holiday} />
        ))}
      </View>
    </View>
  );
};

type ItemProps = {
  holiday: THoliday;
};
const Item: React.FC<ItemProps> = ({ holiday }) => {
  const { name: holidayName, date, id } = holiday;
  return (
    <View style={styles.itemBox}>
      <View style={styles.indexBox}>
        <NunitoText type="body2" lightColor="white" darkColor="white">
          {dayFromDate(date)}
        </NunitoText>
      </View>
      <View>
        <NunitoText type="body2"> {holidayName}</NunitoText>
        <NunitoText type="subtitle2">{getDayOfWeekNameInVietnamese(date)}</NunitoText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 0,
    backgroundColor: `white`,
    minHeight: "100%",
    height: "100%",
    /**
     * if not set height 100%, container will overflow screen,
     * so scrollView will fill container => scrollView also overflow screen
     * => can't see all element inside scrollView
     */
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
    marginBottom: 20,
  },
  listBox: {
    paddingBottom: 16,
    gap: 24,
  },

  groupItemsBox: {
    gap: 12,
  },
  itemsWrapper: {
    gap: 10,
  },

  itemBox: {
    backgroundColor: `#0B3A82${OPACITY_TO_HEX["15"]}`,
    paddingHorizontal: 16 * UNIT_DIMENSION,
    paddingVertical: 12 * UNIT_DIMENSION,
    borderRadius: 8 * UNIT_DIMENSION,

    flexDirection: "row",
    alignItems: "center",
  },
  indexBox: {
    backgroundColor: `#0B3A82`,
    padding: 10 * UNIT_DIMENSION,
    borderRadius: 8 * UNIT_DIMENSION,
    marginRight: 12 * UNIT_DIMENSION,
  },
});

type TGroupedHolidays = {
  id: number;
  name: string;
  holidays: THoliday[];
};

function groupHolidaysByMonth(holidays: THoliday[]): TGroupedHolidays[] {
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  // Initialize the map with all 12 months, each with an empty holidays array
  const groupedByMonth: Record<number, TGroupedHolidays> = monthNames.reduce((acc, name, index) => {
    acc[index] = {
      id: index + 1,
      name,
      holidays: [],
    };
    return acc;
  }, {} as Record<number, TGroupedHolidays>);

  // Add holidays to the corresponding month
  holidays.forEach((holiday) => {
    const month = new Date(holiday.date).getMonth(); // Get month (0-based index)
    groupedByMonth[month].holidays.push(holiday);
  });

  // Convert the map into an array
  return Object.values(groupedByMonth);
}
