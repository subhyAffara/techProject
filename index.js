const express = require('express');
const userRoute = require('./routes/userRoutes')
const addressRoute = require('./routes/addressRoute')


const app = express()
const PORT = 8080
app.use(express.json())
//Routes
app.use('/users', userRoute);
app.use('/address', addressRoute);
app.listen(PORT, () => console.log(`app listing on http://localhost:${PORT}`));