# 🎬 Netflix Clone Demo Site (WSD-Assignment-02)

React.js와 TypeScript를 활용하여 **Netflix**와 유사한 UI/UX를 제공하는 Single Page Application(SPA)입니다.
TMDB API를 연동하여 실시간 영화 정보를 제공하며, Git Flow 전략을 준수하여 체계적으로 개발되었습니다.

## 📝 프로젝트 정보
* **과제명**: WSD-Assignment-02 (Front-End Demo Site)
* **개발 기간**: 2025.12.06 ~ 2025.12.16
* **개발자**: 202012190 박민호
* **배포 URL**: https://MiLLku.github.io/project2122

## 🛠 Tech Stack (기술 스택)

| 분류 | 기술 | 비고 |
| :--- | :--- | :--- |
| **Framework** | ![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat&logo=typescript&logoColor=white) | Vite 기반 빌드 |
| **Routing** | React Router DOM (v7) | SPA 페이지 라우팅 (HashRouter) |
| **Styling** | Styled-Components | CSS-in-JS 스타일링 |
| **Animation** | Framer Motion | 페이지 전환 및 UI 인터랙션 |
| **Data Fetching** | Axios | TMDB REST API 비동기 통신 |
| **Deployment** | GitHub Pages | 정적 웹사이트 호스팅 |

## 📂 Project Structure (폴더 구조)

```bash
src/
├── api/             # Axios 설정(axios.ts) 및 API 요청 URL(requests.ts)
├── assets/          # 정적 리소스 (이미지, 아이콘 등)
├── components/      # 재사용 가능한 UI 컴포넌트
│   ├── Banner.tsx   # 메인 화면 대형 배너
│   ├── Header.tsx   # 네비게이션 헤더 (스크롤 애니메이션)
│   └── Row.tsx      # 영화 목록 슬라이더 (가로 스크롤)
├── hooks/           # Custom Hooks
│   ├── useFetch.ts     # 데이터 패칭 로직 재사용
│   └── useWishlist.ts  # 찜하기 기능 (LocalStorage 연동)
├── pages/           # 라우터 페이지 (Home, SignIn, Search, Popular, Wishlist)
├── types/           # TypeScript 인터페이스 정의 (API 응답 타입)
├── utils/           # 유틸리티 함수 (로그인/회원가입 로직 등)
├── App.tsx          # 라우팅 및 전역 스타일 설정
└── main.tsx         # 앱 진입점

Installation & Execution (설치 및 실행 가이드)

Bash 또는 Terminal -> cmd환경에서

npm install

이후

npm run dev