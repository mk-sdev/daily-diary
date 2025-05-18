import { getNote } from '@/asyncstorage'
import { useFocusEffect } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, StatusBar, Text, View } from 'react-native'

export default function HomeScreen() {
  const [notes, setNotes] = useState<{ date: string; text: string }[]>([])
  useFocusEffect(
    React.useCallback(() => {
      ;(async () => {
        setNotes((await getNote('notes')) || [])
      })()
    }, [])
  )
  // AsyncStorage.clear()
  return (
    <FlatList
      style={{ height: '100%', marginTop: StatusBar.currentHeight }}
      data={notes}
      keyExtractor={item => item.date}
      renderItem={({ item }) => (
        <View
          style={{
            elevation: 1,
            backgroundColor: '#121212',

            // borderWidth: 1,
            // borderColor: 'rgb(28, 38, 42)',
            margin: 10,
            padding: 5,
            borderRadius: 10,
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontWeight: 'bold', color: '#eee' }}>{item.date}</Text>
          <Text style={{ color: 'silver' }}>{item.text}</Text>
        </View>
      )}
    />
  )
}
