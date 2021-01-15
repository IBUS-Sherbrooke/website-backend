/* Database connection
******************************************************************/
'use strict';
import {Sequelize} from 'sequelize'
import {PrintRequestInit,PrintRequestsAttributes} from './printRequest';
import {config} from '../configs/config';
//const config = require('../configs/config');

const sequelizer = new Sequelize(config.db.database,
	config.db.username,
	config.db.password,
	{
		host: config.db.host,
		dialect: config.db.dialect,
		logging: false
	}
);

/* init models
******************************************************************/
const db = {
	sequelize:sequelizer, 
	PrintRequests:PrintRequestInit(sequelizer)
}

export {db};
export {PrintRequestsAttributes};