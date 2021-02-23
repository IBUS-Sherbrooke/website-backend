import { string } from "joi";
import { Dialect } from "sequelize/types";
import * as dotenv from 'dotenv'
dotenv.config();

interface db_int {
	host:string;
	username:string;
	password:string;
	database:string;
	port:string;
	dialect:Dialect;
}
interface config_int{
	node_env:string;
	web:{port:string;};
	db:db_int;
	octoprint:{
		host:string;
		port:string;
	}
}

var config:config_int = {} as any;

config.node_env = process.env.NODE_ENV!;

//web config
config.web = {} as any;
config.web.port = process.env.PORT!;

//db config
config.db = {} as any;
config.db.host = process.env.DB_HOST!;
config.db.username = process.env.DB_USERNAME!;
config.db.password = process.env.DB_PASSWORD!;
config.db.database = process.env.DB_DATABASE!;
config.db.port = process.env.DB_PORT!;
config.db.dialect = <Dialect>process.env.DB_DIALECT!;

//octoprint config
config.octoprint = {} as any;
config.octoprint.host = process.env.OCTOPRINT_HOST!;
config.octoprint.port = process.env.OCTOPRINT_PORT!;

export {config}