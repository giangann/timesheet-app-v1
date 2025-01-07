import {
  TDutySuggestedUser,
  TDutySuggestedUserFilterParams,
} from "@/api/form/types";
import { MyIconButton } from "@/components/button";
import { Delayed } from "@/components/Delayed";
import { NunitoText } from "@/components/text/NunitoText";
import { useSuggestDutyUsers } from "@/hooks/form";
import { useDutyFormCreateProvider } from "@/providers";
import { TDutyFormAttendanceInfo } from "@/types";
import { NoData } from "@/ui/NoData";
import { SkeletonRectangleLoader } from "@/ui/skeletons";
import { AntDesign } from "@expo/vector-icons";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Modal, SafeAreaView, StyleSheet, View } from "react-native";
import { AnimatedFAB, SegmentedButtons, TextInput } from "react-native-paper";
import { SuggestUserCard } from "./SuggestUserCard";
import moment from "moment";
import { FilterUserForm } from "./FilterUserForm";

type TFilterCheckStatus = "checked" | "all";
type TUserWithCheckStatus = TDutySuggestedUser & { isChecked: boolean };

export const SelectDutyUsersModal: React.FC = memo(() => {
  const {
    selectingDutyType,
    setOpenSelectUsersModal,
    setOpenSelectDutyTypeModal,
    useFieldArrayReturn,
    useFormReturn,
  } = useDutyFormCreateProvider();
  const {
    users: suggestedUsers,
    isLoading: isFetchingUsers,
    onFetchDutySuggestedUsers,
  } = useSuggestDutyUsers();

  const [filterCheckStatus, setFilterCheckStatus] =
    useState<TFilterCheckStatus>("all");
  const [text, setText] = useState("");

  const selectedUserIdsRef = useRef<number[]>(
    useFieldArrayReturn?.fields
      ?.filter((field) => field.dutyTypeId === selectingDutyType?.id)?.[0]
      ?.dutyTypeUsers?.map((user) => user.id) ?? []
  );

  const usersWithCheckStatus: TUserWithCheckStatus[] = useMemo(
    () =>
      suggestedUsers.map((user) => ({
        ...user,
        isChecked: selectedUserIdsRef.current.includes(user.id) ? true : false,
      })),
    [suggestedUsers, selectedUserIdsRef]
  );
  const selectedUsers = useMemo(
    () => usersWithCheckStatus.filter((user) => user.isChecked),
    [usersWithCheckStatus]
  );

  const users: TDutyFormAttendanceInfo[] = useMemo(
    () => (filterCheckStatus === "all" ? usersWithCheckStatus : selectedUsers),
    [selectedUsers, usersWithCheckStatus, filterCheckStatus]
  );

  const searchedUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(text.toLowerCase())
    );
  }, [text, users]);

  const onCloseBtnPressed = useCallback(() => {
    setOpenSelectUsersModal(false);
    setOpenSelectDutyTypeModal(false);
  }, [setOpenSelectUsersModal, setOpenSelectDutyTypeModal]);

  const onSaveBtnPressed = useCallback(() => {
    const selectedIds = selectedUserIdsRef.current;

    // close 2 modal
    setOpenSelectUsersModal(false);
    setOpenSelectDutyTypeModal(false);

    // update fields from state to form
    const dutyTypes = useFieldArrayReturn?.fields ?? [];
    const selectingDutyTypeId = selectingDutyType?.id;
    const currentDutyType = dutyTypes.filter(
      (field, index) => field.dutyTypeId === selectingDutyTypeId
    )?.[0];

    // take dutyTypeUsers
    const dutyTypeUsers = users.filter((user) => selectedIds.includes(user.id));

    if (!currentDutyType) {
      useFieldArrayReturn?.append({
        dutyTypeId: selectingDutyType!.id,
        dutyTypeName: selectingDutyType!.name,
        dutyTypeUsers: dutyTypeUsers,
      });
    } else {
      // find index
      const fieldIndex =
        useFieldArrayReturn?.fields?.findIndex(
          (field) => field.dutyTypeId === selectingDutyTypeId
        ) ?? -1;

      useFieldArrayReturn?.update(fieldIndex, {
        dutyTypeId: selectingDutyType!.id,
        dutyTypeName: selectingDutyType!.name,
        dutyTypeUsers: dutyTypeUsers,
      });
    }
  }, [selectedUserIdsRef, selectingDutyType, useFieldArrayReturn, users]);

  const onSelectUser = useCallback(
    (user: TDutyFormAttendanceInfo) => {
      const selectedIds: number[] = selectedUserIdsRef.current;
      const hasUser = selectedIds.includes(user.id);

      // If already have, remove. Else add new
      if (hasUser)
        selectedUserIdsRef.current = selectedIds.filter(
          (selectedId) => selectedId !== user.id
        );
      else selectedUserIdsRef.current = [...selectedIds, user.id];
    },
    [selectedUserIdsRef]
  );

  const onFilterApply = useCallback(
    (params: TDutySuggestedUserFilterParams) => {
      onFetchDutySuggestedUsers({ page: 0, size: 50 }, params);
    },
    []
  );

  useEffect(() => {
    onFetchDutySuggestedUsers(
      { page: 0, size: 50 },
      _defaultFilterParams(
        selectingDutyType!.id,
        moment(useFormReturn?.getValues("date")).format("YYYY-MM-DD")
      )
    );
  }, [onFetchDutySuggestedUsers, selectingDutyType]);

  return (
    <Modal transparent animationType="slide">
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.modalContainer}>
          <Delayed waitBeforeShow={100}>
            <View>
              {/* Title */}
              <View style={styles.modalTitleWrapper}>
                <NunitoText type="heading2" style={styles.modalTitle}>
                  {selectingDutyType?.name} - chọn người tham gia
                </NunitoText>
                <MyIconButton
                  onPressed={onCloseBtnPressed}
                  iconElement={
                    <AntDesign name="close" size={20} color="black" />
                  }
                  paddingSize={16}
                  extendStyles={{ position: "absolute", right: 0, top: 0 }}
                />
              </View>

              {/* Content */}
              <FlatList
                data={searchedUsers}
                renderItem={({ item: user }) => (
                  <SuggestUserCard
                    isChecked={user.isChecked}
                    key={user.id}
                    user={user}
                    onSelectUser={onSelectUser}
                  />
                )}
                ListEmptyComponent={
                  isFetchingUsers ? (
                    <SkeletonRectangleLoader height={400} />
                  ) : (
                    <NoData message="Không có nhân viên thuộc loại trực" />
                  )
                }
                ListHeaderComponent={
                  <View style={{ gap: 2 }}>
                    <View style={styles.filterContainer}>
                      <View style={styles.filterItem}>
                        <SegmentedButtons
                          value={filterCheckStatus}
                          onValueChange={(value: string) => {
                            console.log({ value });
                            setFilterCheckStatus(value as TFilterCheckStatus);
                          }}
                          buttons={[
                            { value: "all", label: "Tất cả" },
                            { value: "checked", label: "Đã chọn" },
                          ]}
                          style={{ marginLeft: -1 }}
                        />
                      </View>

                      <FilterUserForm
                        onApply={onFilterApply}
                        defaultFilterParmas={_defaultFilterParams(
                          selectingDutyType!.id,
                          moment(useFormReturn?.getValues("date")).format(
                            "YYYY-MM-DD"
                          )
                        )}
                      />
                    </View>
                    {/* Search */}
                    <TextInput
                      style={{ height: 36 }}
                      mode="outlined"
                      label="Tên thành viên"
                      value={text}
                      onChangeText={(text) => setText(text)}
                      placeholder="nhập tên để tìm kiếm "
                    />
                  </View>
                }
                contentContainerStyle={styles.modalContentContainer}
              />
            </View>
          </Delayed>
          {/* Save button */}
          <AnimatedFAB
            icon={"plus"}
            label={"Label"}
            extended={false}
            onPress={onSaveBtnPressed}
            visible={true}
            animateFrom={"right"}
            iconMode={"static"}
            style={[styles.fabStyle]}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
});
const styles = StyleSheet.create({
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
    gap: 16,
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
});

const _defaultFilterParams = (
  dutyTypeId: number,
  dutyDate: string
): TDutySuggestedUserFilterParams => ({
  date: dutyDate,
  startDate: moment().startOf("year").format("YYYY-MM-DD"),
  endDate: moment().endOf("year").format("YYYY-MM-DD"),
  dutyTypeId,
  sort: sortOpts[0].value,
});

export const sortOpts = [
  {
    label: "Số lần trực tăng dần",
    value: "numOnDuty,asc",
  },
  {
    label: "Số lần trực giảm dần",
    value: "numOnDuty,desc",
  },
];
