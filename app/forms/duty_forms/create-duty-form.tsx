import { TDutyFormCreate } from "@/api/form/types";
import { FormInput } from "@/components/FormInput";
import { FormPickDate } from "@/components/FormPickDate";
import { FormPickTime } from "@/components/FormPickTime";
import { FormSelectV2 } from "@/components/FormSelectV2";
import FormUploadImage from "@/components/FormUploadImage";
import { MyModal } from "@/components/MyModal";
import { MySlideModal } from "@/components/MySlideModal";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors, OPACITY_TO_HEX } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { NoData } from "@/ui/NoData";
import { Entypo, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableHighlight, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Divider, Menu } from "react-native-paper";

export default function CreateDutyForm() {
  const { session } = useSession();
  const router = useRouter();
  const {
    control,
    formState: { isSubmitting },
  } = useForm<TDutyFormCreate>();

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <FormPickDate useControllerProps={{ control: control, name: "date" }} label="Ngày" required placeholder="Chọn ngày..." />
          <View style={styles.timeRangeContainer}>
            <View style={styles.timeRangeItem}>
              <FormPickTime
                useControllerProps={{ control: control, name: "startTime" }}
                label="Giờ bắt đầu"
                placeholder="Chọn giờ"
                required
                leftIcon={<MaterialCommunityIcons name="clock-start" size={18} color={Colors.light.inputIconNone} />}
              />
            </View>
            <View style={styles.timeRangeItem}>
              <FormPickTime
                useControllerProps={{ control: control, name: "endTime" }}
                label="Giờ kết thúc"
                placeholder="Chọn giờ"
                required
                leftIcon={<MaterialCommunityIcons name="clock-end" size={18} color={Colors.light.inputIconNone} />}
              />
            </View>
          </View>
          <FormSelectV2
            useControllerProps={{ control: control, name: "salaryCoefficientTypeId" }}
            options={[]}
            label="Loại ngoài giờ"
            required
            placeholder="Chọn loại ngoài giờ"
            leftIcon={<MaterialIcons name="more-time" size={18} color={Colors.light.inputIconNone} />}
          />
          <ChooseDutyTypesAndDutyTypeUsers />
          <FormSelectV2
            useControllerProps={{ control: control, name: "userApproveIdentifyCard" }}
            options={[]}
            label="Lãnh đạo phê duyệt"
            required
            placeholder="Chọn lãnh đạo phê duyệt"
            leftIcon={<MaterialCommunityIcons name="human-queue" size={18} color={Colors.light.inputIconNone} />}
          />

          <FormInput formInputProps={{ control: control, name: "note" }} label="Ghi chú" placeholder="Nhập ghi chú..." />
          <FormUploadImage label="Ảnh đính kèm" useControllerProps={{ control: control, name: "attachFile" }} />
        </ScrollView>
      </View>
    </KeyboardAwareScrollView>
  );
}

type ChooseDutyTypesAndDutyTypeUsersProps = {};
const ChooseDutyTypesAndDutyTypeUsers: React.FC<ChooseDutyTypesAndDutyTypeUsersProps> = memo(({}) => {
  const [openSlideModal, setOpenSlideModal] = useState(false);

  const onOpenDutyTypesModal = useCallback(() => setOpenSlideModal(true), [setOpenSlideModal]);
  const onCloseDutyTypesModal = useCallback(() => setOpenSlideModal(false), [setOpenSlideModal]);

  return (
    <View style={styles.dutyTypeFieldContainer}>
      {/*  */}
      <FieldLabel />

      {/*  */}
      <View style={styles.dutyTypeGroup}>
        {/* DutyType Item With Users- Sample */}
        <DutyTypeItem users={[{ id: 1, name: "", roleName: "", teamName: "" }]} />
        {/* DutyType Item Without Users- Sample */}
        <DutyTypeItem users={[]} />
      </View>

      {/*  */}
      <Button style={{ alignItems: "flex-start" }} onPress={onOpenDutyTypesModal} textColor="#0B3A82">
        + thêm loại trực
      </Button>
      <>
        {openSlideModal && (
          <MySlideModal onClose={onCloseDutyTypesModal}>
            <NunitoText>Hello world</NunitoText>
          </MySlideModal>
        )}
      </>
    </View>
  );
});

const FieldLabel: React.FC = () => (
  <View style={styles.labelWrapper}>
    <NunitoText type="body2" style={{ marginRight: 6 }}>
      Loại trực và thành viên tham gia
    </NunitoText>
    <NunitoText type="body1" style={{ color: "red" }}>
      *
    </NunitoText>
  </View>
);

type DutyTypeItemUserInfo = {
  id: number;
  name: string;
  roleName: string;
  teamName: string;
};
type DutyTypeItemProps = {
  users: DutyTypeItemUserInfo[];
};
const DutyTypeItem: React.FC<DutyTypeItemProps> = memo(({ users }) => {
  const [visible, setVisible] = useState(false);
  const [openDelModal, setOpenDelModal] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const openCfModal = () => setOpenDelModal(true);
  const closeCfModal = () => setOpenDelModal(false);

  // press delete item of menu handler
  const onPressDelete = useCallback(() => {
    closeMenu();
    openCfModal();
  }, []);

  const isNoUser = useMemo(() => users.length <= 0, [users]);
  return (
    <View style={styles.dutyTypeItemBox}>
      <View style={styles.dutyTypeItemContainer}>
        <View style={styles.dutyTypeNameContainer}>
          <View style={styles.bulletBox}>
            <View style={styles.bullet} />
          </View>
          <NunitoText type="body2" style={styles.dutyTypeName}>
            Trực kĩ thuật
          </NunitoText>
        </View>

        {isNoUser && (
          <View>
            <NoData message="Chưa có thành viên được chọn" />
          </View>
        )}

        {!isNoUser && (
          <View style={styles.dutyTypeUserContainer}>
            <View style={styles.dutyTypeUser}>
              <NunitoText type="body3" style={styles.dutyTypeUserName}>
                Đặng Xuân Tiến - Chuyên viên
              </NunitoText>
              <NunitoText type="body4" style={styles.dutyTypeUserTeam}>
                Phòng Hệ Thống Thông Tin
              </NunitoText>
            </View>
            <View style={styles.dutyTypeUser}>
              <NunitoText type="body3" style={styles.dutyTypeUserName}>
                Nguyễn Văn Khái - Chuyên viên
              </NunitoText>
              <NunitoText type="body4" style={styles.dutyTypeUserTeam}>
                Phòng Hệ Thống Thông Tin
              </NunitoText>
            </View>
          </View>
        )}
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
          <Menu.Item onPress={() => {}} title="Thành viên" />
          <Divider />
          <Menu.Item onPress={onPressDelete} title="Xóa" />
        </Menu>
      </View>

      {/* Delete confirm modal */}
      {openDelModal && <MyModal title="Xác nhận xóa" onClose={closeCfModal} />}
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  scrollContent: {
    gap: 20,
    padding: 16,
    paddingBottom: 100, // Space at the bottom to prevent overlap with the button
  },
  timeRangeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  timeRangeItem: {
    flexGrow: 1,
  },

  dutyTypeFieldContainer: {
    gap: 6,
  },
  labelWrapper: {
    flexDirection: "row",
    alignContent: "flex-start",
    alignItems: "center",
  },

  dutyTypeGroup: {
    gap: 8,
  },
  dutyTypeItemBox: {
    position: "relative",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: `#CADCE8`,
    borderRadius: 4,
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
  dutyTypeItemContainer: {
    flexDirection: "column",
    gap: 10,
  },

  dutyTypeName: {
    color: "black",
  },
  dutyTypeNameContainer: {
    flexDirection: "row",
    gap: 4,
  },
  bulletBox: {
    position: "relative",
    top: 2,
  },
  bullet: {
    width: 3,
    height: 14,
    backgroundColor: `#0B3A82`,
    borderRadius: 1,
  },
  dutyTypeUserContainer: {
    gap: 10,
    paddingLeft: 16,
  },
  dutyTypeUser: {},
  dutyTypeUserName: {
    color: "black",
  },
  dutyTypeUserTeam: {
    color: "black",
    opacity: 0.75,
  },
});
