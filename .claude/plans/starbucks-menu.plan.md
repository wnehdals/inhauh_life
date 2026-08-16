# Plan: 스타벅스 메뉴 조회

**Source PRD**: `.claude/prds/weekly-meal-starbucks-menu.prd.md`
**Selected Milestone**: 2 — 스타벅스 메뉴 조회
**Complexity**: Small

## Summary
사용자가 `/starbucks` 페이지에서 카테고리별로 묶인 스타벅스 전체 메뉴(메뉴명, 가격)를 읽기 전용으로 조회할 수 있게 한다. 마일스톤 1(`/meals`)에서 확립한 "관리자가 JSON을 직접 관리 → `src/lib`의 타입/로더 → `src/app/<segment>/page.tsx`에서 렌더링" 패턴을 그대로 재사용한다.

## Open Question 해결: 공식 홈페이지에서 메뉴를 가져올 수 있는가
PRD Open Question 중 "스타벅스 메뉴 데이터를 공식 홈페이지에서 가져올 수 있는가"는 이번 마일스톤에서 **가져오지 않는 것으로 결정**한다.
- **이유**: 스타벅스 공식 사이트는 별도 공개 API가 없고, 메뉴 페이지는 JS로 렌더링되어 스크래핑이 기술적으로 번거로우며 이용약관 위반 소지도 있다. PRD Risks에 이미 "실패 시 수동 데이터 입력으로 폴백"이 합의되어 있으므로, 처음부터 그 폴백(관리자가 JSON으로 직접 입력)으로 시작한다.
- **범위에 미치는 영향**: 마일스톤 1과 동일하게 `src/data/starbucks-menu.json`을 관리자가 직접 관리한다. 실시간 크롤링/동기화는 이번 마일스톤 범위 밖이며, 필요해지면 별도 PRD/계획으로 다시 다룬다.
- 이 결정에 동의하지 않으면 계획을 승인하기 전에 알려달라 — 크롤링을 실제로 원한다면 접근 방식(구조, 스케줄링, 약관 검토)이 완전히 달라져 별도 계획이 필요하다.

## Patterns to Mirror
| Category | Source | Pattern |
|---|---|---|
| 데이터 로더 | `src/lib/meal-plan.ts:1-22` | `@/data/*.json`을 직접 import하고, 타입 + `get*()` 함수 하나를 export하는 구조 |
| 라우팅 | `src/app/meals/page.tsx` | `src/app/<segment>/page.tsx`가 async 없이도(정적 로컬 데이터라 async 불필요) 동작하는 Server Component page |
| 스타일 | `src/app/meals/page.tsx` | Tailwind로 카드/표 레이아웃, `border-black/[.08] dark:border-white/[.145]` 톤 재사용 |
| 홈 링크 | `src/app/page.tsx` | `next/link`의 `<Link href="...">` 버튼 스타일 재사용 |

## Files to Change
| File | Action | Why |
|---|---|---|
| `src/data/starbucks-menu.json` | CREATE | 관리자가 직접 입력/갱신하는 카테고리별 스타벅스 메뉴 원본 데이터 |
| `src/lib/starbucks-menu.ts` | CREATE | 메뉴 타입 정의와 JSON 로더 함수 (`meal-plan.ts`와 동일한 패턴) |
| `src/app/starbucks/page.tsx` | CREATE | `/starbucks` 라우트 — 카테고리별 메뉴를 조회하는 읽기 전용 Server Component |
| `src/app/page.tsx` | UPDATE | `/meals` 링크 옆에 `/starbucks` 링크 추가 |

## Tasks

### Task 1: 메뉴 데이터 타입 및 로더 작성
- **Action**: `src/lib/starbucks-menu.ts`에 `MenuItem`(`name`, `price`), `MenuCategory`(`name`, `items: MenuItem[]`), `StarbucksMenu`(`categories: MenuCategory[]`) 타입과 `getStarbucksMenu(): StarbucksMenu` 함수를 작성한다.
- **Mirror**: `src/lib/meal-plan.ts`의 JSON import + 타입 + `get*()` 패턴을 그대로 따른다.
- **Validate**: `npx tsc --noEmit`

### Task 2: 카테고리별 메뉴 JSON 데이터 작성
- **Action**: `src/data/starbucks-menu.json`에 최소 3개 카테고리(예: 커피, 티/음료, 푸드)와 카테고리별 대표 메뉴 몇 개(이름, 가격)를 Task 1의 타입에 맞게 작성한다. 실제 스타벅스 코리아 공개 가격 정보를 참고해 합리적인 예시 값을 넣는다.
- **Mirror**: `src/data/weekly-meal-plan.json`과 동일하게 관리자가 직접 편집하는 정적 파일
- **Validate**: `node -e "JSON.parse(require('fs').readFileSync('src/data/starbucks-menu.json','utf8'))"`

### Task 3: 스타벅스 메뉴 조회 페이지 구현
- **Action**: `src/app/starbucks/page.tsx`를 Server Component로 작성해 `getStarbucksMenu()`를 호출하고, 카테고리마다 섹션을 나눠 메뉴명과 가격(예: `4,500원`, `toLocaleString("ko-KR")` 사용)을 리스트로 렌더링한다. 주문/결제 UI는 포함하지 않는다(범위 제외).
- **Mirror**: `src/app/meals/page.tsx`의 레이아웃/타이포그래피 톤
- **Validate**: `npm run dev` 후 `/starbucks` 접속해 카테고리별 메뉴와 가격이 보이는지 육안 확인

### Task 4: 홈에서 스타벅스 메뉴 페이지로 연결
- **Action**: `src/app/page.tsx`에 기존 `/meals` 링크 옆에 `/starbucks`로 가는 링크를 추가한다.
- **Mirror**: 기존 `<Link href="/meals">` 버튼과 동일한 스타일
- **Validate**: `npm run dev` 후 홈에서 두 링크 모두 정상 이동하는지 확인

## Validation
```bash
npm run lint
npx tsc --noEmit
npm run build   # .next가 root 소유로 막혀 있으면 사전에 `sudo rm -rf .next` 필요
npm run dev     # 수동으로 /starbucks 및 홈 링크 확인
```

## Risks
| Risk | Likelihood | Mitigation |
|---|---|---|
| 메뉴/가격이 정적 JSON이라 스타벅스가 가격을 바꾸면 관리자가 수동으로 갱신하고 재배포해야 함 | High | MVP로 합의된 트레이드오프; 갱신 주기가 문제되면 이후 크롤링/자동화를 별도 계획으로 검토 |
| 접근 제어가 아직 없어(마일스톤 3 이전) `/starbucks`도 URL을 아는 누구나 볼 수 있음 | High | `/meals`와 동일하게 마일스톤 3(접근 제어) 완료 전까지 프로덕션 공개 배포 보류 |
| 예시로 입력하는 메뉴/가격이 실제 최신 가격과 다를 수 있음 | Medium | 관리자가 배포 전 실제 가격으로 직접 검수 |

## Acceptance
- [x] All tasks complete
- [x] Validation passes (lint / tsc --noEmit / `npm run build` 모두 통과, `/starbucks` 정적 페이지 생성 확인)
- [x] Patterns mirrored, not reinvented
