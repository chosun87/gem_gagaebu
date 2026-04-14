## Implementation Guide

### 1. 기본 환경
  * 개발 환경 : vite + react
  * UI framework : primereact 최신 버전
  * 폰트 pretendard variables
  * 추가할 package (dependencies)
    - sass
    - gapi-script
  * 추가할 package (devDependencies)
    - eslint
    - prettier

### 2. 개발할 내용
#### 0) 개요
* 가계부 프로그램을 만들려고 함.
* 구글 스프레드시트 파일에는 아래와 같은 시트가 있음
    - 연도 시트 : 연도별로 수입/지출/이체 내역 시트 생성
    - 자산 시트 : 계좌 / 약칭
    - 코드 시트 : 코드구분 / 코드 / 명칭 / 비고
* 입력항목-1 : 구분(수입/지출/이체), 날짜
    - 수입일때 : 자산(계좌) / 분류(수입 분류 코드) / 금액 / 내용
    - 지출일때 : 자산(계좌) / 분류(지출 분류 코드) / 금액 / 내용
    - 이체일때 : 출금(계좌) / 입금(계좌) / 금액 / 내용

#### 1) 화면 구성
  * primeReact의 테마는 기본 테마를 적용(https://primereact.org/colors/를 참고해서 primary 컬러를 적용)
  * toast 사용 안함.
  * css로 그림자 사용 안하고, border-radius: 0
  * 기본 폰트 사이즈는 14px
  * body는 padding: 2rem을 두면 됨. backgroundColor: white;
  * 타이틀은 'gem_gagaebu'로 바꿈.
  * 타이틀 옆에 reload(아이콘) 버튼을 두고, 이 버튼을 누르면 데이터를 다시 읽어와서 DataTable에 적용
 
#### 2) 데이터
  * 각 item별 스타일은 google sheet(https://docs.google.com/spreadsheets/d/1LsFDmpmPaPCPXPBl1FS8CXx56UqGE0WQ5eFccwYeWcE/edit?gid=0#gid=0)에서 읽어옴
  * 단, localhost에서 구글 sheet에 접근하려고 함.
  * 화면 reload시에 구글 로그인을 다시 하지 말 것.
  * google cloude OAuth 2.0
    - 클라이언트 ID : 660525556283-dtpdooehas3u161nsstn2l4hufvndhpr.apps.googleusercontent.com
    - 클라이언트 보안 비밀번호 : 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
