import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import Button from 'react-bootstrap/Button';

/**
 * Renders a button for logging in with a redirect
 * Note the [useMsal] package 
 */

export const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.log(e);
    });
  };

  return (
    <div className='loginPanelSignInButton'>
      <div className='loginPanelSignInButtonBG' onClick={handleLogin}>
        <svg xmlns="http://www.w3.org/2000/svg" width="124" height="76" viewBox="0 0 124 76" fill="none">
          <g filter="url(#filter0_d_3401_1468)">
            <path d="M98 14H26C21.5817 14 18 17.5817 18 22V46C18 50.4183 21.5817 54 26 54H98C102.418 54 106 50.4183 106 46V22C106 17.5817 102.418 14 98 14Z" fill="url(#paint0_linear_3401_1468)"/>
          </g>
          <defs>
            <filter id="filter0_d_3401_1468" x="0" y="0" width="124" height="76" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="4"/>
              <feGaussianBlur stdDeviation="9"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3401_1468"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3401_1468" result="shape"/>
            </filter>
            <linearGradient id="paint0_linear_3401_1468" x1="20.6399" y1="24.7997" x2="50.9447" y2="73.1373" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5856D7"/>
              <stop offset="0.526042" stopColor="#4E29E3"/>
              <stop offset="1" stopColor="#275BE2"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className='loginPanelSignInButtonText' onClick={handleLogin}>Sign In</div>
    </div>
  );
};
