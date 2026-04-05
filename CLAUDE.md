# CLAUDE.md — ReactNativeTemplate

## Project overview

Expo + React Native greenfield app targeting **Android and iOS**. Uses React Navigation for all routing (classically defined route stacks, not file-based routing). NativeWind for styling. Designed to run smoothly on low-end devices with slow CPUs and limited RAM.

---

## Tech stack

| Layer | Library | Version |
|---|---|---|
| Framework | Expo | ~55 |
| Navigation | React Navigation (stack + bottom tabs) | ^7 |
| Styling | NativeWind + Tailwind CSS | ^4 / ^3.4 |
| Animations | react-native-reanimated | ^4 |
| Gestures | react-native-gesture-handler | ~2.30 |
| Worklets | react-native-worklets | ~0.7 |
| Data fetching | TanStack Query (react-query) + Axios | latest |
| Language | TypeScript (strict) | ~5.9 |

Always prefer the latest compatible version within each major when adding new packages. Check the Expo SDK 55 compatibility table before adding a new dependency.

---

## Routing

- **Define all routes explicitly as a typed stack** using React Navigation (`createNativeStackNavigator`, `createBottomTabNavigator`, etc.). Do not rely on file-system conventions.
- Define a root navigator (e.g. `src/navigation/RootNavigator.tsx`) that composes all navigators.
- Declare a `RootStackParamList` (and sub-navigator param lists) in `src/types/navigation.ts`. Every screen and its params must be typed — no untyped screen names or `any` params.
- Use `useNavigation<NavigationProp<RootStackParamList>>()` and `useRoute<RouteProp<RootStackParamList, 'ScreenName'>>()` for typed access inside screens.
- Pass route params explicitly; never use global state as a substitute for navigation params.

---

## TypeScript rules

- Strict mode is on (`"strict": true` in tsconfig). Never disable it.
- **Never use `any`.** Use `unknown` and narrow, or model the shape properly.
- Use utility types — `Pick`, `Omit`, `Partial`, `Required`, `ReturnType`, `Parameters`, `Extract`, `Exclude` — instead of re-declaring types by hand.
- **Use generic types** when a function, hook, or component works identically over multiple types (e.g. `function useApi<T>(url: string): UseQueryResult<T>`). Generics make intent clear and eliminate duplicate code.
- Use discriminated unions and type guards (`is` predicates) for branching on variant shapes.
- Use `as const` for static lookup objects (see `Colors`, `Spacing` in `src/constants/theme.ts`).
- Prefer `type` aliases over `interface` unless declaration merging is needed.
- Props types that are only used by one component stay in that component's file. Types shared across more than one file live in a dedicated `src/types/` file.
- Path alias `@/*` maps to `src/*`. Use it everywhere; never use relative `../../` imports across feature boundaries.

---

## Styling

- **Use NativeWind Tailwind classes as the primary styling mechanism.** Reach for `className` first.
- Fall back to `StyleSheet.create` only when a style cannot be expressed as a Tailwind class (e.g. dynamic interpolated values, platform-specific numeric layout math like `BottomTabInset`).
- Do not mix `className` and inline `style` on the same element unless unavoidable.
- Spacing tokens are defined in `src/constants/theme.ts` (`Spacing.*`). Use them in `StyleSheet` fallbacks; use the equivalent Tailwind scale in `className`.
- Colors are defined in `src/constants/theme.ts` (`Colors.light / Colors.dark`). Extend the Tailwind theme in `tailwind.config.js` to expose custom colors so they can be used in `className`.
- Dark mode is driven by `useColorScheme` / `useTheme`. When using NativeWind, use the `dark:` variant.

---

## Responsiveness

- The app targets **Android and iOS across phone and tablet sizes**. Always design for multiple screen widths.
- Use `MaxContentWidth = 800` (from `src/constants/theme.ts`) to constrain content on wider screens. Centre it with `flex-row` + `justifyContent: center` on the outer container.
- Use Tailwind responsive modifiers (`sm:`, `md:`, `lg:`) where NativeWind supports them, or use `useWindowDimensions` for imperative breakpoints.
- Never hard-code pixel widths or heights for UI elements. Use flex, `%`, or Tailwind size classes.
- Always test layout changes against both a phone-sized viewport (~390 pt) and a tablet-sized viewport (~768 pt).

---

## Safe areas and notches

- **Always** use `SafeAreaView` from `react-native-safe-area-context` (never the built-in one) to account for notches, Dynamic Island, status bars, and navigation bars on both Android and iOS.
- Use `useSafeAreaInsets()` for fine-grained control when `SafeAreaView` is too coarse (e.g. applying insets to a specific edge only).
- Never assume fixed status-bar or nav-bar heights. Always derive them from the safe area context.
- On screens with a bottom tab bar, add the tab bar height to the bottom inset so content is never obscured.

---

## Forms and keyboard handling

- **Every form must be scrollable.** Wrap form content in `KeyboardAwareScrollView` (from `react-native-keyboard-aware-scroll-view`) so that the keyboard never covers input fields.
- The currently focused input must automatically scroll into view. Ensure `enableOnAndroid` and `extraScrollHeight` are set appropriately for each form.
- Use `keyboardShouldPersistTaps="handled"` on scroll views so taps on buttons while the keyboard is open are not dropped.
- Set `returnKeyType` and `onSubmitEditing` to allow users to advance through fields without touching the screen.
- Dismiss the keyboard on form submission or on background tap (`Keyboard.dismiss()`).
- Never render a submit button in a fixed position that the keyboard can cover.

---

## Data fetching

- **All API calls go through Axios + TanStack Query.** Never use `fetch` directly for remote data.
- Define typed Axios service functions in `src/services/` (e.g. `src/services/user.ts`). Functions must be generic where the response shape varies: `async function getUser<T extends UserBase>(id: string): Promise<T>`.
- Use `useQuery` for reads and `useMutation` for writes. Keep query keys in a central `src/constants/queryKeys.ts` file to avoid string duplication and enable precise invalidation.
- Handle loading, error, and empty states explicitly in every consumer of a query.
- Do not use `useEffect` to trigger data fetching — let TanStack Query manage that lifecycle.

---

## useEffect discipline

- **Avoid `useEffect` wherever possible.** Most side-effect needs can be served by:
  - TanStack Query (data fetching, background refetch)
  - Event handlers (user interactions)
  - `useMemo` / `useCallback` (derived state)
  - React Navigation lifecycle events (`useFocusEffect`)
- When `useEffect` is genuinely necessary:
  - Audit every dependency carefully. Ask: does this value actually need to re-trigger the effect, or is it just needed inside it? Use a ref to read without subscribing when appropriate.
  - **Always return a cleanup/destroy function** if the effect starts a subscription, timer, animation, event listener, or any async operation that could complete after unmount.
  - Keep effects small and single-purpose. Split unrelated logic into separate effects.
  - Never use an empty dependency array `[]` without documenting why — it is often a bug.

---

## State and context

- **Avoid React context for shared state.** Prefer local state, prop drilling for shallow trees, or a lightweight state manager (e.g. Zustand) for truly global state.
- If context is necessary, scope it as narrowly as possible — wrap only the subtree that actually needs it, not the entire app.
- Split context into multiple small providers so that changes to one slice do not re-render consumers of another.
- Memoize context values with `useMemo` to prevent re-renders from reference changes:
  ```tsx
  const value = useMemo(() => ({ user, logout }), [user, logout]);
  ```

---

## Performance — top priority

The app must run acceptably on low-end Android devices with slow CPUs and limited RAM. Treat performance as a first-class requirement.

### Memoization
- **Always** wrap callbacks passed as props in `useCallback`. No exceptions.
- **Always** wrap derived/computed values in `useMemo` when the computation is non-trivial or the result is passed as a prop.
- Wrap pure components in `React.memo` to prevent unnecessary re-renders from parent updates.
- Avoid creating objects/arrays/functions inline in JSX (`style={{ }}`, `onPress={() => ...}`).

### Avoiding unnecessary re-renders
- Use `useRef` for values that must persist across renders but should not trigger re-renders.
- Prefer local state over lifted state when state is only needed by a subtree.

### Offloading expensive work
- Run animations and gesture handling entirely on the UI thread using `react-native-reanimated` worklets (`useAnimatedStyle`, `useSharedValue`, `runOnUI`). Never drive animations from the JS thread.
- Move CPU-intensive logic (data parsing, sorting, transformation) to a worklet or background task so the main thread stays free for rendering.
- Expensive computations must be memoized — never recomputed on every render.
- Defer non-critical work with `InteractionManager.runAfterInteractions`.

### Lists
- Use `FlashList` (from `@shopify/flash-list`) instead of `FlatList` for all scrollable lists.
- Always provide `estimatedItemSize` and a stable `keyExtractor`.
- Keep list item components lightweight and memoized with `React.memo`.

---

## Platform differences

- Use `Platform.select` for platform-specific values (already used in `theme.ts`). Prefer the `.platform.tsx` file-suffix pattern for larger divergences.

---

## File structure

```
src/
  app/            # App entry point and providers
  navigation/     # Navigator definitions (RootNavigator, TabNavigator, ...)
  screens/        # One folder per screen
  components/     # Shared UI components
    ui/           # Primitive/base components
  constants/      # Theme tokens, query keys, etc.
  hooks/          # Custom React hooks
  services/       # Axios service functions (one file per domain)
  types/          # Shared TypeScript types
    navigation.ts # All param lists for React Navigation
  __tests__/      # Unit tests (mirror src structure inside this folder)
```

- One component per file. File name matches the exported component name in kebab-case.
- Co-locate component props type with the component unless the type is reused elsewhere.
- Hooks live in `src/hooks/`. Prefix with `use-`.

---

## Testing

- Write unit tests only when explicitly asked.
- Place tests in `src/__tests__/`, mirroring the source tree (e.g. `src/__tests__/components/themed-text.test.tsx`).
- Keep tests simple and focused — one logical behaviour per test.
- Use Jest and `@testing-library/react-native`. Do not add heavy testing frameworks unless asked.

---

## Component patterns

- Functional components only. No class components.
- Export named functions, not default arrow functions, so stack traces are readable.
- Accept and spread native element props (e.g. `TextProps`, `ViewProps`) where the component wraps a native primitive — see `ThemedText` / `ThemedView` as reference.
- Use `forwardRef` when consumers need to access the underlying native ref.

---

## Package management

- Use `expo install` (not plain `npm install`) for Expo-managed packages so version pinning is respected.
- **Never** install packages with `--force` or `--legacy-peer-deps`. Resolve peer dependency conflicts properly.
- **Never** run `npm audit fix --force`. Fix vulnerabilities by upgrading packages explicitly.
- Check Expo SDK 55 compatibility before adding any new dependency.
- Prefer packages with first-class TypeScript types (bundled or via `@types/…`).

---

## Linting & formatting

- ESLint via `eslint-config-expo` + `eslint-plugin-prettier`.
- Prettier handles formatting. Do not manually format code.
- Run `expo lint` before committing.
- `*.config.js` and `dist/*` are excluded from lint (see `eslint.config.js`).
