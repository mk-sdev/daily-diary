import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState } from 'react'
import { Alert, Button, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function More() {
  const [ip, setIp] = useState<string>('192.168.247.1')

  return (
    <SafeAreaView
      style={{
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 50,
        gap: 20,
      }}
    >
      <TextInput value={ip} onChangeText={value => setIp(value)}></TextInput>
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
                  : 'http://' + ip + ':5000/upload',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                }
              )

              if (response.ok) Alert.alert('Poprawnie eksportowano notatki!')
              else Alert.alert('Wystąpił błąd, spórbuj ponownie.')
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
