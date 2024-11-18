import { createDutyForm, fetchDutySuggestedUsers } from "@/api/form";
import { TDutyFormCreate, TDutyFormCreateDutyTypeField, TDutySuggestedUser, TDutySuggestedUserFilterParams } from "@/api/form/types";
import { fetchDutyTypes } from "@/api/setting";
import { TDutyType } from "@/api/setting/type";
import { useSession } from "@/contexts/ctx";
import { TDutyFormCreateFormField, TPagiParams } from "@/types";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useUploadFile } from "./useFile";

export function useDutyTypes() {
  const [dutyTypes, setDutyTypes] = useState<TDutyType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSession();

  const onFetchDutyTypes = async () => {
    setIsLoading(true);
    try {
      const responseJson = await fetchDutyTypes(session);
      if (responseJson.statusCode === 200) {
        setDutyTypes(responseJson.data.dutyTypes);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onFetchDutyTypes();
    }, [session])
  );

  return { dutyTypes, isLoading, onFetchDutyTypes };
}

export function useSuggestDutyUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<TDutySuggestedUser[]>([]);
  const { session } = useSession();

  const onFetchDutySuggestedUsers = useCallback(async (pagiParams: TPagiParams, filterParams: TDutySuggestedUserFilterParams) => {
    setIsLoading(true);
    try {
      const responseJson = await fetchDutySuggestedUsers(session, pagiParams, filterParams);
      if (responseJson.statusCode === 200) {
        setUsers(responseJson.data.users);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { users, isLoading, onFetchDutySuggestedUsers };
}

export function useCreateNewForm() {
  const { session } = useSession();
  const { onUploadFile } = useUploadFile();
  const onCreate = useCallback(
    async (fields: TDutyFormCreateFormField) => {
      try {
        let createResult: any = {};
        const dutyTypes: TDutyFormCreateDutyTypeField[] = fields.dutyTypes.map((el) => ({ dutyTypeId: el.dutyTypeId, userIds: el.userIds })); // ok

        const dutyTypesStringfy = JSON.stringify(dutyTypes)
        if (fields.attachFile) {
          const uploadFileRes = await onUploadFile(fields.attachFile);

          if (uploadFileRes !== 1) {
            const fileId = uploadFileRes.data.attachFile.id;
            createResult = await createDutyForm(session, { ...fields, dutyTypes: dutyTypes, attachFileId: fileId });
          }
        } else {
          createResult = await createDutyForm(session, { ...fields, dutyTypes: dutyTypes });
        }

        if (createResult.statusCode === 200) {
          MyToast.success("Thành công");
        } else {
          MyToast.error(createResult.error ?? createResult.message);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      }
    },
    [session]
  );

  return { onCreate };
}
