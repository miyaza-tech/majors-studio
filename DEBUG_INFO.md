# 🔧 디버그 정보 및 해결 내역

## 📋 문제 확인 사항

### 1. ✅ Index에서 Gallery 링크
**상태**: 정상 작동
- `<a href="gallery.html">Gallery</a>` 링크가 제대로 설정되어 있음
- 네비게이션 메뉴에 gallery.html로 가는 링크 존재

### 2. ✅ Gallery 팝업 (Lightbox)
**문제**: `onclick="openLightbox(1)"` 같은 인라인 이벤트가 작동하지 않음
**원인**: `window.openLightbox` 등의 함수가 전역으로 노출되지 않음
**해결**: gallery.js에 다음 코드 추가됨
```javascript
// ===== MAKE FUNCTIONS GLOBAL =====
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.nextImage = nextImage;
window.prevImage = prevImage;
```

### 3. ✅ Projects 팝업 (Modal)
**상태**: 정상 (이미 전역 함수로 노출되어 있음)
```javascript
window.openModal = openModal;
window.closeModal = closeModal;
window.nextImage = nextImage;
window.prevImage = prevImage;
window.goToSlide = goToSlide;
```

## 🔍 테스트 방법

### Live Server로 테스트하기:
1. VS Code에서 `index.html` 열기
2. 우클릭 → "Open with Live Server" 또는 하단 "Go Live" 버튼 클릭
3. 브라우저 개발자 도구 열기 (F12)
4. Console 탭에서 다음 메시지 확인:

#### Projects 페이지:
```
✅ Projects.js 초기화 시작
✅ Project data loaded successfully
🔍 openModal 함수 사용 가능: true
🔍 로드된 프로젝트 수: 4
🎉 모든 프로젝트 기능 로딩 완료
```

#### Gallery 페이지:
```
✅ Gallery.js 초기화 시작
✅ Gallery data loaded successfully
🔍 openLightbox 함수 사용 가능: true
🔍 로드된 갤러리 아이템 수: 10
🎉 Gallery 로딩 완료
```

## 📁 파일 구조 확인

### JavaScript 파일:
- ✅ js/main.js
- ✅ js/projects.js
- ✅ js/gallery.js
- ✅ js/blog.js
- ✅ js/blog_post.js

### JSON 데이터 파일:
- ✅ data/projects_json.json (4개 프로젝트)
- ✅ data/gallery_json.json (10개 아이템)
- ✅ data/blog_json.json (1개 featured + 6개 posts)

## 🐛 문제 해결 체크리스트

만약 팝업이 여전히 작동하지 않는다면:

1. **브라우저 콘솔 에러 확인**
   - F12 → Console 탭
   - 빨간색 에러 메시지 확인

2. **JSON 파일 로드 확인**
   - Network 탭에서 JSON 파일들이 200 OK로 로드되는지 확인
   - 404 에러가 있다면 파일 경로 문제

3. **함수 노출 확인**
   - Console에서 직접 입력: `window.openModal`
   - 결과가 `function`이어야 함

4. **HTML onclick 속성 확인**
   - projects.html: `onclick="openModal('project1')"`
   - gallery.html: `onclick="openLightbox(1)"`

5. **모달/라이트박스 HTML 확인**
   - projects.html: `<div class="modal" id="projectModal">` 존재 확인
   - gallery.html: `<div class="lightbox" id="lightbox">` 존재 확인

## 🎯 주요 수정 사항

### gallery.js (Line ~140)
```javascript
// 전역 함수 노출 추가
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.nextImage = nextImage;
window.prevImage = prevImage;
```

### projects.js & gallery.js
- 디버그 콘솔 로그 추가
- JSON 데이터 로딩 상태 확인
- 함수 사용 가능 여부 확인

## 💡 참고사항

- index.html의 gallery 섹션 아이템들은 클릭 이벤트가 없음 (의도된 동작)
- "View Full Gallery" 버튼으로 gallery.html 페이지로 이동 가능
- 각 페이지의 팝업은 해당 페이지에서만 작동 (main.js가 아닌 개별 JS 파일)
