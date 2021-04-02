'use strict';
import {Model, DataTypes, Sequelize} from 'sequelize'

export interface PrintRequestsHistoryAttributes {
	logged_at:Date;
	user_id:number;
	project_name:number;
	name:string;
	status:string;
	status_message?:string;
	filepath:string;
	description?:string;
}


export class PrintRequestsHistory extends Model<PrintRequestsHistoryAttributes> 
	implements PrintRequestsHistoryAttributes{
		public logged_at!:Date
		public user_id!:number;
		public project_name!:number;
		public name!:string;
		public status!:string;
		public status_message?:string;
		public filepath!:string;
		public description?:string;
		
		// timestamps
		public readonly createdAt!: Date;
		public readonly updatedAt!: Date;
	}
export function PrintRequestHistoryInit(sequelize:Sequelize) {
	PrintRequestsHistory.init(
		{
			logged_at: {
				type: DataTypes.TIME,
				primaryKey: true,
				autoIncrement: false
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull:false,
				primaryKey: true
			},
			filepath: {
				type: DataTypes.STRING(255),
				allowNull:false
			},
			description: {
				type: DataTypes.STRING(255),
				allowNull:true
			},
			status: {
				type: DataTypes.STRING(45),
				allowNull:false
			},
			status_message: {
				type: DataTypes.STRING(45),
				allowNull:true
			},
			user_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull:false,
				primaryKey: true
			},
			project_name: {
				type: DataTypes.STRING(255),
				allowNull:false,
				primaryKey: true
			}
		},
		{
			tableName:'printRequests_History',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			sequelize
		}
	);

	return PrintRequestsHistory
}

