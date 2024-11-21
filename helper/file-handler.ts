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

export const imageUrlToFile = async (remoteUrl: string): Promise<File> => {
  const response = await fetch(remoteUrl);
  const blob = await response.blob();

  // Extract the filename from the URL
  const filename = remoteUrl.substring(remoteUrl.lastIndexOf('/') + 1);

  // Create a File from the Blob
  return new File([blob], filename, { type: blob.type });
};
