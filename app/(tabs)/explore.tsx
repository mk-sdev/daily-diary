import { getNote, removeNote, saveNote } from '@/asyncstorage'
import { useFocusEffect } from '@react-navigation/native'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Button, StyleSheet, Text, TextInput } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TabTwoScreen() {
  const [text, setText] = React.useState('')
  const [originalText, setOriginalText] = useState('') // Nowy stan przechowujący oryginalny tekst
  const [date, setDate] = React.useState(new Date())
  const [open, setOpen] = React.useState(false)
  const [noteExists, setNoteExists] = useState(false)
  const { note: noteString } = useLocalSearchParams()

  useFocusEffect(
    React.useCallback(() => {
      console.log(noteString)
    }, [noteString])
  )

  const checkNoteForDate = async () => {
    const notes = await getNote('notes')
    if (Array.isArray(notes)) {
      const pickedDate = date.toLocaleDateString('pl-PL')
      const existingNote = notes.find(note => note.date === pickedDate)
      if (existingNote) {
        setText(existingNote.text)
        setOriginalText(existingNote.text) // Ustawienie oryginalnego tekstu
        setNoteExists(true)
      } else {
        setText('')
        setOriginalText('') // Brak notatki - resetujemy oryginalny tekst
        setNoteExists(false)
      }
      return existingNote || null
    }
  }

  useEffect(() => {
    checkNoteForDate()
  }, [date])

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
            else setText(originalText) // Przywrócenie oryginalnego tekstu
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
            await removeNote(date.toLocaleDateString('pl-PL'))
            setText('')
            setNoteExists(false)
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
        mode="date"
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false)
          setDate(date)
          console.log(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
      <Text style={{ fontSize: 20 }} onPress={() => setOpen(true)}>
        {date.toLocaleString('pl-PL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        })}
      </Text>
      <TextInput
        style={styles.textArea}
        multiline={true}
        numberOfLines={4}
        onChangeText={setText}
        value={text}
        placeholder="Wpisz coś tutaj..."
        textAlignVertical="top"
      />
      <Button
        title="zapisz notatkę"
        onPress={() =>
          text ? saveNote({ date: date.toLocaleDateString('pl-PL'), text }) : Alert.alert("Nie można dodać pustej notatki")
        }
      />
      <Button
        title="resetuj zmiany"
        color="orange"
        onPress={handleReset}
        disabled={isResetButtonDisabled} // Przyciski resetowania będą nieaktywne, jeśli nie ma zmian
      />

      {noteExists && (
        <Button title="usuń notatkę" color="red" onPress={handleRemove} />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  textArea: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
  },
})
