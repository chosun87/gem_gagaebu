# 가계부 (gem_gagaebu) 구현 계획

Vite와 React를 사용하여 가계부 애플리케이션을 초기화하고, PrimeReact를 UI 컴포넌트로, Google 스프레드시트를 백엔드 데이터 저장소로 활용합니다.

## 1. 프로젝트 초기화 및 환경 설정
- **개발 환경**: `c:\01_Projects\gem_gagaebu` 경로에 Vite를 사용하여 프로젝트 설정 (`npx create-vite@latest ./ --template react`)
- **필수 라이브러리**: `primereact` (최신 버전), `primeicons`, `sass`, `@react-oauth/google`
- **개발 도구**: `eslint`, `prettier`

## 2. 디자인 및 UI 구성 요소
- **기본 폰트**: `Pretendard Variable` 전역 적용, 기본 폰트 사이즈 `14px`.
- **기본 스타일**: `body { padding: 2rem; background-color: white; }`
- **컴포넌트 스타일링**: `border-radius: 0` 설정 및 그림자(`box-shadow`) 제거를 위해 PrimeReact 테마를 CSS나 커스텀 테마로 오버라이드.
- **제약 사항**: Toast 메세지 창은 사용하지 않음.

## 3. 화면 및 기능 구성
- **헤더**: 화면 좌측 상단에 'gem_gagaebu' 타이틀 표시.
- **새로고침 버튼**: 타이틀 옆에 아이콘 버튼(`pi pi-refresh`)을 배치, 클릭 시 시트의 최신 데이터를 다시 불러와 화면 테이블에 반영.
- **구글 로그인**: 접속 시 권한(OAuth 2.0 클라이언트 ID)을 얻는 버튼 노출 및 로그인 후 액세스 토큰 보관. 화면 새로고침(F5) 시 재로그인을 묻지 않도록 `localStorage`에 토큰을 저장하여 세션 유지.
- **데이터 테이블 조회**: 
  - 최근 연도 시트를 가장 먼저(기본으로) 불러와서 PrimeReact `DataTable`에 보여줍니다. 
  - Google Spreadsheet 데이터의 **첫 번째 행은 헤더라고 간주**하여 데이터 맵핑 시 활용합니다.
- **데이터 입력 기능**:
  - 화면 상단 또는 우측 등에 입력을 위한 Form 영역을 구성합니다.
  - 사용자가 **수입/지출/이체** 중 하나를 선택하고 필수 항목(자산계좌, 분류코드, 금액, 내용 등)을 입력하여 "추가" 버튼을 누르면 구글 시트에 행이 추가되도록 기능을 개발합니다.

## 4. 구글 시트 (Google Sheets) 연동 관리
- `src/services/googleSheets.js` 파일을 통하여 `fetch()` API 기반의 REST 통신 함수 구현 (Google Cloud OAuth Access Token 헤더 삽입).
- *데이터 읽기*: 지정한 구글 스프레드시트 내 연도별 시트 및 기초 정보 시트(자산, 코드)를 읽어옵니다.
- *데이터 쓰기(추가)*: 사용자가 화면에서 입력한 수입/지출/이체 내역을 스프레드시트 행(append)으로 전송합니다.

## Verification Plan
- **입력/조회 검증**: 가계부 내역(수입, 지출)을 새로 추가한 뒤 "새로고침"을 눌렀을 때 DataTable에 방금 추가한 데이터가 노출되는지 확인.
- **UI 검증**: 요구사항에 맞는 스타일(그림자 X, border-radius 0)이 `DataTable` 및 추가용 `Input`, `Dropdown`, `Button` 요소에 맞게 적용되었는지 확인.
- **인증 검증**: 페이지 새로고침 시 이전에 로그인했던 정보가 유지되어 즉시 데이터를 불러올 수 있는지 확인.
