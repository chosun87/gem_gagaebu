## Implementation Guide
* 항상 한글, 한국어로 응답해야 함.

### 1. 개발 개요
* 가계부 프로그램을 만들려고 함.
* 웹 브라우저와 모바일 브라우저에서 모두 가능하도록 반응형을 지원해야 함.

### 2. 기본 환경
  * 개발 환경 : vite + react
  * UI framework : primereact 최신 버전
  * 폰트 pretendard variables
  * Icon : primeicons
  * 추가할 package (dependencies)
    - primeflex
    - sass
    - gapi-script
    - FullCalendar : @fullcalendar/react, @fullcalendar/core, @fullcalendar/daygrid
    - sortablejs
  * 추가할 package (devDependencies)
    - eslint
    - prettier

### 3. 개발할 내용 - 1단계 : 화면 구성
1) 스타일링
  * primeReact의 테마는 기본 테마를 적용(https://primereact.org/colors/를 참고해서 primary 컬러를 적용)
  * 테마 : /themes/lara-light-cyan/theme.css
  * primereact의 Ripple 적용
  * 모든 색은 *.scss 파일에 class로 정의해서 적용할 것.
  * (중요) css 추가하지 말 것. 기본 primereact css만 적용할 것.
  * toast 사용 안함.
  * Footer에는 가계부, 통계, 자산, 설정 메뉴 있음.
  * <Component명> 으로 작성한 것은 primereact 컴포넌트를 적용할 것.
  * <button ...> 대신 <Button ...> 사용할 것.
  * 모든 금액은 right-align이고, 천단위 쉼표 포맷.
  * 기본 locale은 'ko'
2) 소스 분리
  * 각 메뉴는 별개의 jsx 파일로 만들 것.
  * css, scss 파일은 /src/assets/css 디렉토리 밑에 둠.
3) 가계부 메뉴 화면
  - 상단에 <TabView> UI : 달력 / 목록
  - Floating Button (원형)
    - 화면 오른쪽 하단, Footer 바로 위에 위치
    - 클릭하면 <Dialog> 위에 '가계부 입력폼'가 보임.
  - 달력 <TabPanel> 화면
    - 오늘자 달력(<FullCalendar>)이 보이고, 각 날짜별로 '내용'을 보여줌
    - '내용'
      - 날짜별 총수입액(Blue), 총지출액(Red), 총이체액(Green) (색으로 구분. 색은 추후 변경 가능)
      - 집행이 안된 건(집행=false)이 있으면 해당 날짜(숫자) 옆에 빨간색 '*' 마킹을 함.
    - 각 날짜를 클릭하면 <Sidebar position="bottom">가 나타나고, 해당 일자의 '목록'이 보여짐.
      - '목록'은 아래 목록 Tab의 화면 구성, 기능과 동일하되 해당 날짜의 데이터만 보여짐.
  - 목록 <TabPanel> 화면
    - 이번달 수입액, 지출액, 이체액 목록 화면.
    - <DataView>로 구현.
    - 각 줄 맨 앞에 <Checkbox>가 있고, 이 <Checkbox>로 집행 항목을 true/false 입력할 수 있음.
    - 각 줄 맨 뒤에 금액 출력.
4) 통계
  - 빈화면. 화면 내용은 다음 단계에서.
5) 자산
  - 빈화면. 화면 내용은 다음 단계에서.
6) 설정 메뉴
  - 클릭 시, aside 메뉴 화면 오른쪽에서 왼쪽으로 펼쳐짐.
  - <Sidebar position="right"> 사용.
  - 화면 내용은 다음 단계에서
7) 가계부 입력 폼 화면
  - <Dialog> footer : 닫기, 저장(primary), 삭제(secondar) 버튼
  - 입력 폼은 추후 '개발할 내용 - 3단계'에서 구성

### 4. 개발할 내용 - 2단계 : 데이터 저장소
* 저장소 : google sheet (https://docs.google.com/spreadsheets/d/1LsFDmpmPaPCPXPBl1FS8CXx56UqGE0WQ5eFccwYeWcE/edit?gid=0#gid=0)
  - 단, localhost에서 구글 sheet에 접근하려고 함.
  - 화면 reload시에 구글 로그인을 다시 하지 말 것.
  - google cloude OAuth 2.0
    - 클라이언트 ID : 660525556283-dtpdooehas3u161nsstn2l4hufvndhpr.apps.googleusercontent.com
    - 클라이언트 보안 비밀번호 : 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
* 구글 스프레드시트 파일에는 아래와 같은 시트가 있음
    - 자산 시트 : accType / accCode / accLabel / accIcon / accRank / accMemo
    - 코드 시트 : codeGroup / code / codeLabel / codeIcon / codeRank / codeMemo
    - 연도 시트 : 연도별로 수입/지출/이체 내역 시트 생성. 시트명은 연도 숫자 4자리.
* 연도 시트 입력항목
    - 집행(gExcuted), 구분(gType : 수입/지출/이체), 날짜(gDate)
    - 수입일때 : 자산(gAcc1) / 분류(gCategory : 수입 분류 코드) / 금액(gAmount) / 내용(gMemo)
    - 지출일때 : 자산(gAcc1) / 분류(gCategory : 지출 분류 코드) / 금액(gAmount) / 내용(gMemo)
    - 이체일때 : 출금(gAcc1) / 입금(gAcc2) / 금액(gAmount) / 내용(gMemo)
