import express from 'express';
import contentful from './contentful';

const api = express.Router(); // eslint-disable-line
api.use('/contentful', contentful);

export default api;
