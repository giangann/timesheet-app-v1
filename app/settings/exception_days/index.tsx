import { fetchExceptionDays } from "@/api/setting";
import { TExceptionDay } from "@/api/setting/type";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { useSession } from "@/contexts";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
const AddNewIconImage = require("@/assets/images/add-new-icon.png");
const FilterIconImage = require("@/assets/images/filter-icon.png");

export default function ExceptionDays() {
  const [days, setDays] = useState<TExceptionDay[]>([]);
  const { session } = useSession();

  const onFetchDays = async () => {
    try {
      const responseJson = await fetchExceptionDays(session);

      if (responseJson.statusCode === 200) {
        setDays(responseJson.data.exceptionDates);
      } else {
        MyToast.error(responseJson.error ?? responseJson.message);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onFetchDays();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ToolBar />
      <ScrollView contentContainerStyle={styles.listBox}>
        <List days={days} />
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
      <Pressable onPress={() => router.push("/settings/exception_days/add-exception-day")}>
        <Image source={AddNewIconImage} />
      </Pressable>
    </View>
  );
};

type ListProps = {
  days: TExceptionDay[];
};
const List: React.FC<ListProps> = ({ days }) => {
  return (
    <>
      {days.map((day) => (
        <Item key={day.id} day={day} />
      ))}
    </>
  );
};

type ItemProps = {
  day: TExceptionDay;
};
const Item: React.FC<ItemProps> = ({ day }) => {
  const { name: dayName, startDate, endDate } = day;
  return (
    <View style={styles.itemBox}>
      <View style={styles.indexBox}>
        <NunitoText type="body2" lightColor="white" darkColor="white">
          {"09"}
        </NunitoText>
      </View>
      <View>
        <NunitoText type="body2"> {dayName}</NunitoText>
        <NunitoText type="subtitle2">{`${moment(startDate).format("DD/MM/YYYY")} - ${moment(endDate).format("DD/MM/YYYY")}`}</NunitoText>
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
    justifyContent: "flex-end",
    gap: 4,
    marginBottom: 20,
  },
  listBox: {
    paddingBottom: 16,
    gap: 24,
    // paddingBottom:60,
  },

  groupItemsBox: {
    gap: 12,
  },
  itemsWrapper: {
    gap: 10,
  },

  itemBox: {
    backgroundColor: `#0B3A82${OPACITY_TO_HEX["15"]}`,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,

    flexDirection: "row",
    alignItems: "center",
  },
  indexBox: {
    backgroundColor: `#0B3A82`,
    padding: 10,
    borderRadius: 8,
    marginRight: 12,
  },
});
