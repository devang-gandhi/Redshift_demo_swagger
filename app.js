const express = require('express');
const app = express();
const AWS = require('@aws-sdk/client-redshift-data');
const redshiftdata = new AWS.RedshiftData({ region: "ap-south-1" });

app.listen(5000, ()=>console.log(`server starts with redshift...`));
app.use(express.json());

const params1 = {
    Database: 'users', /* required */
    Sqls: [ 
    ],
    ClusterIdentifier: 'nodedemo',
    DbUser: 'awsuser',
    SecretArn: 'arn:aws:secretsmanager:ap-south-1:873195650137:secret:node_demo-Dw98Wo',//'arn:aws:secretsmanager:ap-south-1:873195650137:secret:node_demo-Dw98Wo', //arn: aws: secretsmanager: us - east - 1: 12345561: secret: test- HYRSWs
    // StatementName: '',
    // WithEvent: true,
    //WorkgroupName: 'Admin'
};

// arn:aws:redshift:ap-south-1:873195650137:cluster:node_demo

const params2 = {
    Id: '', 
    // NextToken: ''
};

app.get('/', async(req, res)=>{

    try {
        
        const query = 'select * from t_users';
        params1.Sqls[0] = query;
    
        await redshiftdata.batchExecuteStatement(params1, (err, data)=> {
            if (err) return res.status(400).json(err); 
            console.log(data);
            params2.Id = data.Id;
        });
    
        await redshiftdata.getStatementResult(params2, (err, data)=> {
            if (err) return res.status(400).json(err); // an error occurred
            
            return res.status(200).json(data);// successful response
        });
    } catch (error) {
        return res.status(400).json(error);
    }
});

app.post('/', async(req, res)=>{

    try {
        
        const getData = req.body;
    
        const query = `insert into t_users(id, first_name, last_name, email, password, phone, role) values(1,'${getData.first_name}', '${getData.last_name}', '${getData.email}', '${getData.password}', '${getData.phone}', '${getData.role}');`
        params1.Sqls[0] = query;
    
        await redshiftdata.batchExecuteStatement(params1, (err, data) => {
            if (err) return res.status(400).json(err);
            console.log(data);
            return res.status(200).json('Data inserted!');
        });
    } catch (error) {
        return res.status(400).json(error);
    }

})
