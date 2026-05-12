import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import useDecisionStore from "../../store/useDecisionStore";

export function AppHeader() {
  const setHasSeenOnboarding = useDecisionStore((s) => s.setHasSeenOnboarding);
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}></View>
      <Text style={styles.title}>PicSwipe</Text>

      <Pressable
        onPress={() => setHasSeenOnboarding(false)}
        style={{ flex: 1, alignItems: "flex-end", paddingHorizontal: 12 }}
      >
        <Ionicons
          name="information-circle"
          color={"white"}
          size={30}
        ></Ionicons>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.green.light,
    paddingVertical: 8,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.green.border,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "white",
  },
});
