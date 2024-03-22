import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './src/routes/authRoutes.js';
import groupRoutes from './src/routes/groutpRoutes.js';
import messageRoutes from './src/routes/messageRoute.js';

import db from './src/models/index.js';

const app = express();
const port = 8080;

app.use(bodyParser.json());

db.sequelize.sync();

app.use('/auth', authRoutes);
app.use('/group', groupRoutes);
app.use('/message', messageRoutes);

app.listen(port, () => {
    console.log(`Server is running`);
});