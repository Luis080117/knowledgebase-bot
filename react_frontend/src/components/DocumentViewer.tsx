import React from 'react';
import type { Document } from '../apis/fetchDocuments';

const MAX_TITLE_LENGTH = 50;
const MAX_DOC_LENGTH = 300;

type DocumentViewerProps = {
  documentList: Document[];
};

const DocumentViewer = ({ documentList }: DocumentViewerProps) => {

  const handleDownload = (docId: string) => {
    // use the backend localhost.
    const backendBaseUrl = 'http://localhost:4103';
    

    // Split the docId into name and extension, append _1 to the name, and then join them back together
    const parts = docId.split('.');
    if (parts.length > 1) {
        const extension = parts.pop(); // get the last item (extension)
        const name = parts.join('.');  // join the rest back together as the name
        docId = `${name}_1.${extension}`;
    }

    // Construct the URL for the document download endpoint on the backend
    const downloadUrl = `${backendBaseUrl}/downloadDocument/${docId}`;
    // Create an 'a' element to initiate the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};



  const documentListElems = documentList.map((document) => {
    const id =
      document.id.length < MAX_TITLE_LENGTH
        ? document.id
        : document.id.substring(0, MAX_TITLE_LENGTH) + '...';
    const text =
      document.text.length < MAX_DOC_LENGTH
        ? document.text
        : document.text.substring(0, MAX_DOC_LENGTH) + '...';

    return (
      <div key={document.id} className='documentViewerLine'>
        <table style={{width: '100%'}}>
          <tbody>
            <tr>
              <td className='docListIcon'><img src={'./images/DocIcon.png'} alt="DocIcon" width="14" height="20" /></td>
              <td className='docListTitle'>{id}</td>
              <td className='docListUploader'>Leo Gao</td>
              <td className='docListPostTime'>2023-3-6</td>
              <td>
              <img 
                  src='./images/download.png' 
                  alt='Download' 
                  className='downloadIcon' 
                  onClick={() => handleDownload(document.id)}
              />
              </td>
            </tr>
          </tbody>
        </table>
        <div className='documentViewerSubText' title={document.text}>{text}</div>
      </div>
    );
  });

  return (
    <div style={{width:'100%'}}>
      <div className='documentViewTitle'>My Documents</div>
      {documentListElems.length > 0 ? (documentListElems) : (
          <div className='documentViewerLine'>
            <p className='documentViewerSubText'>Upload your first document!</p>
            <p className='documentViewerSubText'>You will see the title and content here.</p>
          </div>
      )}
    </div>
  );
};

export default DocumentViewer;
