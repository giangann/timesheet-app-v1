import { createDutyForm, deleteForm, fetchDutySuggestedUsers } from "@/api/form";
import {
  TDutyFormCreate,
  TDutyFormCreateDutyTypeField,
  TDutyFormEdit,
  TDutyFormEditDutyTypeField,
  TDutySuggestedUser,
  TDutySuggestedUserFilterParams,
} from "@/api/form/types";
import { fetchDutyTypes } from "@/api/setting";
import { TDutyType } from "@/api/setting/type";
import { useSession } from "@/contexts/ctx";
import { TDutyFormCreateFormField, TDutyFormEditFormField, TPagiParams } from "@/types";
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

export function useDeleteForm() {
  const { session } = useSession();

  const onDelete = useCallback(
    async (formId: number) => {
      try {
        const responseJson = await deleteForm(session, formId);
        // process response
        if (responseJson.statusCode === 200) {
          MyToast.success("Thành công");
        } else {
          MyToast.error(responseJson.error ?? responseJson.message);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      }
    },
    [session]
  );

  return { onDelete };
}

export function useEditDutyForm() {
  const { session } = useSession();
  const router = useRouter();
  const { onUploadFile } = useUploadFile();

  const onEdit = useCallback(
    async (dutyFormId: number, fields: TDutyFormEditFormField) => {
      try {
        // process data from form
        const bodyData: TDutyFormEdit = {};

        if (fields.startTime) bodyData["startTime"] = moment(fields.startTime).format("HH:mm:ss");
        if (fields.endTime) bodyData["endTime"] = moment(fields.endTime).format("HH:mm:ss");
        if (fields.salaryCoefficientTypeId) bodyData["salaryCoefficientTypeId"] = fields.salaryCoefficientTypeId;
        if (fields.dutyTypes) {
          const dutyTypes: TDutyFormEditDutyTypeField[] = fields.dutyTypes.map((el) => ({
            dutyTypeId: el.dutyTypeId,
            userIds: el.dutyTypeUsers.map((user) => user.id),
          })); // ok
          bodyData["dutyTypes"] = dutyTypes;
        }
        if (fields.note) bodyData["note"] = fields.note;
        if (fields.attachFile) {
          // upload file, take file id
          const uploadFileRes = await onUploadFile(fields.attachFile);
          if (uploadFileRes !== 1) {
            const uploadedFileId = uploadFileRes.data.attachFile.id;
            bodyData["attachFileId"] = uploadedFileId;
          }
        }

        console.log({ fields, bodyData });

        // make request
        const token = `Bearer ${session}`;
        const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
        const endpoint = `/duty-forms?id=${dutyFormId}`;
        const url = `${baseUrl}${endpoint}`;

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          }, // do not set content-type for formData, let browser do it automatically
          body: JSON.stringify(bodyData),
          credentials: "include",
        });

        const responseJson = await response.json();

        // process response
        if (responseJson.statusCode === 200) {
          MyToast.success("Thành công");
          router.back();
        } else {
          MyToast.error(responseJson.error ?? responseJson.message);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      }
    },
    [session]
  );

  return { onEdit };
}
