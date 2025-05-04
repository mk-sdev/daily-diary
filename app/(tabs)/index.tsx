import { getValue } from '@/asyncstorage'
import { useFocusEffect } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'

export default function HomeScreen() {
  const [notes, setNotes] = useState<{ date: string; text: string }[]>([])
  useFocusEffect(
    React.useCallback(() => {
      ;(async () => {
        setNotes((await getValue('notes')) || [])
        console.log(await getValue('notes'))
      })()
    }, [])
  )

  return (
    <View>
      <FlatList
        data={notes}
        keyExtractor={item => item.date}
        renderItem={({ item }) => (
          <View style={{elevation: 2, backgroundColor: 'beige', borderWidth: 1, margin: 10, padding: 5}}>
            <Text>{item.date}</Text>
            <Text>{item.text}</Text>
          </View>
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
