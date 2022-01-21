import express from 'express'

const app = express()

const PORT = 3000

app.get('/', (req, res) => {
  res.send('hello josh')
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`running @pairup/api on port: ${PORT}`)
})
