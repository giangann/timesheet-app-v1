import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { UNIT_DIMENSION } from "@/constants/Misc";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
const AddNewIconImage = require("@/assets/images/add-new-icon.png");
const FilterIconImage = require("@/assets/images/filter-icon.png");

type TLeaveType = {
  id: number;
  name: string;
};

export default function HolidayList() {
  return (
    <View style={styles.container}>
      <ToolBar />
      <ScrollView contentContainerStyle={styles.listBox}>
        <List />
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
      <Pressable onPress={() => router.push("/settings/leave_types/add-leave-type")}>
        <Image source={AddNewIconImage} />
      </Pressable>
    </View>
  );
};

const List = () => {
  return (
    <>
      {data.map((leaveType) => (
        <Item key={leaveType.id} {...leaveType} />
      ))}
    </>
  );
};

type ItemProps = TLeaveType;
const Item: React.FC<ItemProps> = ({ id, name }) => {
  return (
    <View style={styles.itemBox}>
      <View style={styles.indexBox}>
        <NunitoText type="body2" lightColor="white">
          {addPrefix(id)}
        </NunitoText>
      </View>
      <NunitoText type="body2"> {name}</NunitoText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    minHeight:'100%'
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    marginBottom: 20,
  },
  listBox: {
    gap: 20,
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

const data: TLeaveType[] = [
  {
    id: 1,
    name: "Nghỉ ốm",
  },
  {
    id: 2,
    name: "Nghỉ thai sản",
  },
  {
    id: 3,
    name: "Nghỉ công tác",
  },
  {
    id: 4,
    name: "Nghỉ việc riêng",
  },
  {
    id: 5,
    name: "Nghỉ việc riêng",
  },
  {
    id: 6,
    name: "Nghỉ việc riêng",
  },
  {
    id: 7,
    name: "Nghỉ việc riêng",
  },
  {
    id: 8,
    name: "Nghỉ việc riêng",
  },
];

function addPrefix(num: number) {
  return num < 10 ? "0" + num : num;
}
