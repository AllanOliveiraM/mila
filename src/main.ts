import yargs from 'yargs'
import fs from 'node:fs'
import _open from 'open'

import { key } from '../_key'

const argv = () =>
  yargs(process.argv.slice(2)).option('mode', {
    alias: 'm',
    describe: 'Modo de operação',
    demandOption: true,
    type: 'string',
    choices: ['encrypt', 'decipher'],
  }).argv

const read = () => fs.readFileSync('_input.txt').toString('utf-8')

const write = (data: string) => fs.writeFileSync('_output.txt', data)

const reverse = (from: Record<string, string>) =>
  Object.fromEntries(Object.entries(from).map(([key, value]) => [value, key]))

const open = (url: string) => _open(url)

const isUppercase = (char: string) => /^[A-Z]$/.test(char)

const isReverseUppercase = (char: string) => char.startsWith(key['UPPER'])

const clearCharCode = (charCode: string) => charCode.replace(key['UPPER'], '')

const encrypt = () => {
  const content = read()

  const charArray = content.split('')

  const outCharArray = charArray.map(char => {
    const upperCode = isUppercase(char) ? key['UPPER'] : ''

    return `${upperCode}${key[char.toLowerCase()] || char}`
  })

  write(outCharArray.join(key['STEPS']))
}

const decipher = () => {
  const reversedKey = reverse(key)

  const content = read()

  if (content.includes('OPEN_1')) {
    open(key['U1'])
  }

  if (content.includes('OPEN_2')) {
    open(key['U2'])
  }

  if (content.includes('OPEN_3')) {
    open(key['U3'])
  }

  if (content.includes('OPEN_4')) {
    open(key['U4'])
  }

  const charArray = content.split(key['STEPS'])

  const outCharArray = charArray.map(charCode => {
    const needUpper = isReverseUppercase(charCode)

    const clearedCharCode = clearCharCode(charCode)

    const resolvedChar = reversedKey[clearedCharCode] || charCode

    return needUpper ? resolvedChar.toUpperCase() : resolvedChar
  })

  write(outCharArray.join(''))
}

const init = async () => {
  const { mode } = await argv()

  switch (mode) {
    case 'encrypt':
      encrypt()

      break

    case 'decipher':
      decipher()

      break

    default:
      break
  }
}

init()
