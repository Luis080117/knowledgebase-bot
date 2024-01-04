import React, { ChangeEvent, useState, useEffect } from 'react';
import { CircleLoader } from 'react-spinners';
import insertDocument from '../apis/insertDocument';

interface HTMLInputEvent extends ChangeEvent {
  target: HTMLInputElement & EventTarget;
}

declare global {
  interface Window {
    PostForm: () => void;
  }
}

type DocumentUploaderProps = {
  setRefreshViewer: (refresh: boolean) => void;
  onHandleUploadDoneStatus: (fileCount: number, successCount: number, titleChanged: boolean) => void;
  onHandleUploading: (restCount: number, successCount: number, failCount: number, latestFailFileName: string, errorMessage: string) => void;
};

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ setRefreshViewer, onHandleUploadDoneStatus, onHandleUploading }) => {
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [isLoading, setIsLoading] = useState(0);
  const [filesCount, setFilesCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [restCount, setRestCount] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [titleChanged, setTitleChanged] = useState(false);


  useEffect(() => {
    if (isLoading === 2) {
      onHandleUploadDoneStatus(filesCount, successCount, titleChanged);
    } else {
      onHandleUploadDoneStatus(0, 0, titleChanged);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isFilePicked) {
      window.PostForm();
    }
  }, [isFilePicked]);

  const changeHandler = (event: HTMLInputEvent) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFile(filesArray);
      setFilesCount(filesArray.length);
      setSuccessCount(0);
      setRestCount(0);
      setIsFilePicked(true);
      setIsLoading(0);
    }
  };

  const uploading = async (restCount: number, successCount: number, failCount: number, latestFailFileName: string, errorMessage: string) => {
    if (errorMessage.startsWith('Document with similar title already exists!')) {
        const newTitle = prompt(`${errorMessage} Please provide a new title:`, latestFailFileName);

        if (newTitle) {
            const isTitleRepeated = selectedFile.some(file => file.name === newTitle);

            console.log(isTitleRepeated);
            if (!isTitleRepeated) {
                setTitleChanged(true);
                const fileIndex = selectedFile.findIndex(file => file.name === latestFailFileName);
                const newFile = new File([await selectedFile[fileIndex].arrayBuffer()], newTitle, { type: selectedFile[fileIndex].type });

                const newSelectedFile = [...selectedFile];
                newSelectedFile[fileIndex] = newFile;
                setSelectedFile(newSelectedFile);

                const newErrorMessage = await insertDocument([newSelectedFile[fileIndex]], uploading);
                if (newErrorMessage) {
                    onHandleUploading(restCount, successCount, failCount + 1, latestFailFileName, newErrorMessage);
                    return;
                } else {
                  onHandleUploading(restCount, successCount + 1, failCount, latestFailFileName, newErrorMessage);
                }
            } else {
                window.InsertWrongMessage(latestFailFileName, 'Document with similar title already exists!');
                setUploadError(`Duplicate title detected in '${latestFailFileName}'.`);
            }
        }
    } else if (errorMessage.startsWith('Document with similar content already exists!')){
        window.InsertWrongMessage(latestFailFileName, 'Document with similar content already exists!');
        setUploadError(`Duplicate content detected in '${latestFailFileName}'.`);
    } else {
        if (!errorMessage) {
           setSuccessCount(prevCount => prevCount + 1);
        }
    }
};

  const handleSubmission = async () => {
    if (selectedFile.length > 0) {
      setIsLoading(1);
      setRestCount(filesCount);

      const finalErrorMessage = await insertDocument(selectedFile, uploading);
      if (!finalErrorMessage) {
        setRefreshViewer(true);
      }

      setIsLoading(2);
    }
  };

  return (
    <div className='floatingUploader'>
      <input className='uploadButton' type='file' name='file-input' id='file-input' accept='.docx,.pdf,.txt,.json,.md,.xlsx' multiple onChange={changeHandler} />
      <label htmlFor={isLoading == 1?'':'file-input'} style={{cursor:'pointer', padding: '0px'}}>
        {isLoading == 1 ?
        (<div id='divUploadButton' className='uploadButtonTips'>
          <div className='uploadButtonTipsText'>{restCount}</div>
          <div className='uploadButtonTipsBG'></div>
        </div>):
        (<div className='uploadButtonSVG'><svg xmlns="http://www.w3.org/2000/svg" width="86" height="86" viewBox="0 0 86 86" fill="none">
        <g filter="url(#filter0_d_3352_1584)">
          <circle cx="43" cy="39" r="25" fill="url(#paint0_linear_3352_1584)"/>
        </g>
        <path d="M33.7683 42.3415C34.1926 42.3415 34.5366 42.6854 34.5366 43.1098V46.1829C34.5366 46.8901 35.1099 47.4634 35.8171 47.4634H50.1585C50.8657 47.4634 51.439 46.8901 51.439 46.1829V43.1098C51.439 42.6854 51.783 42.3415 52.2073 42.3415C52.6316 42.3415 52.9756 42.6854 52.9756 43.1098V46.1829C52.9756 47.7388 51.7144 49 50.1585 49H35.8171C34.2612 49 33 47.7388 33 46.1829V43.1098C33 42.6854 33.344 42.3415 33.7683 42.3415Z" fill="white"/>
        <path d="M42.9877 44.9024C43.412 44.9024 43.7559 44.5585 43.7559 44.1341V28.7683C43.7559 28.344 43.412 28 42.9877 28C42.5633 28 42.2194 28.344 42.2194 28.7683V44.1341C42.2194 44.5585 42.5633 44.9024 42.9877 44.9024Z" fill="white"/>
        <path d="M35.7426 34.8987C36.0167 35.2227 36.5015 35.2631 36.8254 34.989L42.9876 29.7747L49.1499 34.989C49.4738 35.2631 49.9586 35.2227 50.2327 34.8987C50.5068 34.5748 50.4664 34.09 50.1424 33.816L43.4839 28.1818C43.1975 27.9394 42.7778 27.9394 42.4914 28.1818L35.8328 33.816C35.5089 34.09 35.4685 34.5748 35.7426 34.8987Z" fill="white"/>
        <defs>
          <filter id="filter0_d_3352_1584" x="0" y="0" width="86" height="86" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="9"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3352_1584"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3352_1584" result="shape"/>
          </filter>
          <linearGradient id="paint0_linear_3352_1584" x1="19.5" y1="27.4997" x2="59.4997" y2="56.5004" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5856D7"/>
            <stop offset="0.526042" stopColor="#4E29E3"/>
            <stop offset="1" stopColor="#275BE2"/>
          </linearGradient>
        </defs>
      </svg></div>)
        }
      </label>
      {/* {isFilePicked && selectedFile ? (
        <div className='uploader__details'>
          <div className='uploader__details'>
            <p>{selectedFile.name}</p>
          </div>
        </div>
      ) : (
        <div className='uploader__details'>
          <p>Select a file to insert</p>
        </div>
      )} */}
      
      {isFilePicked && isLoading != 1 && (<button id="submitUpload" className='uploadButton' onClick={handleSubmission}>Submit</button>)}
      {/* isLoading && <CircleLoader color='#00f596' /> */}
    </div>
  );
};

export default DocumentUploader;
