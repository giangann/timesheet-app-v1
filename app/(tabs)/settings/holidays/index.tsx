import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { UNIT_DIMENSION } from "@/constants/Misc";
import { dayFromDate, getDayOfWeekNameInVietnamese, sortByDate } from "@/helper/date";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
const AddNewIconImage = require("@/assets/images/add-new-icon.png");
const FilterIconImage = require("@/assets/images/filter-icon.png");

type THoliday = {
  id: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  name: string;
  date: string;
  salaryCoefficientTypeId: number;
  activeOutsideWorkingTime: boolean;
};

export default function HolidayList() {
  return (
    <View style={styles.container}>
      <ToolBar />
      <ScrollView contentContainerStyle={styles.listBox}>
        <List holidays={sortByDate(data)} />
      </ScrollView>
    </View>
  );
}

const ToolBar = () => {
  const router = useRouter();
  return (
    <View style={styles.toolbar}>
      <Pressable onPress={() => {}}>
        <Image source={FilterIconImage} />
      </Pressable>
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
    <>
      {listGroupHolidaysByMonth.map((groupHolidays) => (
        <GroupItems key={groupHolidays.id} groupItems={groupHolidays} />
      ))}
    </>
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
  const { name: holidayName, date } = holiday;
  return (
    <View style={styles.itemBox}>
      <View style={styles.indexBox}>
        <NunitoText type="body2" lightColor="white">
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
    backgroundColor: "white",
    minHeight: "100%",
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    marginBottom: 20,
  },
  listBox: {
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

const data: THoliday[] = [
  {
    id: 2,
    isDeleted: false,
    createdAt: "2024-08-29T15:10:03.505+00:00",
    updatedAt: "2024-08-29T15:10:03.505+00:00",
    name: "Nghỉ lễ đặc biệt",
    date: "2024-06-04",
    salaryCoefficientTypeId: 1,
    activeOutsideWorkingTime: true,
  },
  {
    id: 3,
    isDeleted: false,
    createdAt: "2024-08-29T15:10:03.505+00:00",
    updatedAt: "2024-08-29T15:10:03.505+00:00",
    name: "Tết dương lịch",
    date: "2024-01-01",
    salaryCoefficientTypeId: 1,
    activeOutsideWorkingTime: true,
  },
  {
    id: 4,
    isDeleted: false,
    createdAt: "2024-08-29T15:10:03.505+00:00",
    updatedAt: "2024-08-29T15:10:03.505+00:00",
    name: "Tết nguyên đán ",
    date: "2024-02-17",
    salaryCoefficientTypeId: 1,
    activeOutsideWorkingTime: true,
  },
  {
    id: 5,
    isDeleted: false,
    createdAt: "2024-08-29T15:10:03.505+00:00",
    updatedAt: "2024-08-29T15:10:03.505+00:00",
    name: "Rằm tháng Giêng",
    date: "2024-02-29",
    salaryCoefficientTypeId: 1,
    activeOutsideWorkingTime: true,
  },
  {
    id: 6,
    isDeleted: false,
    createdAt: "2024-08-29T15:10:03.505+00:00",
    updatedAt: "2024-08-29T15:10:03.505+00:00",
    name: "Lễ Chiến Thắng",
    date: "2024-04-30",
    salaryCoefficientTypeId: 1,
    activeOutsideWorkingTime: true,
  },
  {
    id: 7,
    isDeleted: false,
    createdAt: "2024-08-29T15:10:03.505+00:00",
    updatedAt: "2024-08-29T15:10:03.505+00:00",
    name: "Quốc tế Lao Động",
    date: "2024-05-01",
    salaryCoefficientTypeId: 1,
    activeOutsideWorkingTime: true,
  },
];

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
