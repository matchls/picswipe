import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export function AppHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>PicSwipe</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.green.light,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.green.border,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "white",
  },
});
