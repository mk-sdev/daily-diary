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
    <View>
      <FlatList
        data={notes}
        keyExtractor={item => item.date}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              // Serializowanie obiektu do JSON i kodowanie go w URL
              const noteString = encodeURIComponent(JSON.stringify(item))
              router.push(`/explore?note=${noteString}`)
            }}
          >
            <View
              style={{
                elevation: 2,
                backgroundColor: 'beige',
                borderWidth: 1,
                margin: 10,
                padding: 5,
              }}
            >
              <Text>{item.date}</Text>
              <Text>{item.text}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
})
