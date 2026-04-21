# .omc/ — OMC 런타임 디렉토리

이 폴더는 OMC(oh-my-claudecode)가 Claude Code 실행 중 사용하는
상태/세션/로그 데이터를 저장합니다.

- `state/` — 에이전트 실행 상태
- `sessions/` — 세션 기록
- `logs/` — 실행 로그

각 하위 경로는 `.gitignore`에 포함되어 있습니다. (상위 디렉토리와
이 README는 추적됨)

## 참고

- OMC 저장소: https://github.com/SoInKyu/oh-my-claudecode
- 자동 설치: Claude Code 기동 시 `~/.claude/settings.json` 등록에
  따라 플러그인이 자동 로드됩니다.
