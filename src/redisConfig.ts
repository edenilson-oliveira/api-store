import { createClient } from 'redis';

const client = createClient()
client.connect()

client.on('error', (error) => {
  console.log(error)
})

export default client