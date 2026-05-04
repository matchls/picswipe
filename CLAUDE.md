# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start dev server (scan QR code with Expo Go on Android)
npm start

# Start directly on Android device/emulator
npm run android

# Install dependencies (always use --legacy-peer-deps due to react@19 peer conflicts)
npm install --legacy-peer-deps
```

No linter, formatter, or test suite configured.

## Architecture

PicSwipe is a React Native / Expo app for swiping through photos to decide what to keep or delete. Two tabs: **Swiper** (browse & swipe) and **Review** (confirm deletions).

### Data flow

```
MediaLibrary (device) → photos.service.ts → usePhotoLibrary hook → index.tsx
                                                                        ↓
                                                                  SwipeCard
                                                                        ↓
                                                              useSwipeGesture hook
                                                                        ↓
                                                              useDecisionStore (Zustand)
                                                                        ↓
                                                                  review.tsx → MediaLibrary.deleteAssetsAsync
```

### Key architectural points

**Threading with Reanimated** — animations run on the native UI thread. Any callback that touches React state must be wrapped with `runOnJS()`. This is the pattern used in `useSwipeGesture.ts` to call `addKeep`/`addDelete` from the gesture handler.

**Swipe gesture thresholds** — `useSwipeGesture` triggers a decision at `|translationX| > 100px`. Right = keep, left = delete. It calls `onSwipeRight`/`onSwipeLeft` to update the store, then `onSwipeComplete` after the fly-off animation finishes.

**Photo loading** — `usePhotoLibrary` paginates through the full library in the background (100 photos per page). The UI shows folders immediately after the first page loads; subsequent pages append to the list progressively.

**Folder grid** — `groupPhotosByMonth()` in `photos.service.ts` returns sections grouped by year → month. `index.tsx` then chunks months into rows of 3 for the grid display.

**Store persistence** — `useDecisionStore` uses Zustand `persist` middleware with AsyncStorage. Decisions (toKeep, toDelete) and cumulative stats (deletedCount, deletedSize) survive app restarts.

**`key` prop on SwipeCard** — `<SwipeCard key={photo.id} />` is intentional. It forces a full remount between photos, resetting the `translateX` shared value. Without it, the card stays in its animated position when the next photo loads.

**File size on Android** — `MediaLibrary.getAssetsAsync` does not return `fileSize` on Android. The review screen falls back to `3_000_000` bytes (3 MB) per photo when the field is missing.

### File layout

```
app/
  _layout.tsx          — GestureHandlerRootView (required for gesture handler) + Stack
  (tabs)/
    _layout.tsx        — Tab bar config
    index.tsx          — Folder grid + swipe view + stats banner
    review.tsx         — Grid of photos to delete + delete button
src/
  services/
    photos.service.ts  — MediaLibrary access, pagination, groupPhotosByMonth()
  hooks/
    usePhotoLibrary.ts — Loads all photos progressively, exposes {photos, isLoading, error}
    useSwipeGesture.ts — Pan gesture + spring/timing animations + runOnJS callbacks
  components/ui/
    SwipeCard.tsx      — Animated card with GARDER/SUPPRIMER labels
  store/
    useDecisionStore.ts — Zustand store (toKeep, toDelete, stats) persisted via AsyncStorage
```

## Developer profile

The developer is a junior coming from a 10-week bootcamp (La Capsule). Background: Node.js, Express, React, React Native + Expo. Trained in JavaScript, now learning TypeScript.

**Code style guidelines:**
- Write readable, junior-friendly code — not too clever, not over-engineered
- Add comments in English when the WHY is non-obvious
- Prefer explicit over implicit: clear variable names, simple logic
- Avoid advanced patterns the developer hasn't seen yet

**Workflow:**
- All code comments must be in English
- All git commits must be in English, using the format `type(scope): description` (e.g. `feat(store): add deletedCount tracking`)
- Remind the developer to commit after each feature implementation

## Important constraints

- `newArchEnabled: true` in `app.json` — required by Reanimated 4.x. Do not remove.
- `GestureHandlerRootView` must wrap the entire app at the root level for gestures to work.
- `npm install` always needs `--legacy-peer-deps` because react@19.1.0 conflicts with some peer dep declarations.
