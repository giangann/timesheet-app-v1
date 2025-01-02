import { MyModal } from "@/components/MyModal";
import { MyFlatListRefreshable } from "@/components/list";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { UNIT_DIMENSION } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { useDeleteSalaryCoefType } from "@/hooks/form";
import { MyToast } from "@/ui/MyToast";
import { NoData } from "@/ui/NoData";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, StyleSheet, TouchableHighlight, View } from "react-native";
import { Menu } from "react-native-paper";
const AddNewIconImage = require("@/assets/images/add-new-icon.png");

type TSalaryCoefficientType = {
  id: number;
  name: string;
  coefficient: number;
};

export default function OutOfWorkingTimeType() {
  const [salaryCoefficientTypes, setSalaryCoefficientTypes] = useState<TSalaryCoefficientType[]>([]);
  const { session } = useSession();

  const fetchSalaryCoefTypes = async () => {
    const token = `Bearer ${session}`;

    const baseUrl = "https://chamcong.vptw.dcs.vn/api/api/v1";
    const endpoint = "/salary-coefficient-types";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      setSalaryCoefficientTypes(responseJson.data.salaryCoefficientTypes);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSalaryCoefTypes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ToolBar />
      <MyFlatListRefreshable
        data={salaryCoefficientTypes}
        renderItem={({ item: salaryCoefType }) => <Item salaryCoefType={salaryCoefType} refetch={fetchSalaryCoefTypes} />}
        ListEmptyComponent={<NoData message="Chưa có loại trực được tạo, hãy tạo mới" />}
        contentContainerStyle={{ gap: 20, paddingBottom: 32, paddingHorizontal: 16 }}
        onPullDown={fetchSalaryCoefTypes}
      />
    </View>
  );
}

const ToolBar = () => {
  const router = useRouter();
  return (
    <View style={styles.toolbar}>
      <Pressable onPress={() => router.push("/settings/out_of_working_time_types/add-out-of-working-time-type")}>
        <Image source={AddNewIconImage} />
      </Pressable>
    </View>
  );
};

type ItemProps = {
  refetch: () => void;
  salaryCoefType: TSalaryCoefficientType;
};
const Item: React.FC<ItemProps> = ({ salaryCoefType, refetch }) => {
  const { id, name, coefficient } = salaryCoefType;
  const [visible, setVisible] = useState(false);
  const [openCfModal, setOpenCfModal] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const { onDeleteSalaryCoefType } = useDeleteSalaryCoefType();

  const onPressDelete = useCallback(() => {
    setOpenCfModal(true);
    setVisible(false);
  }, [setOpenCfModal, setVisible]);

  const onConfirmDelete = useCallback(() => {
    onDeleteSalaryCoefType(id);
    refetch();
  }, [id, onDeleteSalaryCoefType, refetch]);
  return (
    <View style={styles.itemBox}>
      {/* Info */}
      <View style={styles.itemBoxContainer}>
        <View style={styles.itemBoxLeft}>
          <View style={styles.chipBox}>
            <View style={styles.chip}>
              <NunitoText lightColor="white" darkColor="white" type="body2">
                {"x "}
                {coefficient.toPrecision(3)}
              </NunitoText>
            </View>
          </View>
          <NunitoText type="body2"> {name}</NunitoText>
        </View>
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
          title={"Xác nhận xóa loại ngoài giờ"}
          onClose={() => setOpenCfModal(false)}
          cb={onConfirmDelete}
          modalProps={{ animationType: "fade", transparent: true }}
        >
          <View>
            <NunitoText type="body3">Xóa loại ngoài giờ: {name}?</NunitoText>
          </View>
        </MyModal>
      )}
    </View>
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
    marginBottom: 20 * UNIT_DIMENSION,
  },
  listBox: {
    paddingBottom: 16,
    gap: 20 * UNIT_DIMENSION,
  },
  itemBox: {
    backgroundColor: `#0B3A82${OPACITY_TO_HEX["15"]}`,
    paddingHorizontal: 16 * UNIT_DIMENSION,
    paddingVertical: 12 * UNIT_DIMENSION,
    borderRadius: 8 * UNIT_DIMENSION,

    flexDirection: "row",
    alignItems: "flex-start",

    position: "relative",
  },
  itemBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemBoxLeft: {
    flexBasis: "60%",
    flexDirection: "row",
  },
  indexBox: {
    backgroundColor: `#0B3A82`,
    padding: 10 * UNIT_DIMENSION,
    borderRadius: 8 * UNIT_DIMENSION,
    marginRight: 12 * UNIT_DIMENSION,
  },
  nameBox: {
    flexBasis: "60%",
  },
  chipBox: {
    marginRight: 12,
  },
  chip: {
    borderRadius: 16 * UNIT_DIMENSION,
    backgroundColor: `#0B3A82`,
    paddingLeft: 10 * UNIT_DIMENSION,
    paddingRight: 12 * UNIT_DIMENSION,
    paddingVertical: 6 * UNIT_DIMENSION,
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
