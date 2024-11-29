import { createDutyForm, fetchDutySuggestedUsers } from "@/api/form";
import { TDutyFormCreate, TDutyFormCreateDutyTypeField, TDutySuggestedUser, TDutySuggestedUserFilterParams } from "@/api/form/types";
import { fetchDutyTypes } from "@/api/setting";
import { TDutyType } from "@/api/setting/type";
import { useSession } from "@/contexts/ctx";
import { TDutyFormCreateFormField, TPagiParams } from "@/types";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
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

  const onSearchLocalByUserName = useCallback((text:string)=>{},[])

  return { users, isLoading, onFetchDutySuggestedUsers };
}

export function useCreateNewForm() {
  const { session } = useSession();
  const { onUploadFile } = useUploadFile();
  const router = useRouter();

  const onCreate = useCallback(
    async (fields: TDutyFormCreateFormField) => {
      try {
        // process data from form
        const dutyTypes: TDutyFormCreateDutyTypeField[] = fields.dutyTypes.map((el) => ({
          dutyTypeId: el.dutyTypeId,
          userIds: el.dutyTypeUsers.map((user) => user.id),
        })); // ok

        const reqBodyFields: TDutyFormCreate = {
          ...fields,
          dutyTypes: dutyTypes,
          date: moment(fields.date).format("YYYY-MM-DD"),
          startTime: moment(fields.startTime).format("HH:mm:ss"),
          endTime: moment(fields.endTime).format("HH:mm:ss"),
        };

        // upload file
        if (fields.attachFile) {
          const uploadFileRes = await onUploadFile(fields.attachFile);

          if (uploadFileRes !== 1) {
            const fileId = uploadFileRes.data.attachFile.id;
            reqBodyFields["attachFileId"] = fileId;
          }
        }

        // make request
        const createResult = await createDutyForm(session, reqBodyFields);

        // process response
        if (createResult.statusCode === 200) {
          MyToast.success("Thành công");
          router.back();
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
