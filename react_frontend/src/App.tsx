import DocumentTools from './components/DocumentTools';
import IndexQuery from './components/IndexQuery';
import './style.scss';
import { PageLayout } from './components/PageLayout';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import './App.css';
import { SignInButton } from './components/SignInButton';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
* Renders information about the signed-in user or a button to retrieve data about the user
*/
const ProfileContent = () => {
  const {accounts} = useMsal();
  return (
      <>
          <h5 className="card-title">Welcome {accounts[0]?.name}</h5>
      </>
  );
};

const MainContent = (props: any) => {

  const handlePageTitleChange = (getPageIndex:number) => {
    props.onPageTitleChange(getPageIndex);
  }; 

  return (
      <div>
          <AuthenticatedTemplate>
            <div className='NewContent' style={{flexDirection:'column', alignItems:'center'}}>
              <IndexQuery checkPageIndex={props.pageIndex} />
              <DocumentTools checkPageIndex={props.pageIndex} onPageTitleChange={handlePageTitleChange} />
            </div>
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
              <div className='floatingCenter loginPanel'>
                <div className='loginPanelFirstRow'>
                  <div style={{display:'flex', flexDirection:'row', flexWrap:'nowrap', width:'100%', alignItems:'flex-start', justifyContent:'flex-start'}}>
                    <div style={{display:'inline-flex'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="26" viewBox="0 0 24 26" fill="none">
                        <path opacity="0.8" d="M0 8.71303C0 9.14338 0.348869 9.49225 0.779221 9.49225H16.2078C20.5113 9.49225 24 6.00356 24 1.70004C24 1.26969 23.6511 0.92082 23.2208 0.92082H7.79221C3.48869 0.92082 0 4.40951 0 8.71303Z" fill="#0279E8"/>
                        <path opacity="0.8" d="M0 24.3C0 24.7303 0.348869 25.0792 0.779221 25.0792H16.2078C20.5113 25.0792 24 21.5905 24 17.287C24 16.8566 23.6511 16.5077 23.2208 16.5077H7.79221C3.48869 16.5077 0 19.9964 0 24.3Z" fill="#06E2AD"/>
                        <path opacity="0.8" d="M7.79221 1.00003C3.48869 1.00003 1.52495e-07 4.48872 3.40608e-07 8.79224L1.01501e-06 24.2208C1.03382e-06 24.6512 0.34887 25 0.779222 25C5.08274 25 8.57143 21.5113 8.57143 17.2078L8.57143 1.77925C8.57143 1.3489 8.22256 1.00003 7.79221 1.00003Z" fill="#7A4FF4"/>
                      </svg>
                    </div>
                    <div className='loginPanelTitle'>Please sign-in.</div>
                  </div>
                  <div style={{height:'158px'}}>
                  </div>
                </div>
                <div className='loginPanelSecondRow'><SignInButton /></div>
              </div>
          </UnauthenticatedTemplate>
      </div>
  );
};

MainContent.propTypes = {
  pageIndex: PropTypes.number.isRequired,
  onPageTitleChange: PropTypes.func.isRequired
};

function App() {
  const [currentPageIndex, setPageIndex] = useState(1);
  const handlePageTitleChange = (getPageIndex:number) => {
    setPageIndex(getPageIndex);
  };

  return (
    <PageLayout onPageTitleChange={handlePageTitleChange}>
    <center>
        <MainContent pageIndex={currentPageIndex} onPageTitleChange={handlePageTitleChange} />
    </center>
    </PageLayout>
  );
}

export default App;
