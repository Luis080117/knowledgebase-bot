import Navbar from 'react-bootstrap/Navbar';
import { useIsAuthenticated } from '@azure/msal-react';
import { SignOutButton } from './SignOutButton';

/**
 * Renders the navbar component with a sign in or sign out button depending on whether or not a user is authenticated
 * @param props
 */
import PropTypes from 'prop-types';

export const PageLayout = (props) => {

  const isAuthenticated = useIsAuthenticated();
  /* const [pageLayoutIndex, setPageLayoutIndex] = useState(1); */

  const handleUploadButtonClick = () => {
    props.onPageTitleChange(2);
  };  

  return (
    <>
      <div className='headerNavigator'>
        <div style={{display:'inline-flex', borderWidth:'0px', width:'400px'}}>
          <a className='headerLogoLink' href="/">
            <img src={'./images/NavLogo.png'} title="Logo" height="26px" width="26px" className="headerLogoImage" />
            <span className='headerLogoText'>Suri Services Bot Preview</span>
            <span className='headerLogoText2'>(v0.0.0)</span>
          </a>
        </div>
        {isAuthenticated ? (
          <div className="headerButtonList">
            <div title='My Documents' style={{display: 'inline-flex', marginRight:'18px', cursor:'pointer'}} onClick={handleUploadButtonClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M2 2.30488C2 1.03193 3.03193 0 4.30488 0H12.4559C12.9951 0 13.5172 0.189037 13.9314 0.534222L19.0975 4.83929C19.623 5.2772 19.9268 5.9259 19.9268 6.60994V18.6951C19.9268 19.9681 18.8949 21 17.622 21H4.30488C3.03193 21 2 19.9681 2 18.6951V2.30488ZM4.30488 1.53659C3.88056 1.53659 3.53659 1.88056 3.53659 2.30488V18.6951C3.53659 19.1194 3.88056 19.4634 4.30488 19.4634H17.622C18.0463 19.4634 18.3902 19.1194 18.3902 18.6951V6.60994C18.3902 6.38193 18.289 6.16569 18.1138 6.01972L12.9477 1.71466C12.8096 1.5996 12.6356 1.53659 12.4559 1.53659H4.30488Z" fill="white"/>
                <path d="M13.0122 0.512207C13.4365 0.512207 13.7805 0.856183 13.7805 1.2805V5.12196H18.6463C19.0707 5.12196 19.4146 5.46594 19.4146 5.89026C19.4146 6.31457 19.0707 6.65855 18.6463 6.65855H13.0122C12.5879 6.65855 12.2439 6.31457 12.2439 5.89026V1.2805C12.2439 0.856183 12.5879 0.512207 13.0122 0.512207Z" fill="white"/>
                <path d="M5.58539 5.37803C5.58539 4.95372 5.92936 4.60974 6.35368 4.60974H9.93905C10.3634 4.60974 10.7073 4.95372 10.7073 5.37803C10.7073 5.80235 10.3634 6.14633 9.93905 6.14633H6.35368C5.92936 6.14633 5.58539 5.80235 5.58539 5.37803Z" fill="white"/>
                <path d="M5.58539 8.96342C5.58539 8.53911 5.92936 8.19513 6.35368 8.19513H15.061C15.4853 8.19513 15.8293 8.53911 15.8293 8.96342C15.8293 9.38774 15.4853 9.73171 15.061 9.73171H6.35368C5.92936 9.73171 5.58539 9.38774 5.58539 8.96342Z" fill="white"/>
                <path d="M5.58539 12.5488C5.58539 12.1245 5.92936 11.7805 6.35368 11.7805H12.5C12.9243 11.7805 13.2683 12.1245 13.2683 12.5488C13.2683 12.9731 12.9243 13.3171 12.5 13.3171H6.35368C5.92936 13.3171 5.58539 12.9731 5.58539 12.5488Z" fill="white"/>
                <path d="M5.58539 16.1341C5.58539 15.7098 5.92936 15.3658 6.35368 15.3658H8.91466C9.33897 15.3658 9.68295 15.7098 9.68295 16.1341C9.68295 16.5585 9.33897 16.9024 8.91466 16.9024H6.35368C5.92936 16.9024 5.58539 16.5585 5.58539 16.1341Z" fill="white"/>
              </svg>
            </div>
            <div title='Help' style={{display: 'inline-flex', marginRight:'18px'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M11 2.46341C6.28537 2.46341 2.46341 6.28537 2.46341 11C2.46341 15.7146 6.28537 19.5366 11 19.5366C15.7146 19.5366 19.5366 15.7146 19.5366 11C19.5366 6.28537 15.7146 2.46341 11 2.46341ZM1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11Z" fill="white"/>
                <path d="M10.0234 12.6186H11.6722C11.4693 10.8683 14.2469 10.64 14.2469 8.78831C14.2469 7.10148 12.9025 6.23904 11.0634 6.23904C9.70637 6.23904 8.59027 6.86051 7.77856 7.79904L8.81856 8.75026C9.44003 8.10343 10.0742 7.74831 10.8478 7.74831C11.8498 7.74831 12.4586 8.17953 12.4586 8.95319C12.4586 10.1834 9.7571 10.6273 10.0234 12.6186ZM10.8605 16.0049C11.4947 16.0049 11.9766 15.5356 11.9766 14.8761C11.9766 14.2166 11.4947 13.76 10.8605 13.76C10.2137 13.76 9.73174 14.2166 9.73174 14.8761C9.73174 15.5356 10.201 16.0049 10.8605 16.0049Z" fill="white"/>
              </svg>
            </div>
            <SignOutButton />
          </div>
        ) : ''}
      </div>
      {props.children}
    </>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  onPageTitleChange: PropTypes.func.isRequired
};