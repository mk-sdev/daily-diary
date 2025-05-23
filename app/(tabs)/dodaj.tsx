import { getNote, removeNote, saveNote } from '@/asyncstorage'
import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import DatePicker from 'react-native-date-picker'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TabTwoScreen() {
  const [text, setText] = React.useState('')
  const [originalText, setOriginalText] = useState('')
  const [date, setDate] = React.useState(new Date())
  const [open, setOpen] = React.useState(false)

  const checkNoteForDate = async () => {
    const notes = await getNote('notes')
    if (Array.isArray(notes)) {
      const pickedDate = date.toLocaleDateString('en-CA')
      const existingNote = notes.find(note => note.date === pickedDate)
      if (existingNote) {
        setText(existingNote.text)
        setOriginalText(existingNote.text)
      } else {
        setText('')
        setOriginalText('')
      }
      return existingNote || null
    }
  }

  useEffect(() => {
    checkNoteForDate()
  }, [date])

  const handleSaveNote = () => {
    if (text) {
      if (text !== originalText && originalText) {
        Alert.alert(
          'Potwierdzenie nadpisania',
          'Czy na pewno chcesz nadpisać notatkę?',
          [
            {
              text: 'Anuluj',
              style: 'cancel',
            },
            {
              text: 'Tak',
              onPress: async () => {
                saveNote({ date: date.toLocaleDateString('en-CA'), text })
                setOriginalText(text)
              },
            },
          ]
        )
      } else {
        saveNote({ date: date.toLocaleDateString('en-CA'), text })
        setOriginalText(text)
      }
    } else Alert.alert('Nie można dodać pustej notatki')
  }

  // Funkcja resetująca zmiany, z potwierdzeniem
  const handleReset = () => {
    Alert.alert(
      'Potwierdzenie resetowania',
      'Czy na pewno chcesz zresetować zmiany?',
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Tak',
          onPress: async () => {
            const val = await checkNoteForDate()
            if (!val) setText('')
            else setText(originalText)
          },
        },
      ]
    )
  }

  const handleRemove = () => {
    Alert.alert(
      'Potwierdzenie usunięcia',
      'Czy na pewno chcesz usunąć tę notatkę?',
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Tak',
          onPress: async () => {
            await removeNote(date.toLocaleDateString('en-CA'))
            setText('')
            setOriginalText('')
          },
        },
      ]
    )
  }

  // Sprawdzanie, czy tekst wprowadzony przez użytkownika różni się od oryginalnego
  const isResetButtonDisabled = text === originalText

  return (
    <SafeAreaView style={styles.container}>
      <DatePicker
        modal
        theme="dark"
        mode="date"
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false)
          setDate(date)
          // console.log(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
        locale="pl-PL"
        title="Wybierz datę"
        cancelText="anuluj"
        confirmText="zatwierdź"
        textColor="white"
        // color="white"
        // style={{ fontSize: 20, fontWeight: 'bold', color: 'silver' }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 20, color: 'silver' }} onPress={() => setOpen(true)}>
          {date.toLocaleString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            gap: 13,
            paddingRight: 15,
          }}
        >
          {originalText && (
            <TouchableOpacity
              style={{
                backgroundColor: isResetButtonDisabled
                  ? 'lightgray'
                  : '#fcd9b5',
                borderRadius: 50,
                padding: 7,
              }}
              onPress={handleReset}
              disabled={isResetButtonDisabled}
            >
              <AntDesign
                name="back"
                size={24}
                color={isResetButtonDisabled ? 'gray' : '#FF7F00'}
              />
            </TouchableOpacity>
          )}
          {originalText && (
            <TouchableOpacity onPress={handleRemove}>
              <Ionicons
                name="trash-sharp"
                size={24}
                color="red"
                style={{
                  backgroundColor: '#fcbabf',
                  borderRadius: 50,
                  padding: 7,
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TextInput
        style={styles.textArea}
        multiline={true}
        numberOfLines={4}
        onChangeText={setText}
        value={text}
        placeholder="Wpisz coś tutaj..."
        textAlignVertical="top"
        placeholderTextColor={'#999'}
      />
      <Button
        disabled={text === originalText}
        title="zapisz notatkę"
        onPress={() => handleSaveNote()}
        color={'#4f478c'}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
    flex: 1,
  },
  textArea: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    color: 'silver',
  },
})
