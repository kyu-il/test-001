---
name: 'PAI: Wakeup'
description: '매일 아침 영감 메시지 스케줄 설정'
---

# PAI Wakeup

매일 아침 영감을 주는 메시지를 스케줄링합니다.

## 담당자 표시 (반드시 출력)

\`\`\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☀️ PAI > Wakeup
담당: wakeup (영감 메시지)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`\`\`

## 사용법

터미널에서 실행:
\`\`\`bash
npx pai-zero wakeup 06:00 # 평일 오전 6시 (기본)
npx pai-zero wakeup 07:30 매일 # 매일 오전 7시 30분
npx pai-zero wakeup 08:00 주말 # 주말 오전 8시
npx pai-zero wakeup status # 현재 설정 확인
npx pai-zero wakeup off # 해제
npx pai-zero wakeup # 지금 랜덤 메시지 보기
\`\`\`

## 스케줄 옵션

| 옵션 | 설명           | cron                |
| ---- | -------------- | ------------------- |
| 평일 | 월~금 (기본값) | \`\* \* \* \* 1-5\` |
| 매일 | 매일           | \`\* \* \* \* \*\`  |
| 주말 | 토~일          | \`\* \* \* \* 0,6\` |

## 동작 방식

- 시스템 crontab에 스케줄 등록
- 지정 시간에 macOS 알림 또는 Linux notify-send 전송
- \`~/.pai/wakeup-today.txt\` 에 오늘의 메시지 저장
