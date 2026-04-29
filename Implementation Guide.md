# Implementation Guide
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
    - (미사용) reset-css
    - react-router-dom
    - @react-oauth/google
    - FullCalendar : @fullcalendar/react, @fullcalendar/core, @fullcalendar/daygrid
    - sortablejs
  * 추가할 package (devDependencies)
    - eslint
    - prettier
  * vite.config.js
    - 아래와 같이 설정할 것.
```
...
import path from "path";

export default defineConfig({
  ...
  server: {
    port: 3000, // 원하는 포트 번호
    open: true  // 서버 실행 시 브라우저 자동 열기 (선택 사항)
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src")
      },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "src/components")
      },
    ],
  },
  ...
})
```
  * 스타일링
    - 모든 스타일은 *.scss 파일에 class로 정의해서 적용할 것.
    - css, scss 파일은 @/assets/css 디렉토리 밑에 둠.
    - @/assets/style 디렉토리의 모든 파일은 @/assets/css로 옮길 것.
    - @/assets/css/all.scss에 모든 scss 파일을 @use로 import 할 것.
    - @/assets/css에 아래와 같은 scss 파일들을 만들 것.
      - _variables.scss : 변수 정의용 파일
      - _custom.scss : import한 패키지(primereact 같은)의 style을 재정의하는 파일
      - _global.scss : 컬러, 폰트 관련 style 정의
      - _layout.scss : 화면 구성 관련 style 정의
      - _common.scss : 공통으로 사용하는 style 정의
    - primeReact의 테마는 기본 테마를 적용(https://primereact.org/colors/를 참고해서 primary 컬러를 적용)
    - 테마 : /themes/lara-light-cyan/theme.css
    - Ripple 적용 (https://primereact.org/ripple/ 참고)
    - (중요) css 추가하지 말 것. 기본 primereact css만 적용할 것.
    - toast 사용 안함.
  * PrimeReact.js
    - 아래와 같이 js파일을 만들고, 모든 jsx 파일에서는 PrimeReact.js를 import 해서 사용할 것.
    - 사용되는 primereact 컴포넌트는 모두 이 파일에 import 해서 사용할 것.
```
// components/PrimeReact.js
export { Button } from 'primereact/button';
export { InputText } from 'primereact/inputtext';
export { Calendar } from 'primereact/calendar';
...
```
  * Font Size
    - PrimeFlex > Typography > Font Size 참고해서,
    - text-xs : 0.75rem
    - text-base : 1rem
    - text-lg : 1.25rem : Calendar header, List Day header
    - text-xl : 1.5rem
    - text-2xl : 2rem : h3.dialog-title
    - text-3xl : 3rem : h2.app-page-title
    - text-4xl : 4rem : h1.app-header-title

### 3. 개발할 내용 - 1단계 : 화면 구성
1) 공통
  * 기본 locale은 'ko'
  * 화면은 Header, Content, Footer로 구성.
    - HTML Semantics tag인 <header class="app-header">, <main class="app-content">, <footer class="app-footer">를 사용할 것.
    - header.jsx, footer.jsx는 별도의 컴포넌트로 만들 것.
    - App.jsx에서 아래와 같이 import 해서 사용할 것.
```
import Header from './components/Header';
import Footer from './components/Footer';
```
  * <Component명>으로 작성한 것은 최우선적으로 primereact의 컴포넌트를 적용할 것.
    - 즉, <button ...> 대신 <Button ...> 사용할 것.

  * Header
    - 앱 타이틀 : 가계부
    - 오른쪽에는 로그인 <Button>, Reload <Button>이 있음.

  * Footer에는 가계부, 통계, 자산, 설정 메뉴 있음.
    - <TabMenu> 사용

  * 모든 금액은 right-align이고, 천단위 쉼표 포맷.
2) 소스 분리
  * 각 메뉴 클릭시 랜딩페이지는 별개의 jsx 파일로 만들 것.
  * 가계부 : Calendar.jsx, List.jsx
  * 통계 : Statistics.jsx
  * 자산 : Assets.jsx
  * 설정 : Settings.jsx
  * 가계부~자산 메뉴를 클릭하면 App.js의 <main class="app-content"> 안에 해당 메뉴의 랜딩페이지를 렌더링 할 것.
  * 설정 메뉴를 클릭하면 <Sidebar position="right"> 사용해서, 메뉴 화면 오른쪽에서 왼쪽으로 펼쳐짐.

  * List.jsx 참고해서 Repeat.jsx 페이지 추가. 상단에 월 선택 기능은 불필요.

3) 가계부 메뉴 화면
  - 상단에 <TabView> UI : 달력 / 목록
  - Floating Button (원형)
    - 화면 오른쪽 하단, Footer 바로 위에 위치
    - 클릭하면 <Dialog> 위에 '가계부 입력폼'가 보임.
  - 달력 <TabPanel> 화면
    - 오늘자 달력(<FullCalendar>)이 보이고, 각 날짜별로 '내용'을 보여줌
    - '내용'
      - 날짜별 총수입액(Blue), 총지출액(Red), 총이체액(Green) (색으로 구분. 색은 추후 변경 가능)
      - 실행이 안된 건(실행=false)이 있으면 해당 날짜(숫자) 옆에 빨간색 '*' 마킹을 함.
    - 각 날짜를 클릭하면 <Sidebar position="bottom">가 나타나고, 해당 일자의 '목록'이 보여짐.
      - '목록'은 아래 목록 Tab의 화면 구성, 기능과 동일하되 해당 날짜의 데이터만 보여짐.
  - 목록 <TabPanel> 화면
    - 이번달 수입액, 지출액, 이체액 목록 화면.
    - <DataView>로 구현.
    - 각 줄 맨 앞에 <Checkbox>가 있고, 이 <Checkbox>로 실행 항목을 true/false 입력할 수 있음.
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
    - Header의 로그인 버튼 클릭 시, 구글 로그인 화면이 나타나고, 로그인 성공 시 구글 시트에 접근할 수 있도록 할 것.
* 구글 스프레드시트 파일에는 아래와 같은 시트가 있음
    - 자산 시트 : accType / accCode / accLabel / accIcon / accRank / accMemo
    - 코드 시트 : codeGroup / code / codeLabel / codeIcon / codeRank / codeMemo
    - 연도 시트 : 연도별로 수입/지출/이체 내역 시트 생성. 시트명은 연도 숫자 4자리.
* 연도 시트 항목
    - 실행(gExecuted), 구분(gType : 수입/지출/이체), 날짜(gDate)
    - 수입일때 : 자산(gAcc1) / 분류(gCategory : 수입 분류 코드) / 금액(gAmount) / 내용(gMemo)
    - 지출일때 : 자산(gAcc1) / 분류(gCategory : 지출 분류 코드) / 금액(gAmount) / 내용(gMemo)
    - 이체일때 : 출금(gAcc1) / 입금(gAcc2) / 금액(gAmount) / 내용(gMemo)

* List.jsx 보면 각 페이지별로 로그인 체크하는 로직이 있음. 이 로직을 공통으로 사용할 수 있도록 만들 것.
* List.jsx, Calendar.jsx, Statistics.jsx, Assets.jsx 화면 이동할떄마다 연도 시트를 읽어와야 함.
* 전역적으로 연도 시트를 읽어와서 각 화면 컴포넌트에서 사용할 수 있도록 할 것. 이를 List.jsx에 우선 적용.
* 연도 시트가 여러개 있을 수 있음. 예를 들어, 2025, 2026, 2027 등등.
* yearData를 연도별로 배열로 만들 것. 예를 들어, sheetYYYYData['2026'] = 2026년 시트 데이터.
* 읽어온 연도 시트 데이터를 다시 읽지 않도록 loadedSheetYYYY 배열을 만들 것. (초기값 : false)
* 연도 시트 데이터를 읽어오면, 해당 연도의 loadedSheetYYYY 배열의 값을 true로 변경할 것. 예를 들어, loadedSheetYYYY['2026'] = true
* 시트 데이터에 변경이 있으면 해당 연도의 loadedSheetYYYY 배열의 값을 false로 변경할 것. 예를 들어, loadedSheetYYYY['2026'] = false

* 가계부 메뉴 화면
   - Floating Button (원형)
    - 화면 오른쪽 하단, Footer 바로 위에 위치
    - 클릭하면 <Dialog> 위에 '가계부 입력폼'가 보임.

* 테마 페이지
  - Header의 테마 버튼 클릭 시, <Sidebar position="right"> 사용해서, 메뉴 화면 오른쪽에서 왼쪽으로 펼쳐짐.
  - 화면 내용은 https://primereact.org/theming/을 참고해서 구현.
  - 특히, Built-in Themes 섹션의 Configurator를 참고해서 동일하게 구현.
  - 한글화 적용.
  - 변경한 테마는 로컬 스토리지에 저장해서, 화면 reload 시에도 동일한 테마가 적용되도록 할 것.
  - Scale, Input Style, Repple Effect, Dark Mode 기능도 동일하게 구현.
  - Theme 선택기는 TreeSelect을 이용할 것.
    - Group을 Root로 하되 선택은 불가하게. 펼쳐지는 것만 가능.
    - Group에는 아이콘 왼쪽에 보이도록. 아이콘은 https://primereact.org/theming/ 의 Configurator 화면과 동일하게
    - Template을 이용해서 각 테마별로 색상을 보여줄 것.

* DialogLedger.jsx에서 저장 버튼을 누르면 google sheet에 저장하는 기능을 추가
  - 기존값(ledger = null)이면 신규 입력
    - 날짜(gDate)를 기준으로 해당 연도의 시트에 ledger값으로 행 추가.
    - 해당 연도의 시트가 없을때는 시트 추가 후 1번째 줄에 헤더 추가.
      - 해더는 constants.js의  
  - 기존값(ledger != null)이면 수정
    - 날짜(gDate)를 기준으로 해당 연도의 시트에 행 수정.
    - 연도가 변경되었으면, 기존 연도의 시트에서 행 삭제 마킹(gDeleted=Date.now()) 후, 신규 연도의 시트에 ledger값으로 행 추가.
      - 기존 sheet명은 ledger.sheetName, 기존 행번호는 ledger.sheetRowNo로 식별.
      - 바뀐 시트명, 행번호를 ledger.sheetName, ledger.sheetRowNo에 업데이트.
    - 연도가 변경되지 않았으면, 기존 sheet명(ledger.sheetName), 기존 행번호(ledger.sheetRowNo)로 위치를 찾아 변경된 ledger값을 시트에 업데이트.

* 자산 선택기
  - TreeSelect로 구현.
  - option은 자산 sheet에서 읽어옴.
    - accType으로 grouping
    - value는 accCode
    - label은 accLabel
    - 보여지는 순서는 accType + accOrder로 정렬.
    - accDefault=TRUE인 옵션을 default로 선택되게 함.

* 반복 시트 저장
  - DialogRepeat.jsx에서 저장 버튼을 누르면 google sheet에 저장하는 기능을 추가
  - 기존값(repeat = null)이면 신규 입력
    - '반복' 시트에 repeat값으로 행 추가.
    - rpID=Date.now()로 설정.
  - 기존값(repeat != null)이면 수정
    - '반복' 시트에 기존 행번호(repeat.sheetRowNo)로 위치를 찾아 변경된 repeat값을 시트에 업데이트.

  - 반복 저장 시에, 연도 시트에 기간, 반복 주기에 따라 발생한 날짜에 해당하는  연도 시트에ledger 객체를 행 추가.(rpID로 식별)
    - rpPeriod가 "월"일때 : rpDay에 해당되는 날짜에 반복금액 저장.
    - rpPeriod가 "주"일때 : rpDay에 해당되는 요일에 반복금액 저장.
    - 추가하는 행의 g_rpID에 rpID값을 넣음.
    - 같은 날짜에 g_rpID값이 rpID이고 gExecuted=true인 ledger 객체가 해당 연도 시트에 이미 있으면, 지나가기.
    - 같은 날짜에 g_rpID값이 rpID이고 gExecuted=false인 ledger 객체가 해당 연도 시트에 이미 있으면, 덮어쓰기
    - 기간 밖의 ledger 객체 중에 g_rpID값이 rpID이고 gExecuted=false인 ledger 객체는 삭제 마킹 처리(gDeleted=Date.now()).
    
    - 해당하는 날짜의 연도 시트가 없을 경우 연도 시트 생성
    - 완료 후 몇개의 행을 추가했는지, 몇개의 행을 덮어 썼는지 알럿창.
    - 아직 실행이 안된 ledger



반복 내역 저장 시 설정된 기간과 주기에 맞춰 연도별 가계부 시트(YYYY)에 내역을 자동으로 생성하는 기능을 구현했습니다.

* 주요 구현 내용
1. 가계부 내역 자동 생성 로직 (generateLedgerFromRepeat):
    - 기간 계산: 시작일(rpDateS)부터 종료일(rpDateE) 사이의 모든 발생 일자를 계산합니다.
    - 주기 대응: '매월(M)'일 경우 해당 날짜에, '매주(W)'일 경우 해당 요일에 맞춰 생성합니다.
    - 중복 방지: 각 날짜에 동일한 rpID를 가진 내역이 이미 시트에 존재할 경우 중복 생성을 건너뜁니다.
    - 시트 자동 생성: 해당 연도의 시트가 존재하지 않을 경우, 자동으로 시트를 생성하고 헤더를 추가합니다.
    - 실행 상태 자동 설정: 생성 시점 기준으로 오늘 포함 과거 날짜는 gExecuted=true, 미래 날짜는 false로 설정합니다.

    * 이미 실행된 경우 (gExecuted=true):
        - 사용자가 이미 실제 지출/수입으로 확정한 내역이므로, 반복 내역이 수정되더라도 해당 데이터는 그대로 유지하고 건너뜁니다(지나가기).
    * 아직 실행 전인 경우 (gExecuted=false):
        - 반복 내역의 설정(금액, 자산, 분류 등)이 변경되었을 수 있으므로, 해당 행을 최신 정보로 덮어씁니다(업데이트).
    * 내역이 없는 경우:
        - 새로운 가계부 행을 **추가(신규 생성)**합니다.

2. 데이터 저장 연동:
    - saveRepeatEntry가 저장된 항목의 rpID를 반환하도록 수정하여 생성 로직과 연동했습니다.
    - DialogRepeat.jsx에서 저장이 완료되면 자동으로 generateLedgerFromRepeat를 호출합니다.
3. 사용자 피드백:
    - 작업 완료 후 **"N개의 내역이 신규 생성되고, M개의 기존 내역이 업데이트 되었습니다."**라는 알럿창을 통해 처리 결과를 알려줍니다.

이제 반복 내역을 한 번만 등록하면, 전체 기간에 대한 가계부 데이터가 자동으로 시트에 채워져 미래의 수입/지출 계획을 한눈에 파악하실 수 있습니다.



* DialogRepeat.jsx에, 자산 선택기 추가
  - List.jsx의 자산 선택기와 동일한 기능.
  - TreeSelect로 구현.
  - option은 자산 sheet에서 읽어옴.
    - accType으로 grouping
    - value는 accCode
    - label은 accLabel
    - 보여지는 순서는 accType + accOrder로 정렬.
    - accDefault=TRUE인 옵션을 default로 선택되게 함.

* DialogLedger.jsx에 필수 입력항목 처리
  - 필수 입력항목 : 날짜(gDate), gType, 금액(gAmount), 분류(gCategory), gAcc1, gAcc2(이체일때)
  - Label에 필수일떄 class="required"로 표시. css로 .required:after { content: "*"; color: red; }
  - 필수 입력항목이 입력되지 않았을때, 저장 버튼을 클릭하면, 해당 입력항목에 빨간색 테두리 표시.
  - 필수 입력항목이 모두 입력되었을때, 저장 버튼을 클릭하면, google sheet에 저장.

* DialogRepeat.jsx에 필수 입력항목 처리
  - 필수 입력항목 : 시작일(rpDateS), 반복주기(rpPeriod), 반복일(rpDay), rpType, 금액(rpAmount), 분류(rpCategory), rpAcc1, rpAcc2(이체일때)
  - Label에 필수일떄 class="required"로 표시. css로 .required:after { content: "*"; color: red; }
  - 필수 입력항목이 입력되지 않았을때, 저장 버튼을 클릭하면, 해당 입력항목에 빨간색 테두리 표시.
  - 필수 입력항목이 모두 입력되었을때, 저장 버튼을 클릭하면, google sheet에 저장.
  - 반복주기가 매월일때는 반복일을 1~31로 제한. Dropdown으로 구현. 반복주기가 매주일때는 반복일을 월~일로 제한. Dropdown으로 구현.

* 삭제 (DialogLedger.jsx, DialogRepeat.jsx)
  - 삭제 버튼을 클릭하면, ConfirmDialog를 띄워서 '삭제하시겠습니까?' 확인 후 삭제.
  - 확인 시에, 해당 행을 삭제 마킹(gDeleted=Date.now() 또는 rpDeleted=Date.now()) 후, google sheet에 저장.
  - 삭제 마킹된 행은 화면에 표시하지 않음.

* FullCalendar 적용
  - Calendar의 각 날짜 칸에 해당 일자의 총수입, 총지출, 총이체를 계산해서 templateDayCell()를 이용해서 출력
  - 총수입, 총지출, 총이체 계산에서 gExecuted=true인 행만 계산.
  - FullCalendar에 swipe로 전달, 다음달로 이동 기능 적용.

  * 코드 시트
  - cdGroup='지출' : gType='지출', rpType='지출'일떄 gCategory, rpCategory의 Dropdown option으로 사용  
  - cdGroup='이체' : gType='이체', rpType='이체'일떄 gCategory, rpCategory의 Dropdown option으로 사용  
  - cdGroup='수입' : gType='수입', rpType='수입'일떄 gCategory, rpCategory의 Dropdown option으로 사용  

모바일 환경일때,
1) 로그인 후 자동 전체화면 / 로그아웃 후 전체화면 해제
2) tooltip 안보이게


* DialogList.jsx 추가
  - DialogLedger.jsx처럼 Sidebar position="bottom"으로 구현.
  - 조회 조건에 날짜 등 파라미터로 넘겨 받는 조건 조회 가능. 파라미터는 객체 구조로 넘길 것. ex {date: '2026-04-26', type: '수입', accCode: 'A001', category: '식비'}
  - Sidebar header에 조회 조건 값 출력.
  - FullCalendar에서 날짜 셀을 클릭하면 이 창이 해당일자 조회 조건으로 열림.
  - 목록은 MonthlyList.jsx의 목록 기능을 그대로 사용.

* MonthlySummary.jsx 추가
  - 월간 수입, 지출, 이체의 총계(미실행건도 포함)를 보여주는 화면.
  - 화면 상단에 바 차트. (chartjs)
    - 최근 3개월간 수입, 지출, 이체 비교 차트
  - 화면 하단에 3개월간 수입, 지출, 이체 합계액
    - DataTable 컬럼에 수입, 지출, 이체 컬럼을 표시, 행은 연월



Repeat.jsx의 목록 클릭 시 팝업 메뉴가 나타나도록 수정하였고, 각 메뉴(편집, 목록)의 기능을 구현했습니다. 또한 이를 위해 DialogList.jsx와 공통 컴포넌트인 PrimeReact.js를 함께 업데이트했습니다.

* 주요 변경 사항
  1. PrimeReact.js 수정:
    * Menu 컴포넌트(popup 메뉴용)를 추가로 export 하도록 수정했습니다.

  2. Repeat.jsx 수정:
    * 팝업 메뉴 도입: 목록의 아이템을 클릭하면 바로 편집 창이 뜨는 대신 '편집', '목록' 메뉴가 포함된 팝업 메뉴가 나타납니다.
    * 편집 (Edit): 선택된 항목에 대해 기존처럼 DialogRepeat.jsx 다이얼로그를 엽니다.
    * 목록 (List): 선택된 반복 내역의 rpID를 조건으로 하여 DialogList.jsx를 엽니다.

  3. DialogList.jsx 수정:
    * 반복 ID 필터링 추가: params.rpID가 전달될 경우, 가계부 데이터의 g_rpID와 비교하여 필터링하는 로직을 추가했습니다.
    * 전체 연도 조회 지원: rpID 조건이 있을 때는 현재 선택된 연도뿐만 아니라 현재 로드되어 있는 모든 연도의 시트 데이터(sheetYYYYData)에서 해당 반복 내역을 찾아 통합해서 보여줍니다.
    * 헤더 텍스트 변경: 반복 내역 조회 시 상단 타이틀을 "연관 내역"으로 표시하도록 개선했습니다.

* 적용된 UI/UX
    * 반복 목록에서 항목 클릭 시 마우스/터치 위치에 편집/목록 메뉴 노출.
    * 목록 선택 시, 해당 반복 설정으로 인해 생성된 과거 및 미래의 모든 가계부 실행 내역을 한곳에서 모아볼 수 있습니다.



구글 인증 토큰의 남은 시간을 계산하여 로그아웃 버튼 상단에 실시간으로 표시되도록 구현했습니다.

* 수정 사항
  1. AuthContext.jsx 고도화:
    * authRemainingTime 상태를 추가하고, 1초마다 남은 시간을 업데이트하는 setInterval 로직을 구현했습니다.
    * 초 단위의 시간을 MM:SS 형식으로 변환하는 formatRemainingTime 함수를 추가하여 컨텍스트를 통해 제공합니다.
    * 남은 시간이 0이 되면 자동으로 알림을 띄우고 로그아웃을 수행하도록 통합했습니다.

  2. Header.jsx UI 개선:
    * 로그아웃 버튼을 position: relative인 컨테이너로 감싸고, 그 상단에 position: absolute를 이용해 남은 시간을 배치했습니다.
    * 가독성을 위해 모노스페이스 폰트와 작은 폰트 크기를 적용하여 버튼 디자인을 해치지 않으면서 정보를 제공합니다.

* 적용된 UI/UX
    * 이제 화면 우측 상단 로그아웃 버튼 위에서 토큰 만료까지 남은 시간을 실시간으로 확인할 수 있습니다. (예: 59:24)



구글 인증 토큰이 만료되었을 때 자동으로 로그아웃 처리가 되도록 AuthContext.jsx를 수정했습니다.

수정 사항
  1. 자동 로그아웃 타이머 추가:
    * 로그인이 성공하거나 앱이 초기화되어 isSignedIn 상태가 true가 되면, 로컬 스토리지에 저장된 토큰 만료 시간(gagaebu_token_expiry)을 확인합니다.
    * 현재 시간과의 차이를 계산하여 남은 시간만큼 setTimeout 타이머를 설정합니다.

  2. 만료 시 알림 및 처리:
    * 타이머가 만료되면 사용자에게 "인증 기간이 만료되어 자동으로 로그아웃 처리되었습니다."라는 알림창을 띄우고, 즉시 logout() 함수를 실행하여 토큰을 삭제하고 로그인 페이지로 유도합니다.
  
  3. 리소스 정리:
    * 컴포넌트가 언마운트되거나 로그인 상태가 변경될 때 기존 타이머를 clearTimeout으로 정리하여 메모리 누수를 방지했습니다.

* 적용된 UI/UX
    * 이제 토큰 만료 1분 전(또는 설정된 만료 시간)에 맞춰 자동으로 세션이 종료됩니다.



인증 만료 알림(alert)이 두 번 발생하는 문제를 해결하기 위해 AuthContext.jsx의 타이머 로직을 보완했습니다.

수정 사항
1. 타이머 즉시 해제:
    * 남은 시간이 0이 되는 순간 setInterval을 즉시 중단(clearInterval)하여, 사용자가 알림창을 닫기 전까지 타이머가 계속 작동하여 중복 알림을 발생시키는 것을 방지했습니다.

2. 로그아웃 상태 중복 체크:
    * 알림을 띄우기 직전에 로컬 스토리지의 토큰 존재 여부를 한 번 더 확인합니다. 이미 첫 번째 실행으로 인해 로그아웃 처리가 진행 중이거나 완료된 상태라면 두 번째 알림이 뜨지 않도록 처리했습니다.

3. 리소스 정리 보완:
    * useEffect의 clean-up 함수에서도 타이머가 존재할 때만 해제하도록 안전 코드를 추가했습니다.

* 적용된 UI/UX
    * 이제 인증 만료 시 알림창이 한 번만 정상적으로 표시됩니다.



인증 만료 3분 전에 사용자에게 연장 여부를 묻는 확인창(ConfirmDialog) 기능을 추가했습니다.

수정 사항
1. 3분 전 자동 알림 로직:
  * AuthContext.jsx의 타이머 로직에서 남은 시간이 정확히 **180초(3분)**가 되는 순간을 감지합니다.
  * 중복 알림을 방지하기 위해 extensionPromptShown 상태값을 사용하여 한 세션에 한 번만 알림이 뜨도록 제어했습니다.

2. ConfirmDialog 통합:
  * PrimeReact의 confirmDialog를 사용하여 "인증 만료 3분 전입니다. 로그인을 연장하시겠습니까?"라는 메시지를 표시합니다.
  * 연장하기를 누르면 즉시 extendLogin()이 호출되어 세션이 1시간 더 연장됩니다.

3.상태 초기화:
  * 로그인을 연장하여 토큰이 갱신되거나, 로그아웃될 때 알림 상태를 초기화하여 다음 만료 시점에도 정상적으로 작동하도록 했습니다.

이제 별도의 조작 없이도 만료 3분 전에 시스템이 먼저 연장 의사를 물어보므로 더욱 편리하게 가계부를 이용하실 수 있습니다.



주요 변경 사항

1. 컨텍스트 분리 (AuthContext.jsx):
    * 인증 상태(isSignedIn 등)와 안정적인 함수들을 제공하는 AuthContext와, 매초 변하는 시간만 관리하는 AuthTimerContext로 분리했습니다.
    * AuthContext의 값은 useMemo를 사용하여 인증 상태가 변할 때만 업데이트되도록 최적화했습니다.

2. 구독 컴포넌트 최소화:
    * 시간 표시가 필요한 Header.jsx만 useAuthTimer()를 사용하여 1초마다 리렌더링되도록 했습니다.
    * App.jsx나 Calendar.jsx 등의 다른 컴포넌트들은 이제 더 이상 타이머 때문에 매초 리렌더링되지 않습니다.



MonthlySummary.jsx에서 여러 연도에 걸쳐 있는 데이터(예: 작년 11월 ~ 올해 4월)를 조회할 때, 기존에는 현재 선택된 연도의 데이터(yearData)만 가져와서 이전 연도의 데이터가 누락되는 문제가 있었습니다.

해당 문제를 해결하기 위해 아래와 같이 MonthlySummary.jsx를 수정했습니다:

1. 필요한 연도 계산 로직 추가: 조회할 기간(monthLength)에 포함되는 연도들을 모두 찾아냅니다 (requiredYears).
2. 누락된 데이터 Fetch: 파악된 requiredYears 중 아직 로드되지 않은 연도 데이터가 있다면 useEffect를 통해 자동으로 loadSheet연도Data를 호출하여 데이터를 가져옵니다.
3. 데이터 통합: 단일 yearData 대신 전체 데이터가 모여있는 sheetYYYYData에서 필요한 연도별 데이터를 추출하여 하나의 배열(allData)로 합친 후 차트 및 표에 반영하도록 가공 로직을 개선했습니다.

이제 연도가 넘어가더라도 이전 연도의 데이터가 정상적으로 가져와져서 통계에 함께 계산될 것입니다. 코드는 이미 적용 완료되었습니다! 확인해 보시고 다른 문제가 있다면 말씀해 주세요.



AI 입력화면

* InputTextarea 컴포넌트를 사용하기 위해 PrimeReact.js 모듈 설정에 해당 항목을 추가했습니다.

* DialogAI.jsx라는 새로운 컴포넌트를 생성하여, 화면 하단에서 올라오는 Sidebar(position="bottom") 형태로 구성했습니다.

* 은행 결제 문자나 영수증 텍스트를 붙여넣을 수 있는 넓은 텍스트 에어리어(InputTextarea) 영역을 만들었습니다.

* 메인 월간 목록 화면(MonthlyList.jsx)의 하단 플로팅 버튼(SpeedDial)과 조건 검색 화면(DialogList.jsx)의 "AI로 입력" 버튼을 클릭하면 준비 중이라는 알림 대신 이 새로운 화면이 열리도록 연결해 두었습니다.

* 아직 실제 AI 분석 로직은 백엔드/API 연동이 필요하므로 "분석" 버튼 클릭 시 임시 로딩 후 알림창이 뜨도록 처리해 둔 상태입니다. 확인해 보시고 텍스트 에어리어 크기나 문구 등 수정이 필요한 부분이 있다면 편하게 말씀해 주세요!



* Routing URL
  1. 가계부 : /gem_gagaebu/ledger
    - 기본. /gem_gagaebu/ledger/calendar로 이동됨.

    1.1. 달력 : /gem_gagaebu/ledger/calendar(/${yearMonth})
      - 기본 : 금월로 이동됨. 월을 파라미터로 전달받아 변경 가능
      - 예 : /gem_gagaebu/ledger/calendar/202604

      1.1.1. 달력 일자 조회 : /gem_gagaebu/ledger/calendar

    1.2. 목록 : /gem_gagaebu/ledger/monthlyList(/${yearMonth})
      - 기본 : 금월로 이동됨. 월을 파라미터로 전달받아 변경 가능
      - 예 : /gem_gagaebu/ledger/monthlyList/202604

    1.3. 그래프 : /gem_gagaebu/ledger/monthlySummary(/${yearMonth})(/${months})
      - 기본 : 금월. months 기본값은 3
      - 예: /gem_gagaebu/ledger/monthlySummary/202405 또는 /gem_gagaebu/ledger/monthlySummary/202405/6

    1.4. 조건 : /gem_gagaebu/ledger/condition(/${year})(/${month})(/${category})
      - 예: /gem_gagaebu/ledger/condition/2024/5/식비

* Routing URL
  2. 통계 : /gem_gagaebu/statistics

  3. 자산 : /gem_gagaebu/asset

  4. 설정 : /gem_gagaebu/settings

  5. login : /gem_gagaebu/login

  6. logout : /gem_gagaebu/logout

  7. 테마 : /gem_gagaebu/theme



react-router-dom을 적용하여 애플리케이션의 라우팅 구조 개편을 완료했습니다! 🎉

1. App.jsx 전면 개편 (메뉴 라우팅)
  * 기존의 activeIndex 상태 기반 화면 전환을 제거하고 <Routes>와 <Route> 기반으로 변경했습니다.
  * /gem_gagaebu/ledger, /gem_gagaebu/statistics, /gem_gagaebu/asset 경로로 이동 시 해당 컴포넌트가 렌더링되도록 연결했습니다.
  * 하단 탭바(Footer) 클릭 시 navigate() 함수를 통해 URL이 변경되며, 현재 URL 주소를 감지해 활성화(Active) 상태를 유지하도록 구성했습니다.
  * /gem_gagaebu/logout 접근 시 즉시 로그아웃 처리 후 /gem_gagaebu/login으로 리다이렉트되도록 추가했습니다.
  * 설정(/gem_gagaebu/settings)과 테마(/gem_gagaebu/theme) 경로는 다이얼로그(팝업) 형태로 구현되어 있으므로, 메인 배경은 유지한 채 팝업만 열리도록 처리했습니다. (팝업을 닫으면 이전 URL로 돌아갑니다.)

2. Ledger.jsx 개편 (서브 라우팅)
  * 가계부 내 서브 메뉴(달력, 목록, 그래프, 반복)의 탭 전환을 URL 기반으로 변경했습니다.
  * calendar, list, monthlySummary, repeat 경로에 따라 자동으로 알맞은 탭을 열어줍니다. 탭을 클릭해도 URL이 즉시 갱신됩니다.
  * (예: /gem_gagaebu/ledger/list 에 접근하면 "목록" 탭이 선택된 상태로 나타납니다.)



주요 페이지 컴포넌트들에 대해 **다이나믹 로딩(Dynamic Loading / Lazy Loading)**을 적용했습니다. 이를 통해 초기 로딩 시 모든 코드를 한꺼번에 불러오지 않고, 사용자가 해당 메뉴에 접근할 때 필요한 코드만 나누어 로드하게 되어 초기 구동 속도가 개선됩니다.

1. App.jsx (메인 페이지):

  * Ledger, Statistics, Assets 컴포넌트를 React.lazy를 사용하여 필요 시점에 로드하도록 변경했습니다.
  * 전체 라우트 영역을 <Suspense>로 감싸고, 로딩 중에는 중앙에 큰 스피너(PageLoading)가 표시되도록 했습니다.

2. Ledger.jsx (가계부 내부 탭):
  * 가계부 내의 각 탭(Calendar, MonthlyList, MonthlySummary, Repeat) 역시 개별적으로 다이나믹 로딩되도록 설정했습니다.
  * 각 탭의 내용 영역에 개별적인 <Suspense>를 적용하여, 탭 전환 시 코드 로딩이 필요한 경우 해당 영역 내에서만 작은 스피너(TabLoading)가 표시됩니다. (탭 헤더 등 UI는 그대로 유지되어 사용자 경험이 더 부드러워집니다.)

3. DialogTheme와 DialogSettings 같은 다이얼로그 컴포넌트들도 React.lazy를 사용하여 다이나믹 로딩을 적용했습니다.
  * DialogTheme, DialogSettings 지연 로딩: 이제 앱이 처음 켜질 때 이 컴포넌트들을 미리 로드하지 않고, 사용자가 실제 메뉴를 클릭하여 다이얼로그가 필요한 시점에 코드를 불러옵니다.
  * <Suspense> 적용: 다이얼로그가 로드되는 짧은 순간 동안 화면 깨짐이 없도록 fallback={null} 옵션과 함께 <Suspense>로 감싸주었습니다.

이제 각 페이지와 탭이 코드를 분할(Code Splitting)하여 관리하게 되었습니다.



달력(Calendar.jsx), 목록(MonthlyList.jsx), 그래프(MonthlySummary.jsx) 페이지에서 연월 선택 시 해당 정보가 URL에 반영되도록 구현을 완료했습니다.

1. URL 파라미터 연동 (yearMonth):
  * 각 페이지에서 useParams를 통해 URL의 연월 정보(예: 202604)를 읽어와 화면에 표시되는 데이터를 동기화합니다.
  * 반대로 화면에서 달력을 조작하거나 스와이프하여 달을 변경하면, 즉시 URL이 /ledger/calendar/202605와 같은 형식으로 갱신됩니다.

2. 중첩 라우팅 강화 (Ledger.jsx):
  * 가계부 내의 각 탭이 :yearMonth 파라미터를 가질 수 있도록 하위 라우트 구성을 업데이트했습니다.
  * 탭을 전환할 때 현재 선택된 연월 정보를 유지한 채로 이동하므로, '달력'에서 4월을 보다가 '목록' 탭을 눌러도 그대로 4월 내역이 나타납니다.

3. 직접 접근 및 북마크 지원:
  * 이제 특정 연월의 가계부 주소를 복사해 두거나 북마크하면, 나중에 해당 주소로 접속했을 때 즉시 해당 달의 데이터를 확인할 수 있습니다.