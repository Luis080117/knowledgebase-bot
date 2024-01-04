import { useState, useEffect, useRef } from 'react';
import { CircleLoader } from 'react-spinners';
import classNames from 'classnames';
import queryIndex, { ResponseSources } from '../apis/queryIndex';



declare global {
  interface Window {
    CreateQuery: (param1: string, param2: string) => void;
    CreateAnswer: (param1: string, param2: string) => void;
    CreateSource:(param2: object[]) => void;
    ScrollToEnd:() => void;
  }
}

function ConvertNowTimeToString(){
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day}/${year} ${hours}:${minutes}`;
}

const IndexQuery = ({ checkPageIndex }: { checkPageIndex: number }) => {
  const [queryText, setQueryText] = useState('');
  const [isPostQuery, setIsPostQuery] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [responseSources, setResponseSources] = useState<ResponseSources[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    console.log('copied');
    const answerContextElement = document.getElementById('responsecontext');
    if (answerContextElement) {
      const textToCopy = responseText; // Assuming responseText is the state variable that holds the response text
  
      navigator.clipboard.writeText(textToCopy).then(() => {
        console.log('Response text successfully copied to clipboard');
        answerContextElement.classList.add('copy-animation');
        setIsCopied(true);
      }).catch(err => {
        console.error('Could not copy response text: ', err);
      });
    }
  };  
  

  useEffect(() => {
    inputRef.current?.focus();
  }, [checkPageIndex]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isPostQuery]);

  useEffect(() => {
    window.CreateSource(sourceElems);
  }, [responseSources]);

  const handleQuery = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setQueryText(e.currentTarget.value);
    if (e.key === 'Enter') {
      setIsLoading(true);
      setResponseSources([]);
      queryIndex(queryText).then((response) => {
        setIsLoading(false);
        setResponseText(response.text);
        setIsPostQuery(true);
        window.CreateQuery(queryText, ConvertNowTimeToString());
        window.CreateAnswer(response.text, ConvertNowTimeToString());
        setResponseSources(response.sources);
        window.ScrollToEnd();
      });
    }
  };

  const handleSend = () => {
    setIsLoading(true);
    setResponseSources([]);
    queryIndex(queryText).then((response) => {
      setIsLoading(false);
      setResponseText(response.text);
      setIsPostQuery(true);
      window.CreateQuery(queryText, ConvertNowTimeToString());
      window.CreateAnswer(response.text, ConvertNowTimeToString());
      setResponseSources(response.sources);
      window.ScrollToEnd();
    });
  };

  const sourceElems = responseSources.map((source) => {
    const nodeTitle =
      source.doc_id.length > 100
        ? source.doc_id.substring(100, 50) + '...'
        : source.doc_id;
    const nodeText =
      source.text.length > 500 ? source.text.substring(0, 500) + '...' : source.text;
    const nodeFooter =
      'Similarity=' +
      source.similarity +
      ', start=' +
      source.start +
      ', end=' +
      source.end;
    return (
      <div key={source.doc_id}>
        <p>{nodeTitle}</p>
        <p>{nodeText}</p>
        <p>{nodeFooter}</p>
      </div>
    );
  });

  return (
    <div className='queryPanel' style={{display:checkPageIndex==1 ? 'flex': 'none'}}>
      <div id="cipLoader" className="cip-loader" style={{display: isLoading?'block':'none'}}>
        <div className="cip-loader__inner cip-loader-cycle-opacity">
          <div className="cip-spin">
            <div className="cip-spin__inner">
              <div>Suri</div>
            </div>
          </div>
        </div>
      </div>
      <div id='firstQuery' className='firstQueryInput' style={{display: isPostQuery?'none':'flex'}}>
        <div style={{display:'flex', alignItems:'left', height:'30px'}}>
          <img src={'./images/Star.png'} title="Star" height="20" style={{display: 'inline-flex', marginRight:'5px'}} />
          <img src={'./images/Ask.png'} title="Question" height="20" style={{display: 'inline-flex'}} />
        </div>
        <div id='firstInputQuery' style={{position:'relative'}}>
        <img src={'./images/Send.png'} title="Send" height="21" width="21" style={{position: 'absolute', top:'12px', right:'12px', zIndex:'2'}} onClick={handleSend} />
        <input
          id='firstInputText'
          className='firstInputBox'
          type='text'
          ref={checkPageIndex === 1 && isPostQuery ? null : inputRef}
          name='query-text'
          placeholder='Enter a question here'
          onKeyUp={handleQuery}
          style={{ width: '100%', position: 'relative', zIndex: '1', paddingRight: '35px' }}
          autoComplete="off"
          list="" // Add this line to disable suggestions
        ></input>
        </div>
        <div style={{paddingTop: '100px'}}></div>
        <div className='TitleBox'>
          <div className='TitleBoxFirstRow'>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M24.51 6.72C22.98 6.72 21.72 7.965 21.72 9.495C21.72 10.275 22.05 10.98 22.56 11.49L19.35 15.435C18.9 15.105 18.33 14.91 17.73 14.91C16.86 14.91 16.095 15.3 15.57 15.93L13.77 13.47C14.49 12.96 14.955 12.135 14.955 11.19C14.955 9.66 13.71 8.415 12.165 8.415C10.62 8.415 9.37498 9.66 9.37498 11.19C9.37498 11.34 9.38998 11.49 9.40498 11.64L6.65999 13.68C6.14998 13.155 5.44499 12.825 4.64999 12.825C3.11999 12.825 1.85999 14.07 1.85999 15.6C1.85999 17.13 3.10499 18.375 4.64999 18.375C6.17999 18.375 7.43998 17.13 7.43998 15.6C7.43998 15.21 7.36498 14.85 7.21498 14.52L9.77998 12.63C10.275 13.44 11.145 13.965 12.165 13.965C12.39 13.965 12.615 13.935 12.825 13.89L15.045 16.935C14.97 17.175 14.94 17.43 14.94 17.7C14.94 19.23 16.185 20.475 17.73 20.475C19.26 20.475 20.52 19.23 20.52 17.7C20.52 17.13 20.355 16.605 20.055 16.17L23.415 12.06C23.745 12.21 24.12 12.285 24.51 12.285C26.055 12.285 27.3 11.04 27.3 9.51C27.3 7.965 26.055 6.72 24.51 6.72ZM4.66498 16.875C3.95999 16.875 3.38999 16.305 3.38999 15.6C3.38999 14.895 3.95999 14.325 4.66498 14.325C5.36998 14.325 5.93999 14.895 5.93999 15.6C5.93999 16.305 5.36998 16.875 4.66498 16.875ZM10.89 11.19C10.89 10.485 11.46 9.915 12.165 9.915C12.87 9.915 13.44 10.485 13.44 11.19C13.44 11.895 12.87 12.465 12.165 12.465C11.46 12.465 10.89 11.895 10.89 11.19ZM17.745 18.99C17.04 18.99 16.47 18.42 16.47 17.715C16.47 17.01 17.04 16.44 17.745 16.44C18.45 16.44 19.02 17.01 19.02 17.715C19.02 18.42 18.45 18.99 17.745 18.99ZM24.51 10.785C23.805 10.785 23.235 10.215 23.235 9.51C23.235 8.805 23.805 8.235 24.51 8.235C25.215 8.235 25.785 8.805 25.785 9.51C25.8 10.215 25.23 10.785 24.51 10.785Z" fill="#3E52A0"/>
              </svg>
            </div>
            <div className='TitleBoxText'>Servicios</div>
          </div>
          <div className='TitleBoxContext'>Suri Services se especializa en servicios de consultoría de TI, proporcionando una amplia gama de soluciones para optimizar sus entornos en diferentes plataformas de nube.</div>
        </div>
        <div className='TitleBox'>
          <div className='TitleBoxFirstRow'>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M25.5015 11.2815C24.963 10.773 24.2715 10.4865 23.5545 10.4715C23.499 10.47 23.4435 10.4715 23.3895 10.473V4.716C23.3895 4.0545 22.854 3.519 22.1925 3.519H5.66697C5.00547 3.519 4.46997 4.0545 4.46997 4.716V25.2825C4.46997 25.944 5.00547 26.4795 5.66697 26.4795H22.1925C22.854 26.4795 23.3895 25.944 23.3895 25.2825V17.652L25.7385 15.162C26.7465 14.0955 26.64 12.3555 25.5015 11.2815ZM21.474 24.5655H6.38547V5.4345H21.474V11.4165L16.221 16.983C16.065 17.148 15.951 17.3415 15.879 17.5575L14.4705 21.8265C14.4126 22.002 14.4067 22.1906 14.4536 22.3693C14.5004 22.5481 14.598 22.7096 14.7345 22.8342C14.871 22.9588 15.0406 23.0413 15.2229 23.0717C15.4052 23.1021 15.5924 23.0791 15.762 23.0055L19.8345 21.2385C20.0265 21.1545 20.1975 21.036 20.3415 20.8845L21.474 19.683V24.5655ZM24.345 13.848L23.3895 14.8605L21.474 16.8915L19.0005 19.512L16.9605 20.3985L17.673 18.237L21.474 14.2095L23.007 12.585C23.1255 12.459 23.2725 12.411 23.391 12.3945C23.4405 12.387 23.484 12.3855 23.5185 12.387C23.7585 12.3915 23.997 12.4935 24.189 12.675C24.5505 13.017 24.6225 13.554 24.345 13.848Z" fill="#3E52A0"/>
                <path d="M8.97001 10.815H18.87C19.3995 10.815 19.83 10.3845 19.83 9.855C19.83 9.3255 19.3995 8.895 18.87 8.895H8.97001C8.7154 8.895 8.47122 8.99614 8.29119 9.17617C8.11115 9.35621 8.01001 9.60039 8.01001 9.855C8.01001 10.1096 8.11115 10.3538 8.29119 10.5338C8.47122 10.7139 8.7154 10.815 8.97001 10.815ZM16.83 14.355C16.83 13.8255 16.3995 13.395 15.87 13.395H8.97001C8.44051 13.395 8.01001 13.8255 8.01001 14.355C8.01001 14.8845 8.44051 15.315 8.97001 15.315H15.87C16.3995 15.315 16.83 14.8845 16.83 14.355Z" fill="#3E52A0"/>
              </svg>
            </div>
            <div className='TitleBoxText'>Expertos en el sector TI</div>
          </div>
          <div className='TitleBoxContext'>Contamos con expertos en el sector de Tecnologías de la Información, respaldados por décadas de experiencia por parte de nuestros colaboradores.</div>
        </div>
        <div className='TitleBox'>
          <div className='TitleBoxFirstRow'>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M11.9637 15.6445C10.8592 14.7475 10.1525 13.3731 10.1525 11.8324C10.1525 9.12949 12.3272 6.93838 15.01 6.93838C17.6927 6.93838 19.8674 9.12949 19.8674 11.8324C19.8674 13.3731 19.1607 14.7475 18.0562 15.6445C20.9886 16.8542 23.054 19.7581 23.054 23.1478C23.054 23.4747 23.0347 23.7973 22.9975 24.114H21.249C21.2974 23.794 21.3214 23.4712 21.3214 23.1478C21.3214 19.6356 18.4954 16.7886 15.0097 16.7886C11.5239 16.7886 8.69795 19.6356 8.69795 23.1478C8.69795 23.4762 8.72256 23.799 8.77031 24.114H7.02246C6.98474 23.7933 6.96586 23.4707 6.96592 23.1478C6.96592 19.7581 9.03164 16.8545 11.9637 15.6445ZM15.0103 14.981C16.7361 14.981 18.1351 13.5715 18.1351 11.8327C18.1351 10.0939 16.7361 8.68447 15.0103 8.68447C13.2844 8.68447 11.8854 10.0939 11.8854 11.8327C11.8854 13.5712 13.2844 14.981 15.0103 14.981ZM20.0856 5.88574C22.7666 5.88574 24.9401 8.07715 24.9401 10.7807C24.9401 12.3217 24.2341 13.6963 23.1302 14.5934C26.0607 15.8036 28.125 18.7078 28.125 22.0983C28.125 22.4253 28.1057 22.7479 28.0685 23.0648H26.3212C26.3695 22.7449 26.3936 22.4218 26.3936 22.0983C26.3936 18.5856 23.8412 15.738 20.3575 15.738C19.8387 15.7236 19.4739 15.3331 19.4739 14.8339C19.4739 14.3347 19.8114 13.9573 20.3575 13.9298C22.0822 13.9298 23.2087 12.52 23.2087 10.781C23.2087 9.04189 21.8106 7.63213 20.0856 7.63213C19.9649 7.63213 19.824 7.64648 19.6629 7.67578C19.2428 7.75137 18.8408 7.47217 18.7649 7.05205C18.7614 7.03272 18.7588 7.01338 18.7567 6.99404C18.7025 6.46641 19.0781 5.99121 19.6043 5.92236C19.7895 5.89775 19.9497 5.88574 20.0856 5.88574ZM9.91436 5.88574C7.2334 5.88574 5.05986 8.07715 5.05986 10.7807C5.05986 12.3217 5.76592 13.6963 6.86982 14.5934C3.93926 15.8036 1.875 18.7078 1.875 22.0983C1.875 22.4253 1.89434 22.7479 1.93154 23.0648H3.67881C3.63056 22.7449 3.60637 22.4219 3.60645 22.0983C3.60645 18.5856 6.15879 15.738 9.64248 15.738C10.0553 15.7781 10.5261 15.3331 10.5261 14.8339C10.5261 14.3347 10.0553 13.9301 9.64248 13.9298C7.91777 13.9298 6.79131 12.52 6.79131 10.781C6.79131 9.04189 8.18936 7.63213 9.91436 7.63213C10.0351 7.63213 10.176 7.64648 10.3371 7.67578C10.7572 7.75137 11.1592 7.47217 11.2351 7.05205C11.2386 7.03272 11.2412 7.01338 11.2433 6.99404C11.2975 6.46641 10.9219 5.99121 10.3957 5.92236C10.2105 5.89775 10.05 5.88574 9.91436 5.88574Z" fill="#3E52A0"/>
              </svg>
            </div>
            <div className='TitleBoxText'>Mejor equipo a tu alcance</div>
          </div>
          <div className='TitleBoxContext'>Nuestras soluciones están diseñadas para no solo mejorar tus herramientas, sino también para reducir de manera efectiva tus costos.</div>
        </div>
      </div>
      <div id='resultPanel' className='resultPanel' style={{display: isPostQuery?'flex':'none'}}>
      </div>
      <div id='secondInputQuery' className='secondInputQuery' style={{ display: isPostQuery ? 'block' : 'none', zIndex: 2 }}>
        <div className='secondInputMask'>
          <img src={'./images/Send.png'} title="Send" height="21" width="21" style={{ position: 'absolute', top: '12px', right: '12px', zIndex: '2' }} onClick={handleSend} />
          <input id='secondInputText' className='firstInputBox'
            ref={checkPageIndex == 1 && isPostQuery ? inputRef : null}
            type='text'
            name='query-text'
            placeholder='Enter a question here'
            onKeyUp={handleQuery}
            style={{ width: '100%', position: 'relative', zIndex: '1', paddingRight: '35px' }}
          ></input>
        </div>
      </div>


      <div id='historyTemplate' className='historyConversation' style={{ display:'none'}}>
        <div id='historyQuery' className='conversation'>
          <img src={'./images/Asker.png'} title='Asker' height="30" style={{ marginRight: '10px' }} />
          <div id='queryContext' className='conversationQuery'>Template Content</div>
        </div>
        <div id='historyQueryPosttime' className='conversationPostTime'>Template Time</div>
        <div id='historyAnswer' className='conversation'>
          <img src={'./images/Answer.png'} title='Answer' height="30" style={{ marginRight: '10px', display: 'inline-flex' }} />
          <div className='answerContextBG' style={{ zIndex: '2' }}>
            <div id='answerContext' className='answerContextFG'>
              <div className='answerTitleContainer'>
              <img className='copyBtn' id='btnCopy' src={'./images/copy.png'} height='20px' width='20px' style={{marginLeft: '600px', marginRight: '0px'}}/>
                <p id='responsecontext'>Template Content</p>
              </div>
              <div id='sourcesTitle' className='sourceTitle'>Response Sources:</div>
            </div>
          </div>
        </div>
        <div id='historyAnswerPosttime' className='conversationPostTime'>Template Time</div>
        <div id='sourceTemplate' className='responseSource'></div>
      </div>
    </div>
  );
};

export default IndexQuery;
