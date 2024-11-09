import { NunitoText } from "@/components/text/NunitoText";
import { useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
export default function DutyTypeDetail (){
    const local = useLocalSearchParams();
    const dutyTypeId = local.id;
  
    return (
        <View>
            <NunitoText>DUty type detail screen, dutyTypeId = {dutyTypeId}</NunitoText>
        </View>
    )
}