// src/styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #141414; /* 넷플릭스 배경색 */
    color: #e5e5e5;            /* 기본 텍스트 색상 */
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    overflow-x: hidden; /* 가로 스크롤 방지 */
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* 스크롤바 커스텀 (선택사항) */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: #555; 
    border-radius: 4px;
  }
  ::-webkit-scrollbar-track {
    background: #141414; 
  }
`;