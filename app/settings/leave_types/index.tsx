import { MyModal } from "@/components/MyModal";
import { MyFlatListRefreshable } from "@/components/list";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { UNIT_DIMENSION } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { useDeleteLeaveType } from "@/hooks/form";
import { MyToast } from "@/ui/MyToast";
import { NoData } from "@/ui/NoData";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, StyleSheet, TouchableHighlight, View } from "react-native";
import { Menu } from "react-native-paper";
const AddNewIconImage = require("@/assets/images/add-new-icon.png");
import { BASE_URL } from "@/constants/System";

type TLeaveType = {
  id: number;
  name: string;
  isDisplayedOnWeekCalendar: boolean | null;
};

export default function LeaveTypeList() {
  const [leaveTypes, setLeaveTypes] = useState<TLeaveType[]>([]);
  const { session } = useSession();

  const fetchLeaveTypes = async () => {
    const token = `Bearer ${session}`;

    const baseUrl = BASE_URL;
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
      <MyFlatListRefreshable
        data={leaveTypes}
        renderItem={({ item: leaveType }) => <Item leaveType={leaveType} refetch={fetchLeaveTypes} />}
        ListEmptyComponent={<NoData message="Chưa có loại trực được tạo, hãy tạo mới" />}
        contentContainerStyle={{ gap: 20, paddingBottom: 32, paddingHorizontal: 16 }}
        onPullDown={fetchLeaveTypes}
      />
    </View>
  );
}

const ToolBar = () => {
  const router = useRouter();
  return (
    <View style={styles.toolbar}>
      <Pressable onPress={() => router.push("/settings/leave_types/add-leave-type")}>
        <Image source={AddNewIconImage} />
      </Pressable>
    </View>
  );
};

type ListProps = {
  leaveTypes: TLeaveType[];
  refetch: () => void;
};
const List: React.FC<ListProps> = ({ leaveTypes, refetch }) => {
  return (
    <>
      {leaveTypes.map((leaveType) => (
        <Item key={leaveType.id} refetch={refetch} leaveType={leaveType} />
      ))}
    </>
  );
};

type ItemProps = {
  refetch: () => void;
  leaveType: TLeaveType;
};
const Item: React.FC<ItemProps> = ({ leaveType, refetch }) => {
  const { id, name, isDisplayedOnWeekCalendar } = leaveType;

  const [visible, setVisible] = useState(false);
  const [openCfModal, setOpenCfModal] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const { onDeleteLeaveType } = useDeleteLeaveType();

  const onPressDelete = useCallback(() => {
    setOpenCfModal(true);
    setVisible(false);
  }, [setOpenCfModal, setVisible]);

  const onConfirmDelete = useCallback(() => {
    onDeleteLeaveType(id);
    refetch();
  }, [id, onDeleteLeaveType, refetch]);
  return (
    <>
      <View style={styles.itemBox}>
        {/* Info */}
        <View style={styles.indexBox}>
          <NunitoText type="body2" lightColor="white" darkColor="white">
            {addPrefix(id)}
          </NunitoText>
        </View>
        <View>
          <NunitoText type="body2"> {name}</NunitoText>
          {isDisplayedOnWeekCalendar && <NunitoText type="body4"> Hiển thị trên lịch công tác</NunitoText>}
        </View>

        {/* Menu */}
        <View style={styles.iconThreeDotsAbsBox}>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableHighlight underlayColor={`#000000${OPACITY_TO_HEX["15"]}`} onPress={openMenu} style={styles.iconThreeDotsBtn}>
                <Entypo name="dots-three-vertical" size={18} color="black" />
              </TouchableHighlight>
            }
          >
            <Menu.Item onPress={onPressDelete} title="Xóa" />
          </Menu>
        </View>

        {/* Modal */}
        {openCfModal && (
          <MyModal
            title={"Xác nhận xóa loại nghỉ"}
            onClose={() => setOpenCfModal(false)}
            cb={onConfirmDelete}
            modalProps={{ animationType: "fade", transparent: true }}
          >
            <View>
              <NunitoText type="body3">Xóa loại nghỉ: {name}?</NunitoText>
            </View>
          </MyModal>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
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
    paddingHorizontal: 16,
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

    position: "relative",
  },
  indexBox: {
    backgroundColor: `#0B3A82`,
    padding: 10 * UNIT_DIMENSION,
    borderRadius: 8 * UNIT_DIMENSION,
    marginRight: 12 * UNIT_DIMENSION,
  },
  iconThreeDotsAbsBox: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  iconThreeDotsBtn: {
    padding: 12,
    borderRadius: 20,
  },
});

function addPrefix(num: number) {
  return num < 10 ? "0" + num : num;
}
