import express from 'express';

import ExampleController from './Controllers/ExampleController';
import ExampleAuthorize from './Middleware/ExampleAuthorize';
import ExampleRequests from './Requests/ExampleRequests';

const exampleController = new ExampleController();
const exampleAuthorize = new ExampleAuthorize();
const router = express.Router();

router.get(
  '/',
  exampleAuthorize.handleAuthorization('listExamples'),
  ExampleRequests.rules(),
  exampleController.callMethod('listExamples')
);

export default router;
