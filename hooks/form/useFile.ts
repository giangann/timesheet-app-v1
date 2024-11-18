import { uploadAttachFile } from "@/api/form";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { useCallback } from "react";

export function useUploadFile() {
  const { session } = useSession();
  const onUploadFile = useCallback(
    async (file: File) => {
      let result; // holds the result for success/failure

      try {
        const responseJson = await uploadAttachFile(session, file);
        if (responseJson.statusCode === 200) {
          MyToast.success("Thành công");
          result = responseJson; // success
        } else {
          MyToast.error(responseJson.error ?? responseJson.message);
          result = 1; // failure due to API response
        }
      } catch (error: any) {
        MyToast.error("Upload failed");
        result = 1; // failure due to exception
      } finally {
        // Any cleanup or logging can be done here if needed
        return result; // returns either 0 for success or 1 for failure
      }
    },
    [session]
  );

  return { onUploadFile };
}
