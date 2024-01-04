import { useEffect, useState } from 'react';
import DocumentUploader from './DocumentUploader';
import DocumentViewer from './DocumentViewer';
import fetchDocuments, { Document } from '../apis/fetchDocuments';
import PropTypes from 'prop-types';

declare global {
  interface Window {
    SlideUpAndDown: (id: string, moveTo: string, autoDelete: boolean) => void;
    InsertWrongMessage: (fileName: string, message: string) => void;
  }
}

const DocumentTools: React.FC<{ checkPageIndex: number, onPageTitleChange: (pageIndex: number) => void }> = ({ checkPageIndex, onPageTitleChange }) => {
  const [refreshViewer, setRefreshViewer] = useState(false);
  const [documentList, setDocumentList] = useState<Document[]>([]);
  const myPageIndex = 2;

  const [uploadFileCount, setUploadFileCount] = useState(0);
  const [uploadSuccessFileCount, setUploadSuccessFileCount] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null); // Track upload errors
  const [titleChanged, setTitleChanged] = useState(true);

  const handleBackButtonClick = () => {
    onPageTitleChange(1);
  };

  const handleUploadDoneStatus = (fileCount: number, successCount: number, titleChanged: boolean) => {
    console.log(titleChanged);
    if (titleChanged) {
      successCount -=1;
      setUploadSuccessFileCount(successCount);
      setUploadFileCount(fileCount+1);
      setTitleChanged(false);
    } else {
      setUploadSuccessFileCount(successCount);
      setUploadFileCount(fileCount);
    }
    console.log(successCount);
    if(successCount > 0){
        window.SlideUpAndDown('UploadDoneTips', '10px', false);
    }
};

  const onHandleUploading = (
    restCount: number,
    successCount: number,
    failCount: number,
    latestFailFileName: string,
    errorMessage: string
  ) => {
    if (latestFailFileName.length > 0) {
      if (errorMessage.includes('Document with similar content already exists!')) {
        window.InsertWrongMessage(latestFailFileName, 'Document with similar content already exists!');
        setUploadError(`Duplicate content detected in '${latestFailFileName}'.`);
      } else {
        handleUploadDoneStatus(restCount, successCount + 1, titleChanged);
        console.log('Called DocumentTools, title ok')
      }
    } else {
      handleUploadDoneStatus(restCount, successCount, titleChanged);
      console.log('Called DocumentTools all good')
    }
  };

  // Get the list on first load
  useEffect(() => {
    fetchDocuments().then((documents) => {
      setDocumentList(documents);
    });
  }, []);

  useEffect(() => {
    if (refreshViewer) {
      setRefreshViewer(false);
      fetchDocuments().then((documents) => {
        setDocumentList(documents);
      });
    }
  }, [refreshViewer]);

  return (
    <div id='documentPanel' className='documentPanel' style={{ display: myPageIndex === checkPageIndex ? 'flex' : 'none' }}>
      <DocumentViewer documentList={documentList} />
      <DocumentUploader setRefreshViewer={setRefreshViewer} onHandleUploadDoneStatus={handleUploadDoneStatus} onHandleUploading={onHandleUploading} />
      <img src={'./images/Back.png'} alt="Back" height='50' className='floatingBackButton' onClick={handleBackButtonClick} />
      <div id='UploadDoneTips' className='UploadDoneTips' style={{ display: uploadSuccessFileCount > 0 ? 'flex' : 'none' }}>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
            <circle cx="10.5" cy="11" r="9.75" stroke="#008A58" strokeWidth="1.5" />
            <path d="M6.17651 10.7193L9.57357 14.0882L16.0589 7.91177" stroke="#008A58" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          Upload {uploadSuccessFileCount === uploadFileCount ? uploadSuccessFileCount.toString() : `${uploadSuccessFileCount}/${uploadFileCount}`} file{uploadSuccessFileCount > 1 ? 's' : ''} successfully.
        </div>
      </div>
      {uploadError && (
        <div className="uploadError">
          {uploadError}
        </div>
      )}
    </div>
  );
};

DocumentTools.propTypes = {
  checkPageIndex: PropTypes.number.isRequired,
  onPageTitleChange: PropTypes.func.isRequired
};

export default DocumentTools;
