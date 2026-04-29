import { View, Text, SafeAreaView } from "react-native";

export default function SwiperScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Écran Swiper (photos ici)</Text>
      </View>
    </SafeAreaView>
  );
}
