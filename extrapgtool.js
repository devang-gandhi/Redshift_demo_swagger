const pgp = require("pg-promise");

const connections = [];

const getConnection = async()=> {
    const dbName = "dev";

    if (!connections[dbName]) {
      const dbUser = "awsuser";
      const dbPassword = "nodeDemo-1308";
      const dbHost = "nodedemo.cqtqtz4nress.ap-southeast-1.redshift.amazonaws.com";
      const dbPort = "5439";

      const dbc = pgp({ capSQL: true });
      console.log(`Opening connection to: ${dbName}, host is: ${dbHost}`);

      const connectionString = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
        //const connectionString = `postgres://efyhvpxy:p6CdZvZ1_g9Nv2Dyw5fBshDyJFUA0MJg@tiny.db.elephantsql.com/efyhvpxy`;
      connections[dbName] = dbc(connectionString);
    }

    return connections[dbName];
};

// For cluster make it publicly avaliable choose cluster from redshift console go actions and modify publicly accessible settings then enable it.
// Other way go to properties then network and security then VPC security group open link then outbound rules then edit outbound rules then add rule accordingly.

const executeQuery= async(query)=> {
    try {
      const date1 = new Date().getTime();
      const connection = await getConnection();
      const result = await connection.query(query);

      const date2 = new Date().getTime();
      const durationMs = date2 - date1;
      const durationSeconds = Math.round(durationMs / 1000);
      let dataLength = 0;

      if (result && result.length) dataLength = result.length;

      console.log(
        `[Redshift] [${durationMs}ms] [${durationSeconds}s] [${dataLength.toLocaleString()} records] ${query}`
      );

      return result;
    } catch (e) {
      console.error(`Error executing query: ${query} Error: ${e.message}`);
      throw e;
    }
};

module.exports = {executeQuery};