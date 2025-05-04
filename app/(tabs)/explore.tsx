import { getNote, saveNote } from '@/asyncstorage'
import { useFocusEffect } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Alert, Button, StyleSheet, Text, TextInput } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TabTwoScreen({
  route,
}: {
  route: { params: { dateParam: string } }
}) {
  const [text, setText] = React.useState('')

  const [date, setDate] = React.useState(new Date())
  const [open, setOpen] = React.useState(false)

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // ;(async () => {
  //     console.log(route?.params)
  //     if (route) {
  //       Alert.alert(route.toString())
  //     }
  //     // })()
  //   }, [])
  // )

  useEffect(() => {
    const checkNoteForDate = async () => {
      const notes = await getNote('notes')
      if (Array.isArray(notes)) {
        const pickedDate = date.toLocaleDateString('pl-PL') // lub dowolny spójny format, jak ISO
        const existingNote = notes.find(note => note.date === pickedDate)
        if (existingNote) {
          setText(existingNote.text)
        }
      }
    }

    checkNoteForDate()
  }, [date])

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
        textAlignVertical="top" // ważne dla Androida, żeby tekst zaczynał się od góry
      />
      <Button
        title="zapisz notatkę"
        onPress={() =>
          saveNote('notes', { date: date.toLocaleDateString('pl-PL'), text })
        }
      ></Button>
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
