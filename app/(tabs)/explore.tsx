import { getNote, removeNote, saveNote } from '@/asyncstorage'
import { useFocusEffect } from '@react-navigation/native'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { Alert, Button, StyleSheet, Text, TextInput } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TabTwoScreen() {
  const [text, setText] = React.useState('')
  const [date, setDate] = React.useState(new Date())
  const [open, setOpen] = React.useState(false)
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
          },
        },
      ]
    )
  }

  // Funkcja usuwająca notatkę, z potwierdzeniem
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
            setText("")
          },
        },
      ]
    )
  }

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
          text && saveNote({ date: date.toLocaleDateString('pl-PL'), text })
        }
      />
      <Button title="resetuj zmiany" color="orange" onPress={handleReset} />
      <Button title="usuń notatkę" color="red" onPress={handleRemove} />
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
