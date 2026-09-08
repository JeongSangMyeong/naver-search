# 네이버 검색 (naver-search)

네이버 오픈 API를 **서버 라우트로 프록시**해서 블로그·뉴스·책·카페 글·지식인·지역을
한 화면에서 검색하는 Next.js 14 App Router 앱입니다.
검색 유형을 바꾸면 표의 컬럼 구성이 통째로 바뀌고, 결과는 페이지네이션으로 넘깁니다.

> **출처를 밝힙니다.** 이 저장소는 Vercel의 [Next.js Learn](https://nextjs.org/learn) 튜토리얼을
> 끝낸 뒤, 그 위에 네이버 검색 기능을 직접 붙이면서 시작했습니다.
> 지금은 튜토리얼 코드(invoices / customers / Postgres / 인증)를 전부 걷어내고
> **직접 만든 검색 기능만 남긴 상태**입니다.

## 무엇을 직접 만들었나

| 파일 | 내용 |
| --- | --- |
| `pages/api/search.js` | 네이버 오픈 API 서버 프록시. 클라이언트 ID/시크릿이 브라우저로 내려가지 않도록 서버에서만 호출합니다. |
| `app/dashboard/naver/page.tsx` | 검색 화면. 검색 유형 선택 · 엔터 검색 · 페이지 이동 시 재조회. |
| `app/config/naver-search-column-config.tsx` | 검색 유형별 표 컬럼 정의. 6종 API의 응답 필드가 서로 달라서 설정으로 분리했습니다. |
| `app/ui/naver/table.tsx` | 컬럼 설정을 받아 그리는 표. 링크 · 이미지 · 날짜 필드를 타입별로 다르게 렌더링합니다. |
| `app/ui/naver/pagination.tsx` | 현재 페이지 기준 최대 5개 페이지 번호를 보여주는 페이지네이션. |

## 실행

```bash
npm install
cp .env.example .env.local   # 발급받은 값을 채웁니다
npm run dev
```

`http://localhost:3000` 으로 접속하면 `/dashboard/naver` 로 이동합니다.

### 환경변수

[네이버 개발자 센터](https://developers.naver.com/apps)에서 애플리케이션을 등록하고
**검색** API를 추가하면 발급됩니다.

```
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
```

두 값은 서버 라우트에서만 읽습니다. `NEXT_PUBLIC_` 접두사를 붙이면 브라우저로 노출되니 붙이지 마세요.

## 지원하는 검색 유형

| 유형 | `apiType` | 표에 보여주는 필드 |
| --- | --- | --- |
| 블로그 | `blog` | 제목, 내용, 블로거명, 블로거 링크, 링크, 작성일자 |
| 뉴스 | `news` | 제목, 내용, 링크, 오리지널 링크, 작성일자 |
| 책 | `book` | 저자, 제목, 내용, 가격, 이미지, 출판사, 링크, 출판일자 |
| 카페 글 | `cafearticle` | 카페명, 카페 링크, 제목, 내용, 링크 |
| 지식인 | `kin` | 제목, 내용, 링크 |
| 지역 | `local` | 제목, 주소, 도로명 주소, 위도, 경도, 링크 |

새 유형을 추가하려면 `naver-search-column-config.tsx` 에 컬럼을 정의하고
`pages/api/search.js` 의 `ALLOWED_API_TYPES` 에 추가하면 됩니다.

## 구조

```
app/
  dashboard/
    layout.tsx              사이드바 + 본문 레이아웃
    naver/page.tsx          검색 화면 (클라이언트 컴포넌트)
  config/
    naver-search-column-config.tsx
  ui/
    naver/table.tsx         검색 유형별 결과 표
    naver/pagination.tsx
pages/
  api/search.js             네이버 오픈 API 프록시 (Pages Router)
```

검색 화면은 App Router, API 프록시는 Pages Router를 씁니다.
기능을 붙이던 당시 익숙한 쪽으로 먼저 만들었고, 지금은 두 라우터가 한 앱에서 공존하는 상태입니다.

## 알려진 한계

- 네이버 검색 API는 `start` 최대값이 1000이라 **100페이지를 넘겨서 조회할 수 없습니다.**
- 검색 결과 본문은 네이버가 `<b>` 태그로 키워드를 강조해서 내려주기 때문에
  `dangerouslySetInnerHTML` 로 렌더링합니다. 응답 출처가 네이버 API로 한정된다는 전제에 기대고 있습니다.
- 검색어 입력에 디바운스가 없습니다. 엔터 또는 버튼으로만 조회합니다.
