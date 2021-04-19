const express = require('express');
const { UsersController, PatientsController, RequestsController } = require('./../server/controllers');
const router = express.Router();

/**
* @swagger
* /patients/:
*  get:
*      description: get all patients in DB
*      parameters: none
*      responses:
*          200:
*              description: success call to the endpoint returns all patients in DB
*          500:
*              description: error call to the endpoint 
*/
router.get('/', RequestsController.getAll);

/**
 * @swagger
 * /patients/:
 *  post:
 *      description: create a new book and save it in DB
 *      parameters: 
 *        - in: body
 *          name: id
 *          description: book id
 *          schema:
 *              type: string
 *        - in: body
 *          name: publishedDate
 *          description: book's published date
 *          schema:
 *              type: string
 *        - in: body
 *          name: authors
 *          description: book's authors
 *          schema:
 *              type: array
 *        - in: body
 *          name: categories
 *          description: book's categories
 *          schema:
 *              type: array
 *        - in: body
 *          name: pageCount
 *          description: book's pageCount
 *          schema:
 *              type: number
 *        - in: body
 *          name: description
 *          description: book description
 *          schema:
 *              type: string
 *        - in: body
 *          name: averageRating
 *          description: average rating
 *          schema:
 *              type: number
 *        - in: body
 *          name: imageLink
 *          description: book cover image link 
 *          schema:
 *              type: string
 *        - in: body
 *          name: previewLink
 *          description: ebook preview link
 *          schema:
 *              type: string
 *      responses:
 *          200:
 *              description: success call to the endpoint returns book saved
 *          500:
 *              description: error call to the endpoint 
 */
router.post('/', RequestsController.create);

module.exports = router;