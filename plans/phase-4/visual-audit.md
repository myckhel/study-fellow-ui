# Phase 4 visual and accessibility audit

Inspected 14 October 2026 by the visual specialist. Evidence uses local Google Chrome 155.0.8059.40 through Playwright against the development server. This is a scoped technical audit, not learner validation, biology review, assistive-technology certification, or a complete WCAG audit. No runtime code was changed by this specialist.

## Current layout evidence

The three `screenshots/audit-*.png` images were captured and visually inspected. Each starts photosynthesis with the diagnostic skipped and reduced motion enabled.

| Viewport | Document width | Reading canvas height | Dock bottom | Visible control height |
| --- | --- | --- | --- | --- |
| 320 × 500 | 320px | 246px | 500px | 44px |
| 375 × 480 | 375px | 226px | 480px | 44px |
| 1280 × 900 | 1280px | 658px | 900px | 44px |

No horizontal overflow or dock clipping was found in these states. The compact mobile route, independently scrollable teaching area, and persistent composer retain useful reading space. Desktop uses a 264px route rail and a constrained reading column. On short phones, the first explanation continues below the reading viewport and is reached by scrolling; this is expected, not missing content. Existing tests also cover expanded route, long edited example drafts, clarification controls, failed save notices, and recap reading space; the coordinator records their current run results separately.

## Contrast findings

Calculated relative luminance from canonical sRGB tokens (WCAG formula), without claiming a full rendered-page audit:

| Pair | Ratio |
| --- | --- |
| Muted / surface | 6.14:1 |
| Muted / ivory | 5.72:1 |
| Focus / surface | 6.53:1 |
| Focus / ivory | 6.09:1 |
| Navy / gold | 9.58:1 |
| Orbit / navy | 6.01:1 |
| Success / surface | 5.81:1 |
| Danger / surface | 5.54:1 |
| Warning / surface | 5.70:1 |

These selected normal-text pairs exceed 4.5:1. One concrete hardening gap was identified: the enabled, idle textarea border is computed as `rgb(215,219,227)` on `rgb(255,253,248)`, only **1.37:1**. The placeholder is `rgba(0,0,0,.25)`, composited at approximately **1.83:1** against that surface. The composer has no contrasting fill outside the border. Recommended minimal correction is `components.Input.colorBorder` and `components.Input.colorTextPlaceholder` set to the existing muted token, producing 6.14:1 on surface without changing decorative card borders. Keep hover/active focus tokens. Disabled controls such as empty-message Send are not this finding and are exempt from these contrast criteria. Re-measure after any correction; the screenshots here record the pre-correction state.

## Keyboard, semantics, motion, and non-color evidence

- Keyboard activation of Continue with Enter moved to “Your turn” and programmatically focused its heading (`document.activeElement` verified). A Shift+Tab probe from the empty composer reached Continue. Its computed focus outline was solid 3px; Ant Design overrides the global focus color with navy on this gold control. A full sequential keyboard and screen-reader audit remains outside this probe.
- Under reduced motion, computed animation and transition durations were `0.00001s`; CSS also disables smooth scrolling and repeated animation, and the Ant theme receives its motion preference. Screens were stable under this setting.
- The start topic, confusion and focus controls have associated visible labels. The session composer has an associated screen-reader label, “Message StudyFellow.” Buttons have text names; example path selection uses `aria-pressed` and route position uses `aria-current="step"`.
- Route states explicitly say Current step, Completed, Skipped, Added or Next. Answer evidence says Shown / Not yet clear; save failures and uncertainty have text. These meanings do not rely on color alone.
- The energy-flow figure has a descriptive accessible name, visible labels, caption and adjacent text equivalent. Decorative SVG icons are hidden from assistive technology. The missing-picture branch preserves explanatory text and sources; regression results are recorded by the coordinator.

## Acceptance and limits

Retain the current visual system and layout; no redesign, added assets or dependencies is needed. Close the input contrast gap, rerun the affected checks, and have the independent reviewer assess the final implementation. The inspected layout and selected text colors otherwise reveal no consequential visual blocker.

Physical phone/software-keyboard behavior, zoom/reflow beyond these widths, high-contrast/forced-color modes, screen-reader announcements and complete rendered-element contrast are not established by this audit. Teammate and automated walkthroughs do not count as target-learner observation.

## Resolution recorded by coordinator

The engineer applied the scoped Input border/placeholder tokens. All six new desktop/mobile keyboard/reset/contrast regressions passed, and final production passed 88 checks with four expected development-only skips. The independent reviewer directly re-measured the final composer at approximately 6.14:1 and inspected all three post-fix layouts. [Final evidence](evidence.md), [independent approval](review.md). Original screenshots and measurements above remain the pre-fix audit record.
