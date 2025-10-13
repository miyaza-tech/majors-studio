// ===== EMAILJS CONFIGURATION EXAMPLE =====
// 📝 설정 가이드:
// 1. 이 파일을 'config.js'로 복사하세요
// 2. 아래 값들을 실제 EmailJS 정보로 변경하세요
// 3. config.js 파일은 절대 Git에 커밋하지 마세요 (.gitignore에 포함됨)

const EMAIL_CONFIG = {
    // EmailJS Public Key (Dashboard > Account > API Keys)
    publicKey: 'YOUR_PUBLIC_KEY_HERE',
    
    // EmailJS Service ID (Dashboard > Email Services)
    serviceId: 'YOUR_SERVICE_ID_HERE',
    
    // EmailJS Template ID (Dashboard > Email Templates)
    templateId: 'YOUR_TEMPLATE_ID_HERE'
};

// ===== EmailJS 설정 방법 =====
// 1. https://www.emailjs.com/ 에서 계정 생성
// 2. Email Service 추가 (Gmail, Outlook 등)
// 3. Email Template 생성
// 4. Account > API Keys에서 Public Key 확인
// 5. 위의 값들을 복사하여 config.js에 붙여넣기

// ===== 보안 권장사항 =====
// - EmailJS Dashboard에서 허용된 도메인 설정하기
// - HTTP Referrer 제한 활성화하기
// - 사용량 모니터링 및 알림 설정하기
