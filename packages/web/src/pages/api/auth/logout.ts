import handler from 'server/middleware/api-route'

export default handler().get((req, res) => {
  req.logout()
  res.redirect('/')
})
