import express from 'express';
import cors from 'cors';
import aliensRouter from './routes/aliens';
import commentsRouter from './routes/comments';
import usersRouter from './routes/users';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/aliens', aliensRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/users', usersRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '¡Backend de Ben 10 funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
}); 