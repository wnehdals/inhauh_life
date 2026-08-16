# 주간 식단표 & 스타벅스 메뉴 조회

## Problem
관리자가 허락한 여러 사용자가 이번 주 식단이나 스타벅스에 어떤 메뉴가 있는지 확인할 방법이 없다. 그 결과 관리자가 공책을 들고 사용자 한 명 한 명에게 물어보며 수기로 주문할 메뉴를 조사해야 했고, 식단 확인 역시 별도 수단 없이 관리자를 거쳐야만 가능했다.

## Evidence
- Assumption — needs validation via user research (관리자 본인의 반복 경험 외 정량적 근거는 아직 없음)

## Users
- **Primary**: 관리자가 접근을 허락한 여러 사용자. 이번 주 식단이 궁금하거나 스타벅스에서 무엇을 주문할지 정하고 싶을 때 접근한다.
- **Not for**: 불특정 다수 일반 사용자, 스타벅스 메뉴를 실제로 주문/결제하려는 사용자(주문·결제는 이 제품의 대상이 아님)

## Hypothesis
We believe **주간 식단 조회 기능과 카테고리별 스타벅스 전체 메뉴 조회 기능**이 **관리자가 수기로 하던 조사 작업을 사용자 스스로 처리하게 하여 발생하던 불편**을 **식단이나 스타벅스 메뉴가 궁금한 사용자들**에게 해결해줄 것이라고 믿는다.
We'll know we're right when **관리자가 더 이상 수기로 메뉴를 조사할 필요가 없어지고, 관리자 본인이 이 기능에 만족한다고 느낄 때**다.

## Success Metrics
| Metric | Target | How measured |
|---|---|---|
| 관리자가 수기로 메뉴를 조사해야 했던 횟수 | 0회/주 | 관리자 주관적 확인 (해당 요청 발생 여부 기록) |
| 관리자 만족도 | 만족 | 관리자 직접 평가 (정성적) |

## Scope
**MVP**
- 주간 식단표 조회 (읽기 전용 — 관리자가 JSON으로 직접 입력한 데이터를 사용자가 조회)
- 스타벅스 전체 메뉴를 카테고리별로 조회 (가능하면 공식 홈페이지 데이터를 가져와 표시)
- 허용된 사용자만 접근 가능한 최소한의 접근 제어

**Out of scope**
- 스타벅스 메뉴 주문/결제 기능 — 조회만 지원, 주문 접수는 이번 범위에서 제외
- 식단표 편집 기능 — 관리자가 JSON을 직접 입력하는 방식으로 대체, UI 편집기는 미포함
- 사용자 초대/권한 관리 UI — 초기에는 관리자가 수동으로 접근을 허용
- 알림 기능 — 이번 범위에서 제외

## Delivery Milestones
<!-- Business outcomes, not engineering tasks. /plan turns each into a plan. -->
<!-- Status: pending | in-progress | complete -->

| # | Milestone | Outcome | Status | Plan |
|---|---|---|---|---|
| 1 | 주간 식단표 조회 | 사용자가 웹에서 이번 주 식단을 확인할 수 있다 | complete | `.claude/plans/weekly-meal-starbucks-menu.plan.md` |
| 2 | 스타벅스 메뉴 조회 | 사용자가 카테고리별로 스타벅스 전체 메뉴를 웹에서 확인할 수 있다 | complete | `.claude/plans/starbucks-menu.plan.md` |
| 3 | 접근 제어 | 관리자가 허락한 사용자만 위 기능에 접근할 수 있다 | pending | — |

## Open Questions
- [ ] 스타벅스 메뉴 데이터를 공식 홈페이지에서 가져올 수 있는가? (크롤링/스크래핑의 기술적·약관상 가능 여부) — 불가능하면 수동 데이터(json 형식) 입력으로 대체
- [ ] 허용된 사용자만 접근하는 방식을 어떻게 구현할 것인가? (로그인, 공유 링크+비밀번호 등) — 초기에는 관리자가 수동으로 관리한다고 가정
- [ ] 식단표 JSON은 얼마나 자주, 누가 갱신하는가? (매주 관리자가 직접 갱신한다고 가정)

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| 스타벅스 공식 홈페이지 크롤링이 이용약관 위반이거나 기술적으로 어려울 수 있음 | Medium | Medium | 실패 시 관리자가 메뉴 데이터를 수동 입력하는 방식으로 폴백 |
| 접근 제어 방식이 정해지지 않아 개발 범위가 예상보다 커질 수 있음 | Medium | Low | MVP는 단순한 방식(예: 공유 링크 + 비밀번호)으로 시작 |

---
*Status: DRAFT — requirements only. Implementation planning pending via /plan.*
