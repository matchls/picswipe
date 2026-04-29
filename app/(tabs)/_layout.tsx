import { Tabs } from "expo-router";
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Swipper" }} />
      <Tabs.Screen name="review" options={{ title: "Review" }} />
    </Tabs>
  );
}
