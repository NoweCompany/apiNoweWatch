import 'dotenv/config'

import app from './app'

const port = process.env.PORT ?? 3300

app.listen(port, () => {
  console.log(`Server is running: http://localhost:${port}`)
})
