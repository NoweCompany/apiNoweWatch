import app from './app'
import "dotenv/config";

const port = process.env.PORT ?? 3300

app.listen(port, () => { console.log(`Server is running: http://localhost:${port}`) })
