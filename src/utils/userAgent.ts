import { UAParser } from 'ua-parser-js'

const parser = new UAParser(window.navigator.userAgent)
const { type } = parser.getDevice()
const platform = parser.getOS().name
const isIOS = platform === 'iOS'
export const isNonIOSPhone = !isIOS && type === 'mobile'
