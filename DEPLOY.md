# 🚀 5분만에 배포하기

## Step 1: Supabase 설정 (2분)

1. https://supabase.com 접속
2. "Start your project" 클릭
3. GitHub 계정으로 로그인
4. "New project" 클릭
   - Name: `balance-game`
   - Password: 원하는 비밀번호 입력
   - Region: Northeast Asia (Seoul) 선택
   - "Create new project" 클릭

5. 프로젝트가 생성되면 좌측 메뉴에서 **SQL Editor** 클릭
6. `supabase/setup.sql` 파일 내용 전체 복사 후 붙여넣기
7. 우측 상단 "Run" 버튼 클릭 ✅

8. 좌측 메뉴에서 **Settings** > **API** 클릭
9. 다음 2개 값을 메모장에 복사:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 2: Vercel 배포 (3분)

### 옵션 A: GitHub 없이 배포 (더 쉬움)

1. https://vercel.com 접속
2. "Deploy" 버튼 클릭
3. 프로젝트 폴더를 드래그 앤 드롭
4. "Environment Variables" 추가:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: 위에서 복사한 Project URL
   - "Add" 클릭
   
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: 위에서 복사한 anon public 키
   - "Add" 클릭

5. "Deploy" 버튼 클릭
6. 2-3분 대기
7. 완료! 제공된 URL로 접속하면 끝 🎉

### 옵션 B: GitHub으로 배포 (자동 업데이트)

1. GitHub에 새 저장소 생성
2. 프로젝트 폴더에서:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/balance-game.git
   git push -u origin main
   ```

3. https://vercel.com 접속
4. "Add New" > "Project" 클릭
5. GitHub 저장소 import
6. 환경 변수 추가 (위와 동일)
7. "Deploy" 클릭

## Step 3: 테스트 (1분)

1. 배포된 URL 접속
2. 첫 번째 질문에 투표
3. 다른 기기나 시크릿 모드로도 접속해서 투표
4. 실시간으로 퍼센트가 바뀌는지 확인 ✅

## 완료! 🎊

이제 URL을 친구들에게 공유하세요!

## 문제가 생겼다면?

### "500 Internal Server Error"
→ Vercel 환경 변수를 다시 확인하세요. `NEXT_PUBLIC_` 접두사 필수!

### 투표가 저장 안 됨
→ Supabase SQL이 제대로 실행되었는지 확인 (Table Editor에서 balance_game 테이블 확인)

### 실시간 업데이트 안 됨
→ Supabase 대시보드 > Database > Replication에서 balance_game 테이블이 활성화되어 있는지 확인

## 도움이 더 필요하신가요?

README.md 파일에 자세한 설명이 있습니다!
