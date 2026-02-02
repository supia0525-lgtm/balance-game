# 밸런스 게임 웹사이트 🎮

500명 이상이 동시에 접속하여 실시간으로 투표할 수 있는 밸런스 게임입니다.

## ✨ 주요 기능

- ✅ **실시간 동기화**: Supabase Realtime으로 모든 사용자가 동시에 결과 확인
- ✅ **대규모 동시 접속**: 500명 이상 동시 접속 지원
- ✅ **모바일 최적화**: 반응형 디자인으로 모바일/태블릿/데스크톱 모두 지원
- ✅ **중복 투표 방지**: 로컬 스토리지로 사용자별 투표 기록 관리
- ✅ **애니메이션 효과**: 부드러운 퍼센트 바 애니메이션
- ✅ **빠른 배포**: Vercel로 클릭 몇 번만에 배포 완료

## 🚀 빠른 시작

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속 후 무료 계정 생성
2. "New Project" 클릭하여 새 프로젝트 생성
3. 프로젝트 이름, 데이터베이스 비밀번호 설정

### 2. 데이터베이스 설정

1. Supabase 대시보드에서 **SQL Editor** 메뉴로 이동
2. `supabase/setup.sql` 파일의 내용을 복사하여 붙여넣기
3. "Run" 버튼 클릭하여 실행

### 3. API 키 확인

1. Supabase 대시보드에서 **Settings** > **API** 메뉴로 이동
2. 다음 정보 복사:
   - `Project URL`
   - `anon public` 키

### 4. 로컬 개발 환경 설정

```bash
# 저장소 클론 (또는 파일 다운로드)
cd balance-game-app

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local

# .env.local 파일을 열어서 Supabase 정보 입력
# NEXT_PUBLIC_SUPABASE_URL=your-project-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 5. Vercel 배포 (추천)

#### 방법 1: GitHub 연동 (권장)

1. GitHub에 저장소 생성 후 코드 푸시
2. [Vercel](https://vercel.com) 접속 후 GitHub 계정 연결
3. "New Project" 클릭
4. 저장소 선택
5. 환경 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. "Deploy" 클릭

#### 방법 2: Vercel CLI

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel

# 환경 변수 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 프로덕션 배포
vercel --prod
```

배포 완료 후 제공되는 URL로 접속!

## 📱 모바일 최적화

- **터치 최적화**: 모바일 터치 이벤트 최적화
- **반응형 레이아웃**: 모든 화면 크기에 대응
- **빠른 로딩**: 최소한의 JavaScript로 빠른 초기 로딩
- **데이터 절약**: 효율적인 실시간 업데이트

## 🔧 커스터마이징

### 질문 변경

`pages/index.js` 파일의 `questions` 배열 수정:

```javascript
const questions = [
  {
    id: 'q1',
    a: "첫 번째 선택지",
    b: "두 번째 선택지"
  },
  // 질문 추가...
]
```

**중요**: 질문을 추가/삭제하면 `supabase/setup.sql`의 초기 데이터도 함께 수정해야 합니다.

### 디자인 변경

Tailwind CSS 클래스를 수정하여 색상, 레이아웃 변경 가능:

```javascript
// 빨강/파랑 대신 다른 색상으로 변경
className="border-red-500"  // → border-green-500
className="bg-blue-600"     // → bg-purple-600
```

### 애니메이션 속도 조정

```javascript
// transition duration 값 변경
className="transition-all duration-500"  // → duration-1000 (더 느리게)
```

## 🎯 성능 최적화

### 대규모 트래픽 대응

현재 설정으로 500명+ 동시 접속 지원하지만, 더 많은 사용자가 필요하다면:

1. **Supabase 플랜 업그레이드**
   - Pro 플랜: 더 많은 동시 연결 지원
   - Connection Pooling 활성화

2. **실시간 업데이트 쓰로틀링**
   ```javascript
   // lib/supabase.js에서 조정
   eventsPerSecond: 5  // 기본값 10에서 감소
   ```

3. **CDN 활용**
   - Vercel은 자동으로 CDN 제공
   - 이미지가 있다면 최적화 필요

### 데이터베이스 최적화

```sql
-- 통계 확인
SELECT * FROM get_total_votes();

-- 투표 리셋 (필요시)
SELECT reset_all_votes();
```

## 🛠️ 기술 스택

- **프론트엔드**: Next.js 14, React 18
- **스타일링**: Tailwind CSS
- **백엔드**: Supabase (PostgreSQL)
- **실시간**: Supabase Realtime
- **배포**: Vercel

## 📊 모니터링

### Supabase 대시보드에서 확인 가능:

1. **Database** > **Table Editor**: 실시간 투표 수 확인
2. **Database** > **Logs**: 쿼리 로그 확인
3. **API** > **Logs**: API 호출 모니터링

### Vercel 대시보드에서 확인 가능:

1. **Analytics**: 방문자 수, 페이지 뷰
2. **Speed Insights**: 페이지 로딩 속도
3. **Logs**: 서버 로그

## 🐛 문제 해결

### "투표 중 오류가 발생했습니다"

1. Supabase 연결 확인
2. `increment_vote` 함수가 제대로 생성되었는지 확인
3. Row Level Security 정책 확인

### 실시간 업데이트가 안 됨

1. Supabase Realtime이 활성화되었는지 확인
2. 브라우저 콘솔에서 에러 확인
3. 네트워크 연결 확인

### 로컬에서는 되는데 배포 후 안 됨

1. Vercel 환경 변수 확인
2. `NEXT_PUBLIC_` 접두사 확인 (필수)
3. Vercel 빌드 로그 확인

## 📝 라이선스

MIT License - 자유롭게 사용하세요!

## 🤝 기여

이슈나 풀 리퀘스트는 언제나 환영합니다!

## 📧 문의

문제가 있거나 질문이 있다면 이슈를 생성해주세요.

---

**만든 이**: Claude with ❤️

**버전**: 1.0.0

**최종 업데이트**: 2026년 2월
