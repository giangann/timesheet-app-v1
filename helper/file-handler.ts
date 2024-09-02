export const createFormData = (fieldName: string, uri: string) => {
  const formData = new FormData();
  const fileName = uri.split("/").pop();
  if (!fileName) return formData;
  const fileType = fileName.split(".").pop();
  formData.append(fieldName, {
    uri,
    name: fileName,
    type: `image/${fileType}`,
  } as any);

  return formData;
};

export const uriToFormDataValidImage = (uri: string) => {
  const fileName = uri.split("/").pop();
  if (!fileName) return null;
  
  const fileType = fileName.split(".").pop();

  return {
    uri,
    name: fileName,
    type: `image/${fileType}`,
  };
};
