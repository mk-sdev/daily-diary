import { getNote } from '@/asyncstorage'
import { useNavigation } from '@react-navigation/native'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const [notes, setNotes] = useState<{ date: string; text: string }[]>([])
  const router = useRouter()
  useFocusEffect(
    React.useCallback(() => {
      ;(async () => {
        setNotes((await getNote('notes')) || [])
        console.log(await getNote('notes'))
      })()
    }, [])
  )
  const navigation = useNavigation()
  // AsyncStorage.clear()
  return (
    <SafeAreaView>
      <FlatList
        data={notes}
        keyExtractor={item => item.date}
        renderItem={({ item }) => (
          <TouchableOpacity
            // onPress={() => {
            //   // Serializowanie obiektu do JSON i kodowanie go w URL
            //   const noteString = encodeURIComponent(JSON.stringify(item))
            //   router.push(`/explore?note=${noteString}`)
            // }}
          >
            <View
              style={{
                elevation: 1,
                backgroundColor: 'rgb(230, 230, 230)',
                borderWidth: 1,
                borderColor: 'rgb(190, 190, 190)',
                margin: 10,
                padding: 5,
                borderRadius: 10,
                paddingHorizontal: 10
              }}
            >
              <Text style={{fontWeight: 'bold'}}>{item.date}</Text>
              <Text>{item.text}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}