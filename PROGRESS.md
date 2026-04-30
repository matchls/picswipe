# PicSwipe - Progression du projet

**Date de démarrage:** 2026-04-29  
**Dernière mise à jour:** 2026-04-30 (Step 5 complete)
**Developer:** Mathieu (débutant, 10 semaines MERN)

---

## ✅ Ce qui est FAIT

### Phase 1: Fondations - Afficher une photo du téléphone

- ✅ **Step 1 COMPLETED:** Configurer Expo Router et les onglets
  - `app/_layout.tsx` créé avec GestureHandlerRootView et Stack
  - `app/(tabs)/_layout.tsx` créé avec Tabs navigation (2 onglets)
  - `app/(tabs)/index.tsx` créé avec écran "Swiper"
  - `app/(tabs)/review.tsx` créé avec écran "Review"
  - index.ts à la racine configuré avec `import 'expo-router/entry'`
  - App.tsx supprimé (plus nécessaire avec Expo Router)
  - App.json: `newArchEnabled: false` (résout erreur Android)
  - Erreur "@react-native-masked-view" résolue avec `npm install`

- ✅ **Step 2 COMPLETED:** Créer `src/services/photos.service.ts`
  - Fonctions `getPhotosFromLibrary()` et `getPhotoById()` implémentées
  - Gestion des permissions avec MediaLibrary.requestPermissionsAsync()

- ✅ **Step 3 COMPLETED:** Afficher une photo dans index.tsx
  - useState<Asset[]> pour stocker les photos
  - useEffect pour charger au mount
  - Affichage conditionnel (loading, erreur, photo)
  - Une vraie photo du téléphone s'affiche!

- ✅ **Step 4 COMPLETED:** Créer usePhotoLibrary hook
  - Extraction de la logique photo loading de index.tsx dans src/hooks/usePhotoLibrary.ts
  - Hook retourne { photos, isLoading, error }
  - index.tsx simplifié avec le hook

- ✅ **Step 5 COMPLETED:** FlatList avec pagination
  - Remplacé <Image> unique par <FlatList> dans index.tsx
  - keyExtractor: (photo) => photo.id
  - renderItem affiche chaque photo (300x400)
  - 20 photos chargées initialement

---

## ⏳ À FAIRE (ordre d'exécution)

### Phase 2: Affichage des photos

- 🔄 **Step 6 IN PROGRESS:** Créer SwipeCard component

### Phase 3: Swipe (CORE)

- Step 7: PanGestureHandler basique
- Step 8: useSwipeGesture hook
- Step 9: Animations avec reanimated
- Step 10: Retour élastique (spring)
- Step 11: Rotation et labels

### Phase 4: Persistance

- Step 12: Zustand store
- Step 13: AsyncStorage service
- Step 14: useDecisionStore hook
- Step 15: Connecter swipe à persistance

### Phase 5: Review + Suppression

- Step 16: app/(tabs)/review.tsx
- Step 17: PhotoGrid component
- Step 18: getMultiplePhotos() fonction
- Step 19: Afficher images sur review
- Step 20: deletePhotosFromDevice() vraie suppression

### Phase 6: Polish

- Step 21: Feedback visuel banner
- Step 22: Edge cases (lib vide, permission refusée)
- Step 23: Constantes (layout.ts, colors.ts)
- Step 24: Tester sur device réel

---

## 📁 Structure du projet (créée)

```
picswipe/
├── app/
│   ├── _layout.tsx                 ✅ Racine avec providers
│   └── (tabs)/
│       ├── _layout.tsx             ✅ Config tabs
│       ├── index.tsx               ✅ Écran Swiper
│       └── review.tsx              ✅ Écran Review
├── src/
│   ├── services/
│   │   └── photos.service.ts       🔄 EN COURS
│   ├── hooks/
│   ├── components/
│   │   ├── ui/
│   │   └── features/
│   ├── store/
│   ├── types/
│   │   └── index.ts
│   └── constants/
│       ├── layout.ts
│       └── colors.ts
├── assets/
├── app.json                        ✅ Configuré
├── tsconfig.json
├── package.json                    ✅ Dépendances installées
├── index.ts                        ✅ Configuré
├── PROGRESS.md                     ← Tu es là
└── CLAUDE.md                       (sera créé bientôt)
```

---

## 📦 Stack & Conventions

**Stack:**

- React Native 0.81.5
- Expo 54.0.33
- Expo Router 55.0.13
- TypeScript 5.9.2
- Zustand 5.0.12
- React Native Gesture Handler 2.31.1
- React Native Reanimated 4.3.0
- AsyncStorage 3.0.2
- Expo Media Library 55.0.15

**Conventions de code:**

- camelCase pour tous les noms de variables/fonctions
- Variables en anglais
- Commentaires en anglais (uniquement quand c'est utile)
- Noms explicites (pas d'abréviations: `photosToDelete` pas `ptd`)
- Pas d'over-engineering: code lisible avant perfect

**Approche:**

- L'utilisateur code, Claude guide (instructions, pas de code)
- Débug: exploration codebase, puis solutions
- Focus sur apprentissage React Native spécifique (gestes, animations, permissions)

---

## 🎯 Concepts clés à maîtriser

1. **Thread JS vs UI Thread** - Reanimated anime sur le thread natif
2. **Permissions mobiles** - MediaLibrary.requestPermissionsAsync()
3. **FlatList vs ScrollView** - Virtualisation pour grandes listes
4. **Flexbox layout** - Seul système de layout disponible
5. **SharedValue + useAnimatedStyle** - Animations 60fps performantes
6. **Services vs Hooks** - Services = logique pure, Hooks = orchestration React
7. **Zustand store** - État global minimaliste
8. **AsyncStorage** - Persistance clé/valeur du téléphone

---

## 🔧 Erreurs rencontrées et solutions

| Erreur                                                 | Cause                                                         | Solution                              |
| ------------------------------------------------------ | ------------------------------------------------------------- | ------------------------------------- |
| "java.lang.string cannot be cast to java.lang.boolean" | `newArchEnabled: true` incompatible avec certaines librairies | `newArchEnabled: false` dans app.json |
| "@react-native-masked-view" missing                    | Dépendance indirecte non installée                            | `npm install`                         |
| `app/index.tsx` conflictuelle                          | Routing confus avec app/(tabs)                                | Supprimer app/index.tsx               |

---

## 📚 Ressources utilisées

- [Expo Router Docs](https://docs.expo.dev/routing/introduction/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Expo Media Library](https://docs.expo.dev/media-library/overview/)

---

## 🚀 Prochaines étapes

1. **Terminer Step 2** → `src/services/photos.service.ts`
2. **Step 3** → Afficher une photo dans index.tsx
3. **Step 4-6** → FlatList et SwipeCard
4. **Step 7-11** → Le coeur du projet (swipe + animations)

---

**Note:** Ce fichier sera mis à jour après chaque phase complétée. Il sert de "sauvegarde" si le contexte Claude se compresse.
