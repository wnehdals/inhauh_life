# Plan: 주간 식단표 조회

**Source PRD**: `.claude/prds/weekly-meal-starbucks-menu.prd.md`
**Selected Milestone**: 1 — 주간 식단표 조회
**Complexity**: Small

## Summary
관리자가 JSON 파일로 직접 입력한 주간 식단 데이터를 읽어, 허용된 사용자가 웹 페이지(`/meals`)에서 요일별 식단(아침/점심/저녁)을 읽기 전용으로 조회할 수 있게 한다. 접근 제어(마일스톤 3)와 데이터 편집 UI는 이 마일스톤 범위 밖이며, 이 페이지는 접근 제어가 붙기 전까지 URL을 아는 사람 누구나 볼 수 있는 상태로 배포된다는 점을 감안해야 한다.

## Patterns to Mirror
| Category | Source | Pattern |
|---|---|---|
| Routing | `src/app/page.tsx` | App Router 파일 기반 라우팅 — `src/app/<segment>/page.tsx`가 `/<segment>` 라우트가 됨. 이 프로젝트는 Next.js 16 App Router이며 `page`는 async Server Component로 작성 가능 |
| Naming | `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md` | 라우팅되지 않는 헬퍼/컴포넌트는 `_lib`, `_components` 같은 private 폴더(`_` 접두사)에 배치 |
| 데이터/에러 처리/테스트 | — | 프로젝트가 방금 생성된 create-next-app 기본 스캐폴드(`src/app/{layout,page}.tsx`, `globals.css`)뿐이라 재사용할 기존 데이터 접근, 에러 처리, 로깅, 테스트 패턴이 없음. 아래 작업은 새 컨벤션을 처음 정의한다 |

## Files to Change
| File | Action | Why |
|---|---|---|
| `src/data/weekly-meal-plan.json` | CREATE | 관리자가 직접 입력/갱신하는 주간 식단 원본 데이터 |
| `src/lib/meal-plan.ts` | CREATE | 식단 데이터 타입 정의와 JSON 로더 함수 (페이지와 향후 재사용을 위해 분리) |
| `src/app/meals/page.tsx` | CREATE | `/meals` 라우트 — 식단표를 요일별 표로 렌더링하는 읽기 전용 Server Component |
| `src/app/page.tsx` | UPDATE | 홈에서 `/meals`로 이동할 수 있는 링크 추가 (현재는 create-next-app 기본 템플릿이라 진입 경로가 없음) |

## Tasks

### Task 1: 식단 데이터 타입 및 로더 작성
- **Action**: `src/lib/meal-plan.ts`에 `MealPlanWeek`, `MealPlanDay` 타입과 JSON을 읽어 파싱하는 `getWeeklyMealPlan()` 함수를 작성한다. 필드는 `week`(주 시작일), `days[]`(각 요일의 `date`, `day`, `meals.{breakfast,lunch,dinner}`)로 PRD에서 논의한 예시 구조를 따른다.
- **Mirror**: 없음 (신규 컨벤션) — Next.js 공식 가이드의 "colocate data helpers under `_lib` or `lib`" 권장을 참고해 `src/lib`에 배치
- **Validate**: `npx tsc --noEmit`로 타입 오류 없는지 확인

### Task 2: 샘플 식단 JSON 데이터 작성
- **Action**: `src/data/weekly-meal-plan.json`에 최소 1주일(월~일) 분량의 예시 식단 데이터를 Task 1의 타입 구조에 맞게 작성한다.
- **Mirror**: PRD Open Questions에서 합의된 JSON 예시 구조
- **Validate**: `node -e "JSON.parse(require('fs').readFileSync('src/data/weekly-meal-plan.json','utf8'))"`로 유효한 JSON인지 확인

### Task 3: 식단표 조회 페이지 구현
- **Action**: `src/app/meals/page.tsx`를 async Server Component로 작성해 `getWeeklyMealPlan()`을 호출하고, 요일별로 아침/점심/저녁을 표(table) 형태로 렌더링한다. 편집 기능은 포함하지 않는다(범위 제외).
- **Mirror**: `src/app/page.tsx`의 기존 Tailwind 클래스 스타일 톤을 참고해 최소한의 일관된 레이아웃 유지
- **Validate**: `npm run dev` 후 `/meals` 접속해 이번 주 식단이 표로 보이는지 육안 확인

### Task 4: 홈에서 식단표 페이지로 연결
- **Action**: `src/app/page.tsx`의 기존 create-next-app 템플릿 마크업을 정리하고 `/meals`로 가는 `<Link>`를 추가한다.
- **Mirror**: `next/link`의 `<Link href="/meals">` 사용 (Next.js 공식 가이드 `linking-and-navigating`)
- **Validate**: `npm run dev` 후 홈에서 링크 클릭 시 `/meals`로 이동하는지 확인

## Validation
```bash
npm run lint
npx tsc --noEmit
npm run build
npm run dev   # 수동으로 /meals 및 홈 → /meals 링크 확인
```

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| 접근 제어가 아직 없어(마일스톤 3 이전) 이 페이지가 배포되면 URL을 아는 누구나 볼 수 있음 | High | 접근 제어(마일스톤 3)가 붙기 전까지는 프로덕션 공개 배포를 보류하거나 URL을 비공개로 유지 |
| 데이터가 정적 JSON 파일이라 매주 갱신하려면 관리자가 코드 배포를 다시 해야 함 | Medium | MVP로는 허용된 트레이드오프(PRD에서 합의됨); 이후 별도 검토 필요 시 PRD Open Question으로 남김 |

## Acceptance
- [x] All tasks complete
- [x] Validation passes (lint / tsc --noEmit 통과, `npm run dev`로 홈 → `/meals` 동작 확인. `npm run build` 프로덕션 빌드는 이 저장소와 무관한 `.next` root 소유 권한 문제로 미검증 — `sudo rm -rf .next` 후 재확인 필요)
- [x] Patterns mirrored, not reinvented
