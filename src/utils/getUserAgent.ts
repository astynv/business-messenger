import UAParser from 'ua-parser-js'

export default function getUserAgent (): string {
  const ua = new UAParser()

  const browser = ua.getBrowser().name
  const os = ua.getOS().name
  const device = ua.getDevice().model

  const uaStrings = [
    browser,
    os,
    device
  ].filter(s => s !== undefined) as string[]

  return uaStrings.join(' on ')
}
