import { error } from 'console';
import { API_URL } from './config';

const insertDocument = async (
  files: File[],
  onUploading: (restCount: number, successCount: number, failCount: number, latestFailFileName: string, errorMessage: string) => void,
) => {
  const fileCount = files.length;
  let successCount = 0;
  let failCount = 0;
  let remainingCount = fileCount;
  let finalErrorMessage = '';

  const updateUploadStatus = (latestFailFileName: string, errorMessage: string) => {
    remainingCount--;
    onUploading(remainingCount, successCount, failCount, latestFailFileName, errorMessage);
  };

  for (let i = 0; i < files.length; i++) {
    const formData = new FormData();
    formData.append('file', files[i]);
    formData.append('filename_as_doc_id', 'true');

    try {
      const response = await fetch(`${API_URL}/uploadFile`, {
        mode: 'cors',
        method: 'POST',
        body: formData,
      });
      let latestFailFileName = '';
      let errorMessage = '';
      if (response.ok) {
        successCount++;
      } else {
        failCount++;
        latestFailFileName = files[i].name;
        const responseBody = await response.text();
        const errorMatch = responseBody.match(/ValueError: (.+)/);
        errorMessage = errorMatch && errorMatch[1] ? errorMatch[1] : 'Unknown error occurred';
        finalErrorMessage = errorMessage;
      }
      updateUploadStatus(latestFailFileName, errorMessage);

    } catch (error) {
      console.error('error:', error);
      const errMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      failCount++;
      finalErrorMessage = errMsg;
      updateUploadStatus('', errMsg);
    }
  }

  return finalErrorMessage;
};

export default insertDocument;
