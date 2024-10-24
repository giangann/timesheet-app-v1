import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { UNIT_DIMENSION } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
const AddNewIconImage = require("@/assets/images/add-new-icon.png");
const FilterIconImage = require("@/assets/images/filter-icon.png");
const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");

type TLeaveType = {
  id: number;
  name: string;
};

export default function LeaveTypeList() {
  const [leaveTypes, setLeaveTypes] = useState<TLeaveType[]>([]);
  const { session } = useSession();

  const fetchLeaveTypes = async () => {
    const token = `Bearer ${session}`;

    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
    const endpoint = "/leave-form-types";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      setLeaveTypes(responseJson.data.leaveFormTypes);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLeaveTypes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ToolBar />
      <ScrollView contentContainerStyle={styles.listBox}>
        <List leaveTypes={leaveTypes} />
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

type ListProps = {
  leaveTypes: TLeaveType[];
};
const List: React.FC<ListProps> = ({ leaveTypes }) => {
  return (
    <>
      {leaveTypes.map((leaveType) => (
        <Item key={leaveType.id} leaveType={leaveType} />
      ))}
    </>
  );
};

type ItemProps = {
  leaveType: TLeaveType;
};
const Item: React.FC<ItemProps> = ({ leaveType }) => {
  const { id, name } = leaveType;
  return (
    <View style={styles.itemBox}>
      <View style={styles.indexBox}>
        <NunitoText type="body2" lightColor="white" darkColor="white">
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
    paddingBottom: 0,
    backgroundColor: "white",
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
