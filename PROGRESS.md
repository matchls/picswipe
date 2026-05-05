# PicSwipe - Progression du projet

**Date de démarrage:** 2026-04-29  
**Dernière mise à jour:** 2026-05-05 (Steps 1-27 complétés)
**Developer:** Mathieu (débutant, 10 semaines MERN)

---

## ✅ Ce qui est FAIT

### Phase 1: Fondations

- ✅ **Step 1:** Configurer Expo Router et les onglets
- ✅ **Step 2:** Créer `src/services/photos.service.ts`
- ✅ **Step 3:** Afficher une photo dans index.tsx
- ✅ **Step 4:** Créer `usePhotoLibrary` hook
- ✅ **Step 5:** FlatList avec pagination

### Phase 2: Affichage

- ✅ **Step 6:** Créer `SwipeCard` component (Image + boutons Garder/Supprimer)

### Phase 3: Swipe (CORE)

- ✅ **Step 7:** GestureDetector + Gesture.Pan() validé (logs translationX)
- ✅ **Step 8:** `useSwipeGesture` hook extrait de SwipeCard
- ✅ **Step 9:** Animation translateX avec `useAnimatedStyle` (thread UI natif)
- ✅ **Step 10:** Retour élastique (`withSpring`) ou envol (`withTiming`) selon seuil 150px
- ✅ **Step 11:** Rotation de la carte + labels GARDER/SUPPRIMER animés

### Phase 4: Persistance

- ✅ **Step 12:** Zustand store (`useDecisionStore`) avec `toKeep` et `toDelete`
- ✅ **Step 13:** Swipe connecté au store via `runOnJS` (bridge UI thread → JS thread)

### Phase 5: Review + Suppression

- ✅ **Step 14:** Écran Review avec grille de miniatures (photos à supprimer)
- ✅ **Step 15:** Suppression réelle avec `MediaLibrary.deleteAssetsAsync`

### Phase 6: Polish + Nouvelles fonctionnalités

- ✅ **Step 16:** Fix labels — positionnés en dehors de l'`Animated.View`, restent fixes pendant le swipe
- ✅ **Step 17:** Une photo à la fois — remplace FlatList, avance au swipe via `onSwipeComplete` callback
- ✅ **Step 18:** Dossiers par mois/année — `groupPhotosByMonth()` retourne des sections pour `SectionList`
- ✅ **Step 18b:** Grille de dossiers — 2 colonnes par année, icônes Ionicons, chunk() helper
- ✅ **Step 19:** Annuler une décision — `removeFromDelete(id)` dans le store, tap sur miniature dans Review
- ✅ **Step 20:** Bannière de stats — total photos, suppressions cumulées, espace récupéré (estimé 3Mo/photo sur Android)
- ✅ **Step 21:** Haptic feedback — `expo-haptics` avec guard `hasFiredHaptic` (une vibration par franchissement de seuil)
- ✅ **Step 22:** SwipeCard redesign — 90% largeur / 65% hauteur via `useWindowDimensions`, `borderRadius: 16`
- ✅ **Step 23:** Labels GARDER/SUPPRIMER — fond semi-opaque coloré, rotation style tampon, texte agrandi
- ✅ **Step 24:** Confirmation + spinner avant suppression — `Alert.alert()` + `isDeleting` avec `ActivityIndicator`
- ✅ **Step 25:** Miniatures dans les dossiers — `photos[0].uri` remplace l'icône dossier jaune
- ✅ **Step 26:** État vide dans Review — icône + message quand `toDelete` est vide
- ✅ **Step 27:** Barre de progression — remplace le compteur X/Y par une barre horizontale sous la carte
- ✅ **Step 28:** Bouton Retour avec icône `arrow-back` Ionicons
- ✅ **Step 29:** Undo dernier swipe — `lastDecision` dans le store + bouton Annuler, `useMemo` sur styles SwipeCard
- ✅ **Step 30:** Badge sur l'onglet Review — `tabBarBadge` avec `toDelete.length`
- ✅ **Step 31:** Système de couleurs — `src/theme/colors.ts`, toutes les couleurs centralisées

---

## 📁 Structure du projet

```
picswipe/
├── app/
│   ├── _layout.tsx                 ✅ GestureHandlerRootView + Stack
│   └── (tabs)/
│       ├── _layout.tsx             ✅ Config tabs
│       ├── index.tsx               ✅ Swiper — grille dossiers + vue swipe + stats
│       └── review.tsx              ✅ Grille photos à supprimer + suppression
├── src/
│   ├── services/
│   │   └── photos.service.ts       ✅ getPhotosFromLibrary, groupPhotosByMonth
│   ├── hooks/
│   │   ├── usePhotoLibrary.ts      ✅ Charge toutes les photos
│   │   └── useSwipeGesture.ts      ✅ Pan gesture + spring/timing + runOnJS callbacks
│   ├── components/
│   │   └── ui/
│   │       └── SwipeCard.tsx       ✅ Carte animée + labels GARDER/SUPPRIMER
│   └── store/
│       └── useDecisionStore.ts     ✅ toKeep, toDelete, stats suppression
├── app.json                        ✅ newArchEnabled: true
├── package.json                    ✅ Dépendances installées
└── PROGRESS.md                     ← Tu es là
```

---

## 📦 Stack & Conventions

**Stack:**
- React Native 0.81.5
- Expo 54.0.33
- Expo Router 6.0.23
- TypeScript 5.9.2
- Zustand 5.0.12
- React Native Gesture Handler 2.28.0
- React Native Reanimated 4.1.1
- AsyncStorage 2.2.0
- Expo Media Library 18.2.1
- @expo/vector-icons 15.0.3

**Conventions de code:**
- camelCase pour tous les noms de variables/fonctions
- Variables en anglais
- Commentaires en anglais (uniquement quand c'est utile)
- Noms explicites (`photosToDelete` pas `ptd`)
- Pas d'over-engineering : code lisible avant perfect

**Approche:**
- L'utilisateur code, Claude guide (instructions, pas de code)
- Débug : exploration codebase, puis solutions
- Focus sur apprentissage React Native (gestes, animations, permissions)

---

## 🎯 Concepts clés maîtrisés

1. **Thread JS vs UI Thread** — Reanimated anime sur le thread natif, `runOnJS` pour revenir au JS
2. **Permissions mobiles** — `MediaLibrary.requestPermissionsAsync()`
3. **SharedValue + useAnimatedStyle** — Animations 60fps performantes
4. **Services vs Hooks** — Services = logique pure, Hooks = orchestration React
5. **Zustand store** — État global minimaliste sans boilerplate Redux
6. **Callbacks comme props** — Le parent décide quoi faire, l'enfant notifie
7. **key prop React** — Force le remount d'un composant pour réinitialiser son état
8. **Promise.all** — Appels API parallèles
9. **SectionList** — Listes avec headers de sections (années/mois)
10. **position: absolute** — Nécessite un parent avec dimensions explicites

---

## 🔧 Erreurs rencontrées et solutions

| Erreur | Cause | Solution |
|--------|-------|----------|
| `newArchEnabled` incompatible | reanimated@4.x nécessite nouvelle architecture | `newArchEnabled: true` dans app.json |
| `Unable to resolve "expo-linking"` | Dépendance transitive non installée | Ajouter `expo-linking` dans package.json |
| react/react-dom version conflict | react@19.1.0 vs react-dom@19.2.5 | `--legacy-peer-deps` à chaque install |
| Node version warnings | Node 18 < Node 20 requis | Mettre à jour Node via nvm |
| Crash au swipe (runOnJS) | Callback JS appelé depuis worklet UI | Wrapper avec `runOnJS(fn)()` |
| Labels bougent avec la carte | Labels dans l'Animated.View | Sortir les labels du Animated.View |
| Nouvelle photo invisible au swipe | React réutilise le composant, translateX figé | Ajouter `key={photo.id}` sur SwipeCard |
| `fileSize` non disponible sur Android | `getAssetsAsync` ne retourne pas fileSize | Estimation 3Mo/photo par défaut |
| `Cannot use JSX unless --jsx flag` | VS Code ne résout pas l'extends tsconfig | Ajouter `"jsx": "react-native"` dans tsconfig.json |

---

## 📚 Ressources utilisées

- [Expo Router Docs](https://docs.expo.dev/routing/introduction/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Expo Media Library](https://docs.expo.dev/media-library/overview/)
- [Expo Vector Icons](https://docs.expo.dev/guides/icons/)

---

## 🚀 Pistes d'amélioration futures

### Fonctionnalités
- ~~Optimiser le chargement initial (pagination plutôt que `first: 10000`)~~ ✅
- ~~Persistance du store entre sessions (zustand + AsyncStorage middleware)~~ ✅
- Animations de transition entre dossiers (en cours)
- ~~Aperçu de la photo en plein écran au tap~~ ⏭ Skipped
- Tester sur iOS (comportement `fileSize` potentiellement différent)

### 🔜 À implémenter

- ~~**Haptic feedback**~~ ✅ Step 21
- ~~**État vide dans Review**~~ ✅ Step 26
- ~~**Confirmation avant suppression**~~ ✅ Step 24
- **Undo dernier swipe** — bouton pour revenir à la photo précédente (historique dans le store)
- **Tout garder dans un dossier** — bouton pour skipper un dossier entier sans swiper chaque photo

### 🎨 Design & UX

**Fait**
- ~~**Carte de swipe**~~ ✅ Step 22
- ~~**Labels GARDER/SUPPRIMER**~~ ✅ Step 23
- ~~**Bouton Retour**~~ — Step 28 (en cours)
- ~~**Miniatures dans les dossiers**~~ ✅ Step 25
- ~~**Barre de progression**~~ ✅ Step 27
- ~~**Spinner pendant suppression**~~ ✅ Step 24

**Reste à faire**
- **Bannière de stats** — mettre en 2 cards côte à côte avec icônes plus grandes, séparées visuellement
- **Système de couleurs** — unifier les variantes de vert dans un fichier `src/theme/colors.ts`
- **Tab bar Review** — changer l'icône `trash-outline` pour `checkmark-circle-outline`, ajouter un badge avec `toDelete.length`

---

**Note:** Ce fichier est mis à jour après chaque phase complétée. Il sert de "sauvegarde" si le contexte Claude se compresse.
