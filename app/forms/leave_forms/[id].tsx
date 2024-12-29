import { EditButton } from "@/components/button";
import { LeaveFormDetail, LeaveFormEdit } from "@/components/form";
import { NunitoText } from "@/components/text/NunitoText";
import { FORM_STATUS } from "@/constants/Misc";
import { useDetailLeaveForm } from "@/hooks/form";
import { useNavigation, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { View } from "react-native";

export default function DetailOrEditForm() {
  const router = useRouter();
  const navigation = useNavigation();

  const [edit, setEdit] = useState(false);
  const { form, isLoading } = useDetailLeaveForm();

  const toggleEditMode = () => setEdit((prev) => !prev);

  const isAllowEdit = useMemo(() => form?.status === FORM_STATUS.WATING_APPROVE, [form]);

  useLayoutEffect(() => {
    if (!isAllowEdit) return;
    navigation.setOptions({
      headerRight: () => <EditButton isEdit={edit} onToggleEdit={toggleEditMode} />,
    });
  }, [router, edit, toggleEditMode, isAllowEdit]);

  useEffect(() => {
    const landscapes = [ScreenOrientation.Orientation.LANDSCAPE_LEFT, ScreenOrientation.Orientation.LANDSCAPE_RIGHT];
    const onOrientationChange: ScreenOrientation.OrientationChangeListener = (event) => {
      if (landscapes.includes(event.orientationInfo.orientation)) {
        navigation.setOptions({
          headerShown: false,
        });
      } else {
        navigation.setOptions({
          headerShown: true,
        });
      }
    };
    const orientationChangeSubcribtion = ScreenOrientation.addOrientationChangeListener(onOrientationChange);

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientationChangeSubcribtion);
    };
  }, []);

  useEffect(() => {
    function lockLandscape() {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
    }
    function unlockLandscape() {
      ScreenOrientation.unlockAsync();
    }

    lockLandscape();

    return () => {
      unlockLandscape();
    };
  }, []);

  return (
    <>
      {!form && isLoading && (
        <View>
          <NunitoText>Fetching...</NunitoText>
        </View>
      )}

      {form && !edit && <LeaveFormDetail form={form} />}

      {form && edit && <LeaveFormEdit form={form} />}
    </>
  );
}
