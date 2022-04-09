import ws from 'ws'

export default async function * toWSMessages (ws: ws): AsyncGenerator<[string, ws]> {
  while (true) {
    const message = await new Promise<string | null>(resolve => {
      const disposableHandler = (message: string): void => {
        ws.removeListener('message', disposableHandler)
        resolve(message)
      }

      ws.on('message', disposableHandler)
      ws.on('close', () => resolve(null))
    })

    if (message === null) {
      return
    }

    yield [message, ws]
  }
}
