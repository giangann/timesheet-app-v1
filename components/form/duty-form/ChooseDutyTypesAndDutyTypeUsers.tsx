import { TDutyType } from "@/api/setting/type";
import { Delayed } from "@/components/Delayed";
import { MySlideModal } from "@/components/MySlideModal";
import { NunitoText } from "@/components/text/NunitoText";
import { useDutyFormCreateContext } from "@/contexts";
import { useDutyTypes } from "@/hooks/form";
import { NoData } from "@/ui/NoData";
import { SkeletonRectangleLoader } from "@/ui/skeletons";
import { memo, useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { DutyTypeItem } from "./DutyTypeItem";

type ChooseDutyTypesAndDutyTypeUsersProps = {};

export const ChooseDutyTypesAndDutyTypeUsers: React.FC<ChooseDutyTypesAndDutyTypeUsersProps> = memo(({}) => {
  const [openSlideModal, setOpenSlideModal] = useState(false);
  const { isLoading: isFetchingDutyTypes, dutyTypes } = useDutyTypes();

  const onOpenDutyTypesModal = useCallback(() => setOpenSlideModal(true), [setOpenSlideModal]);
  const onCloseDutyTypesModal = useCallback(() => setOpenSlideModal(false), [setOpenSlideModal]);

  const { onAddDutyType, formDutyTypes, dutyDate } = useDutyFormCreateContext();

  const onSelectDutyType = useCallback((dutyType: TDutyType) => {
    onAddDutyType({ dutyTypeId: dutyType.id, dutyTypeName: dutyType.dutyTypeName });
    onCloseDutyTypesModal();
  }, []);

  const notSelectedDutyTypes = useMemo(() => {
    return dutyTypes.filter((el) => {
      const isSelected = formDutyTypes.some((selectedDutyType) => selectedDutyType.dutyTypeId === el.id);
      return !isSelected;
    });
  }, [dutyTypes, formDutyTypes]);

  return (
    <View style={styles.dutyTypeFieldContainer}>
      {/*  */}
      <FieldLabel />

      {/*  */}
      {!dutyDate && <Text style={{ color: "red" }}>Hãy chọn Ngày</Text>}

      <View style={styles.dutyTypeGroup}>
        {formDutyTypes.map((selectedDutyType, index) => (
          <DutyTypeItem key={selectedDutyType.dutyTypeId} dutyTypeInfo={selectedDutyType} fieldArrayIndex={index} />
        ))}
      </View>

      {/*  */}
      <Button style={[{ alignItems: "flex-start" }]} onPress={onOpenDutyTypesModal} textColor="#0B3A82" disabled={!dutyDate}>
        + thêm loại trực
      </Button>
      <>
        {openSlideModal && (
          <MySlideModal onClose={onCloseDutyTypesModal}>
            <Delayed>
              {isFetchingDutyTypes && <SkeletonRectangleLoader height={100} />}
              {!isFetchingDutyTypes && (
                <>
                  {notSelectedDutyTypes.map((dutyType) => (
                    <Button key={dutyType.id} onPress={() => onSelectDutyType(dutyType)}>
                      {dutyType.dutyTypeName}
                    </Button>
                  ))}
                </>
              )}
              {!isFetchingDutyTypes && dutyTypes.length <= 0 && <NoData message="Không có loại trực" />}
            </Delayed>
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

const styles = StyleSheet.create({
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

  modalContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    position: "relative",
  },

  modalTitleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  modalTitle: {
    color: "black",
  },

  modalContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flex: 1,
  },

  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  filterItem: {
    flexGrow: 1,
  },

  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
  },

  userCardWrapper: {
    position: "relative",
    paddingBottom: 16,
  },
  userCheckboxWrapper: {
    position: "absolute",
    right: 20,
    top: 20,
  },
});
