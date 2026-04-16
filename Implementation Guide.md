## Implementation Guide

### 1. 개발 개요
* 가계부 프로그램을 만들려고 함.
* 웹 브라우저와 모바일 브라우저에서 모두 가능하도록 반응형을 지원해야 함.

### 2. 기본 환경
  * 개발 환경 : vite + react
  * UI framework : primereact 최신 버전
  * 폰트 pretendard variables
  * 추가할 package (dependencies)
    - sass
    - gapi-script
  * 추가할 package (devDependencies)
    - eslint
    - prettier

### 3. 개발할 내용 - 1단계 : 화면 구성
* Footer에는 가계부, 통계, 자산, 설정 메뉴 있음.
* 각 메뉴는 별개의 jsx 파일로 만들 것.
1) 가계부 메뉴 화면
  - 상단에 Tab UI : 달력 / 목록
  - Floating Button
    - 화면 오른쪽 하단, Footer 바로 위에 위치
    - 클릭하면 Dialog 위에 '가계부 입력폼'가 보임.
  - 달력 Tab 화면
    - 오늘자 달력이 보이고, 각 날짜별로 '내용'을 보여줌
    - '내용'
      - 날짜별 총수입액(Blue), 총지출액(Red), 총이체액(Green) (색으로 구분)
      - 집행이 안된 건(집행=false)이 있으면 해당 날짜(숫자) 옆에 빨간색 '*' 마킹을 함.
    - 각 날짜를 클릭하면 Sidebar 컴포넌트(position="bottom")가 나타나고, 해당 일자의 '목록'이 보여짐.
      - '목록'은 아래 목록 Tab의 화면 구성, 기능과 동일하되 해당 날짜의 데이터만 보여짐.
  - 목록 Tab 화면
    - 이번달 수입액, 지출액, 이체액 목록 화면.
    - 맨 앞에 checkbox가 있고, 이 checkbox로 집행 항목을 true/false 입력할 수 있음.
2) 통계
  - 빈화면.
3) 자산
  - 빈화면.
4) 설정 메뉴
  - 클릭 시, aside 메뉴 화면 오른쪽에서 왼쪽으로 펼쳐짐.
  - Sidebar 컴포넌트(position="right")
5) 가계부 입력 폼 화면
  - Dialog Footer : 닫기, 저장(primary), 삭제(secondar) 버튼
  - 입력 폼은 추후 '개발할 내용 - 2단계'에서 구성

* 구글 스프레드시트 파일에는 아래와 같은 시트가 있음
    - 연도 시트 : 연도별로 수입/지출/이체 내역 시트 생성
    - 자산 시트 : 계좌 / 약칭
    - 코드 시트 : 코드구분 / 코드 / 명칭 / 비고
* 입력항목-1 : 구분(수입/지출/이체), 날짜
    - 수입일때 : 자산(계좌) / 분류(수입 분류 코드) / 금액 / 내용
    - 지출일때 : 자산(계좌) / 분류(지출 분류 코드) / 금액 / 내용
    - 이체일때 : 출금(계좌) / 입금(계좌) / 금액 / 내용
* 위에서 입력할 자산(계좌)는 자산 시트에서 읽어와서 dropdown으로 표시. 구분-자산명 형태로.
* 위에서 입력할 분류는 코드 시트에서 읽어와서 dropdown으로 표시. 구분에 맞는 코드표를 명칭만 보여줄 것.
* 날짜가 미래일자명 집행에 false, 오늘 포함 과거일자일때는 true로 표시

#### 1) 화면 구성
  * primeReact의 테마는 기본 테마를 적용(https://primereact.org/colors/를 참고해서 primary 컬러를 적용)
  * toast 사용 안함.
  * css로 그림자 사용 안하고, border-radius: 0
  * 기본 폰트 사이즈는 14px
  * body는 padding: 2rem을 두면 됨. backgroundColor: white;
  * 타이틀은 'gem_gagaebu'로 바꿈.
  * 타이틀 옆에 reload(아이콘) 버튼을 두고, 이 버튼을 누르면 데이터를 다시 읽어와서 DataTable에 적용
  * DataTable에 집행 컬럼은 true/false를 체크박스로 표시.
  * 컬럼 순서 : 집행, 구분, 날짜, 자산, 분류, 내용, 금액
  * 정렬 허용 컬럼 : 구분, 날짜, 자산, 분류, 금액, 내용
  * DataTable의 editMode='cell'로 설정. 셀을 클릭하면 편집할 수 있도록. 편집한 값은 구글 시트에 반영.
  * 자산, 분류 dropdown은 editable=false로 설정
  * 모든 금액은 콤마를 사용해서 표시 / align right
  * 필수 입력 항목 Label 뒤에 red-600 *로 표시
  * 내용은 필수 입력 항목 아님.
  * Calendar의 locale은 'ko'

#### 2) 데이터
  * 각 item별 스타일은 google sheet(https://docs.google.com/spreadsheets/d/1LsFDmpmPaPCPXPBl1FS8CXx56UqGE0WQ5eFccwYeWcE/edit?gid=0#gid=0)에서 읽어옴
  * 단, localhost에서 구글 sheet에 접근하려고 함.
  * 화면 reload시에 구글 로그인을 다시 하지 말 것.
  * google cloude OAuth 2.0
    - 클라이언트 ID : 660525556283-dtpdooehas3u161nsstn2l4hufvndhpr.apps.googleusercontent.com
    - 클라이언트 보안 비밀번호 : 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


개인용 가계부 UI
- 조회 방식은 달력/일별/월별
- 달력에 날짜별 수입,지출,이체 합계금액 표시
- 일별/월별은 해당 일자 혹은 월의 수입,지출,이체 목록형으로 표시
- 왼쪽 상단에 햄버거 메뉴. 클릭시 aside 메뉴 노출
- 화면 하단에 추가 floating 버튼 : 클릭시 수입,지출,이체 내역 등록 폼 dialog
