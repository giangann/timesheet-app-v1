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


/**
 * Extracts the file name from a URL with query parameters.
 * 
 * @param url - The URL containing the file path.
 * @returns The extracted file name.
 */
export function extractFileName(url: string): string | null {
  try {
    // Create a new URL object to parse the input URL
    const parsedUrl = new URL(url);

    // Extract the pathname (e.g., /timesheet/filename.jpg)
    const pathname = parsedUrl.pathname;

    // Split the pathname by "/" and get the last part (file name)
    const fileName = pathname.split('/').pop();

    return fileName || null;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}

export function fileNameToUri(fileName:string|null):string{
  const baseUrl = "https://chamcong.vptw.dcs.vn/api/api/v1"
  const endpoint = "/attach-files/object/"
  
  return `${baseUrl}${endpoint}${fileName}`
}