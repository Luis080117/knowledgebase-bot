import { API_URL } from './config';
export type Document = {
  id: string;
  text: string;
};

const fetchDocuments = async (): Promise<Document[]> => {
  const response = await fetch(`${API_URL}/getDocuments`, { mode: 'cors' });

  if (!response.ok) {
    return [];
  }

  const documentList = (await response.json()) as Document[];
  return documentList;
};

export default fetchDocuments;
