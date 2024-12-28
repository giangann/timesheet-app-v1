import { fetchExceptionDays } from "@/api/setting";
import { TExceptionDay } from "@/api/setting/type";
import { MyModal } from "@/components/MyModal";
import { MyFlatListRefreshable } from "@/components/list";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { useSession } from "@/contexts";
import { useDeleteExceptionDay } from "@/hooks/setting";
import { MyToast } from "@/ui/MyToast";
import { NoData } from "@/ui/NoData";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { Image, Pressable, StyleSheet, TouchableHighlight, View } from "react-native";
import { Menu } from "react-native-paper";
const AddNewIconImage = require("@/assets/images/add-new-icon.png");

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
      <MyFlatListRefreshable
        data={days}
        renderItem={({ item: exceptionDay, index }) => <Item day={exceptionDay} refetch={onFetchDays} index={index + 1} />}
        ListEmptyComponent={<NoData message="Chưa có loại trực được tạo, hãy tạo mới" />}
        contentContainerStyle={{ gap: 20, paddingBottom: 32, paddingHorizontal: 16 }}
        onPullDown={onFetchDays}
      />
    </View>
  );
}

const ToolBar = () => {
  const router = useRouter();
  return (
    <View style={styles.toolbar}>
      <Pressable onPress={() => router.push("/settings/exception_days/add-exception-day")}>
        <Image source={AddNewIconImage} />
      </Pressable>
    </View>
  );
};

type ItemProps = {
  day: TExceptionDay;
  index: number;
  refetch: () => void;
};
const Item: React.FC<ItemProps> = ({ day, index, refetch }) => {
  const { name: dayName, startDate, endDate, id } = day;

  const [visible, setVisible] = useState(false);
  const [openCfModal, setOpenCfModal] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const { onDeleteExceptionDay } = useDeleteExceptionDay();

  const onPressDelete = useCallback(() => {
    setOpenCfModal(true);
    setVisible(false);
  }, [setOpenCfModal, setVisible]);

  const onConfirmDelete = useCallback(() => {
    onDeleteExceptionDay(id);
    refetch();
  }, [id, onDeleteExceptionDay, refetch]);
  return (
    <View style={styles.itemBox}>
      {/* Info */}
      <View style={styles.indexBox}>
        <NunitoText type="body2" lightColor="white" darkColor="white">
          {index < 10 ? `0${index}` : index}
        </NunitoText>
      </View>
      <View>
        <NunitoText type="body2"> {dayName}</NunitoText>
        <NunitoText type="subtitle2">{`${moment(startDate).format("DD/MM/YYYY")} - ${moment(endDate).format("DD/MM/YYYY")}`}</NunitoText>
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
          title={"Xác nhận xóa ngày ngoại lệ"}
          onClose={() => setOpenCfModal(false)}
          cb={onConfirmDelete}
          modalProps={{ animationType: "fade", transparent: true }}
        >
          <View>
            <NunitoText type="body3">Xóa ngày ngoại lệ: {dayName}?</NunitoText>
          </View>
        </MyModal>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
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
    paddingHorizontal: 16,
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

    position: "relative",
  },
  indexBox: {
    backgroundColor: `#0B3A82`,
    padding: 10,
    borderRadius: 8,
    marginRight: 12,
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
