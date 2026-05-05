import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import useDecisionStore from "../../src/store/useDecisionStore";
import { colors } from "../../src/theme/colors";

export default function TabLayout() {
  const toDeleteCount = useDecisionStore((s) => s.toDelete.length);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green.primary,
        tabBarInactiveTintColor: colors.green.border,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Swipper",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="images-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: "Review",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trash-outline" size={size} color={color} />
          ),
          tabBarBadge: toDeleteCount > 0 ? toDeleteCount : undefined,
        }}
      />
    </Tabs>
  );
}
