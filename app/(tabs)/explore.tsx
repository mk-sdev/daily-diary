import React from 'react'
import { StyleSheet, Text, TextInput } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TabTwoScreen() {
  const [text, setText] = React.useState('')

  const [date, setDate] = React.useState(new Date())
  const [open, setOpen] = React.useState(false)

  function formatDate(date: Date): string {
    const dniTygodnia = [
      'niedziela',
      'poniedziałek',
      'wtorek',
      'środa',
      'czwartek',
      'piątek',
      'sobota',
    ]

    const miesiace = [
      'stycznia',
      'lutego',
      'marca',
      'kwietnia',
      'maja',
      'czerwca',
      'lipca',
      'sierpnia',
      'września',
      'października',
      'listopada',
      'grudnia',
    ]

    const dzienTygodnia = dniTygodnia[date.getDay()]
    const dzien = date.getDate()
    const miesiac = miesiace[date.getMonth()]
    const rok = date.getFullYear()

    return `${dzienTygodnia} ${dzien} ${miesiac} ${rok}`
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
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
      <Text style={{ fontSize: 20 }} onPress={() => setOpen(true)}>
        {formatDate(date)}
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20
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
