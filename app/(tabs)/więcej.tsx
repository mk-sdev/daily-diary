import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, ScrollView, StyleSheet, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// import * as Clipboard from 'expo-clipboard'

export default function More() {
  const [ip, setIp] = useState<string>('192.168.247.1')

  const [data, setData] = useState('')

    useFocusEffect(
      useCallback(() => {
        let isActive = true

        const loadData = async () => {
          try {
            let stored = await AsyncStorage.getItem('notes')
            stored = stored
              ? JSON.stringify(JSON.parse(stored), null, 2)
              : 'Brak danych'
            if (isActive) setData(stored)
          } catch (e) {
            if (isActive) setData('Błąd przy wczytywaniu danych')
          }
        }

        loadData()

        return () => {
          isActive = false // cleanup jeśli screen zniknie
        }
      }, [])
    )

  return (
    <SafeAreaView
      style={{
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 50,
        gap: 20,
      }}
    >
      <TextInput
        style={{ color: 'silver', fontSize: 20 }}
        value={ip}
        onChangeText={value => setIp(value)}
      ></TextInput>
      <Button
        color={'#4f478c'}
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

      <ScrollView>
        <TextInput
          style={styles.textarea}
          multiline
          editable={true} // użytkownik może zaznaczać i kopiować
          value={data}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

  textarea: {
    minHeight: 300,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top', // dla Androida, aby tekst zaczynał się od góry
    color: 'white'
  },
})
