import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { Button, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function more() {
  return (
    <SafeAreaView style={{justifyContent: 'center', flex:1}}>
      <Button
        title="wyślij"
        onPress={() => {
          const sendJson = async () => {
            let data = await AsyncStorage.getItem('notes')
            data = data ? JSON.parse(data) : '-'

            try {
              const response = await fetch(
                __DEV__
                  ? 'http://10.0.2.2:5000/upload'
                  : 'http://192.168.0.10:5000/upload',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                }
              )

              const text = await response.text()
              console.log('Odpowiedź serwera:', text)
            } catch (error) {
              console.error('Błąd wysyłania JSON-a:', error)
            }
          }
          sendJson()
        }}
      ></Button>
    </SafeAreaView>
  )
}
