# 🔒 EmailJS 설정 가이드

## 📋 초기 설정 방법

### 1. 설정 파일 생성
```bash
# config.example.js를 config.js로 복사
cp js/config.example.js js/config.js
```

### 2. EmailJS 계정 설정
1. [EmailJS 웹사이트](https://www.emailjs.com/)에서 계정 생성
2. **Email Service** 추가 (Gmail, Outlook 등)
3. **Email Template** 생성
4. **Account > API Keys**에서 Public Key 확인

### 3. config.js 파일 수정
```javascript
const EMAIL_CONFIG = {
    publicKey: 'YOUR_ACTUAL_PUBLIC_KEY',    // 실제 Public Key로 변경
    serviceId: 'YOUR_ACTUAL_SERVICE_ID',     // 실제 Service ID로 변경
    templateId: 'YOUR_ACTUAL_TEMPLATE_ID'    // 실제 Template ID로 변경
};
```

### 4. EmailJS 대시보드에서 도메인 제한 설정

보안 강화를 위해 **반드시 설정**하세요:

1. EmailJS Dashboard > Account > Security
2. **Allowed Domains** 추가:
   ```
   localhost
   127.0.0.1
   yourdomain.com
   www.yourdomain.com
   ```
3. **HTTP Referrer** 제한 활성화
4. **Usage Limits** 설정 (스팸 방지)

## 🔐 보안 체크리스트

- [ ] `js/config.js` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] EmailJS 대시보드에서 허용된 도메인만 설정
- [ ] HTTP Referrer 제한 활성화
- [ ] 사용량 알림 설정 (월 200회 이상 시 알림)
- [ ] Git에 실수로 config.js가 커밋되지 않았는지 확인

## ⚠️ 주의사항

### Git에 실수로 커밋한 경우
```bash
# Git history에서 config.js 제거
git rm --cached js/config.js
git commit -m "Remove config.js from repository"
git push

# EmailJS에서 API 키 재생성 (필수!)
```

### 팀원과 공유할 때
- `js/config.js` 파일은 **절대 Git에 커밋하지 않기**
- 대신 안전한 방법으로 API 키 공유:
  - 비공개 메신저
  - 암호화된 파일 공유
  - 팀 비밀번호 관리자 (1Password, LastPass 등)

## 📱 테스트 방법

```bash
# 로컬 서버 실행 (Python 3)
python -m http.server 8000

# 또는 Node.js
npx http-server -p 8000
```

브라우저에서 `http://localhost:8000` 접속 후 Contact 폼 테스트

## 🚀 배포 시 참고사항

### Netlify
- Netlify Dashboard > Site settings > Environment variables에 추가
- Build command에서 config.js 자동 생성 스크립트 실행

### Vercel
- Vercel Dashboard > Settings > Environment Variables에 추가
- 빌드 시 자동으로 config.js 생성

### GitHub Pages
- Repository Settings > Secrets에 추가
- GitHub Actions에서 config.js 생성

## 📞 문의

문제가 발생하면 `js/config.example.js`를 참고하거나 팀 리더에게 문의하세요.
