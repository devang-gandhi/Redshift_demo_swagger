const express = require('express');
const app = express();
const Redshift = require('./extrapgtool');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

app.listen(5000, () => console.log(`server starts with redshift with pgtool...`));
app.use(express.json());
const swaggerOptions = {
    definition:{
        openapi : '3.0.0',
        info:{
            title : 'Demo PostgreSQL of AWS Redshift',
            version : '1.0.0',
            description : 'Demo of PostgreSQL with pg-promise using AWS Redshift (ElephantSQL free database)',
        },
    },
    apis : ['index.js']
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *  get:
 *      summary : get all records from database
 *      description : get all records from database
 *      responses:
 *          200:
 *              description : success
 *          400:
 *              description : Error of fetching data from database
 * 
 */

app.get('/', async (req, res) => {

    try {

        const query = 'select * from t_users';
        const data = await Redshift.executeQuery(query);

        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json(error);
    }
});

/**
 * @swagger
 * definitions:
 *  Insert_record:
 *      type: object
 *      properties:
 *          first_name:
 *              type: string
 *              description : first name to be inserted into database
 *              example : 'headAdmin'
 *          last_name:
 *              type: string
 *              description : last name to be inserted into database
 *              example : 'headAdmin'
 *          email:
 *              type: string
 *              description : email to be inserted into database
 *              example : 'headadmin@email.com'
 *          password:
 *              type: string
 *              description : password to be inserted into database
 *              example : 'headadmin-123'
 *          phone:
 *              type: string
 *              description : phone number to be inserted into database
 *              example : '1234567890'
 *          role:
 *              type: string
 *              description : name of role to be inserted into database
 *              example : 'headAdmin'
 */

/**
 * @swagger
 * /:
 *  post:
 *      summary: Insert new record into database
 *      description: Insert_record
 *      requestBody:
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Insert_record'
 *      responses:
 *           200:
 *              description: Successfully entered data into database
 *           400:
 *              description: Error to insert record into database
 */

app.post('/', async (req, res) => {

    try {
        const getData = req.body;
        
        const query = `insert into t_users(first_name, last_name, email, password, phone, role) values('${getData.first_name}', '${getData.last_name}', '${getData.email}', '${getData.password}', '${getData.phone}', '${getData.role}');`;
        const data = await Redshift.executeQuery(query);

        return res.status(200).json({message : `Data added successfully!`,data: data});
    } catch (error) {
        return res.status(400).json(error);
    }
});

/**
 * @swagger
 * /createTable:
 *  get:
 *      summary : create table into database
 *      description : create table into database
 *      responses:
 *          200:
 *              description : success
 *          400:
 *              description : Error of creating table from database
 * 
 */

app.get('/createTable', async(req, res)=>{
    
    try {
        const query = `create table dev.Public.t_users(id bigint identity(1,1),
        first_name varchar not null,
        last_name varchar not null,
        email text not null,
        password text not null,
        phone varchar not null,
        role varchar not null,
        created_At datetime default sysdate,
        PRIMARY KEY (id)
        );`;

        const data = await Redshift.executeQuery(query);

        return res.status(200).json({message: 'Table Created!', data:data});

    } catch (error) {
        return res.status(400).json(error);
    }
});

/**
 * @swagger
 * /deleteTable:
 *  get:
 *      summary : create table into database
 *      description : create table into database
 *      responses:
 *          200:
 *              description : success
 *          400:
 *              description : Error of deleting table from database
 * 
 */

app.get('/deleteTable', async (req, res) => {

    try {
        const query = `DROP TABLE t_users;`;

        const data = await Redshift.executeQuery(query);

        return res.status(200).json({ message: 'Table deleted!', data: data });

    } catch (error) {
        return res.status(400).json(error);
    }
});

/**
 * @swagger
 * definitions:
 *  Update_record:
 *      type: object
 *      properties:
 *          email:
 *              type: string
 *              description : email to be inserted into database
 *              example : 'headadmin@email.com'
 *          password:
 *              type: string
 *              description : password to be inserted into database
 *              example : 'headadmin-456'
 *          role:
 *              type: string
 *              description : name of role to be inserted into database
 *              example : 'Admin'
 */

/**
 * @swagger
 * /:
 *  put:
 *      summary: Update record into database
 *      description: Update_record
 *      requestBody:
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Update_record'
 *      responses:
 *           200:
 *              description: Successfully updated data into database
 *           400:
 *              description: Error to update record into database
 */

app.put('/', async(req, res)=>{

    try {

        const getData = req.body;

        const query = `UPDATE t_users set role = '${getData.role}', password = '${getData.password}' WHERE email = '${getData.email}';`;

        const data = await Redshift.executeQuery(query);

        return res.status(200).json({ message: 'Data updated sucessfully!', data: data });
    } catch (error) {
        return res.status(400).json(error);
    }
});

/**
 * @swagger
 * definitions:
 *  Delete_record:
 *      type: object
 *      properties:
 *          email:
 *              type: string
 *              description : email to be inserted into database
 *              example : 'headadmin@email.com'
 */

/**
 * @swagger
 * /:
 *  delete:
 *      summary: Delete record into database
 *      description: Delete_record
 *      requestBody:
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/Delete_record'
 *      responses:
 *          200:
 *              description : success
 *          400:
 *              description : Error of deleting record from table
 * 
 */

app.delete('/', async(req, res)=>{

    try {
        const getData = req.body;

        const query = `DELETE from t_users where email = '${getData.email}';`;

        const data = await Redshift.executeQuery(query);

        return res.status(200).json({ message: 'Data deleted sucessfully!', data: data });
    } catch (error) {
        return res.status(400).json(error);
    }
});
