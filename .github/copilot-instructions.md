# Copilot Instructions for MAJORS STUDIO

## Project Overview
정적 포트폴리오 웹사이트 (크리에이티브 아트 스튜디오). 빌드 도구 없이 순수 HTML/CSS/JS로 구성되며, JSON 기반 데이터로 콘텐츠를 관리합니다.

## Architecture

### Page Structure
- [index.html](../index.html) - 메인 랜딩페이지 (히어로 슬라이더, About, Services, Contact 섹션)
- [projects.html](../projects.html), [gallery.html](../gallery.html), [blog.html](../blog.html) - 독립 서브페이지

### Data Flow Pattern
모든 동적 콘텐츠는 `data/` 폴더의 JSON에서 `fetch()`로 로드:
```
data/projects_json.json  →  js/projects.js  →  projects.html
data/gallery_json.json   →  js/gallery.js   →  gallery.html
data/blog_json.json      →  js/blog.js      →  blog.html
data/translations.json   →  js/language.js  →  모든 페이지
```

### 다국어 시스템 (EN/KO)
- [js/language.js](../js/language.js) 가 핵심 - `switchLanguage()`, `updatePageContent()` 함수
- 번역 데이터 구조: `{ "key": { "en": "English", "ko": "한국어" } }`
- `localStorage.getItem('language')` 로 언어 설정 유지
- 새 텍스트 추가 시 반드시 [data/translations.json](../data/translations.json)에 양쪽 언어 추가

## Key Patterns

### JSON 데이터 로드 패턴
```javascript
async function loadProjectData() {
    const response = await fetch('data/projects_json.json');
    const data = await response.json();
    // ...
}
```

### 안전한 DOM 쿼리 패턴
`safeQuery()`, `safeQuerySelector()` 유틸리티 함수 사용:
```javascript
function safeQuery(selector) {
    try { return document.querySelector(selector); }
    catch (error) { return null; }
}
```

### 언어 전환 이벤트
```javascript
window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
```

## File Conventions

### CSS 구조
- [css/styles.css](../css/styles.css) - 메인 스타일 (공통 + index.html)
- 각 서브페이지별 CSS: `css/projects.css`, `css/gallery.css`, `css/blog.css`

### 이미지/비디오 경로
- 프로젝트 이미지: `assets/image/project01/`, `project02/` ...
- 갤러리: `assets/image/gallery/`
- 비디오: `assets/videos/`

## Critical Notes

1. **빌드 도구 없음** - 파일 직접 수정, npm/webpack 불필요
2. **비디오 최적화** - 첫 슬라이드만 `preload="auto"`, 나머지는 `preload="none"`
3. **모바일 메뉴** - `#mobileMenuBtn`, `#navLinks` ID 유지 필수
4. **EmailJS 통합** - Contact 폼은 EmailJS 사용 (CDN 로드됨)
5. **반응형 브레이크포인트** - `768px` (모바일/데스크톱 전환점)

## Adding New Content

### 새 프로젝트 추가
1. [data/projects_json.json](../data/projects_json.json)에 객체 추가
2. 필수 필드: `id`, `title`, `description`, `category`, `thumbnail`, `media[]`
3. 다국어 필드는 `{ "en": "", "ko": "" }` 형식

### 새 갤러리 아이템 추가
1. [data/gallery_json.json](../data/gallery_json.json)에 추가
2. `type`: `"image"` 또는 `"video"`

## Design System

### 폰트
- **헤더/네비게이션**: `Bebas Neue` 36px (대문자)
- **본문**: `Noto Sans KR`

### 컬러
- 주 배경: `#FAFAFA`
- 로고 배경: `#667eea` (파란색-보라색)
- 텍스트: `#1a1a2e` (다크 네이비)
- 강조색: `#667eea`

### 네비게이션 구조
- 슬래시(`/`)로 메뉴 구분
- 언어 스위처: `KR` | `EN` (우측 끝)
