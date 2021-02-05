'use strict';
import {Model, DataTypes, Sequelize} from 'sequelize'

export interface PrintRequestsAttributes {
	user_id:number;
	project_name:number;
	name:string;
	filepath?:string;
	description?:string;
}

export function PrintRequestInit(sequelize:Sequelize) {
	class PrintRequests extends Model<PrintRequestsAttributes> 
	implements PrintRequestsAttributes{
		public user_id!:number;
		public project_name!:number;
		public name!:string;
		public filepath?:string;
		public description?:string;

		// timestamps
		public readonly createdAt!: Date;
		public readonly updatedAt!: Date;
	}
	//TODO

	PrintRequests.init(
		{
			name: {
				type: DataTypes.STRING(255),
				allowNull:false,
				primaryKey: true
			},
			filepath: {
				type: DataTypes.STRING(255),
				allowNull:true
			},
			description: {
				type: DataTypes.STRING(255),
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
			tableName:'printrequests',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			sequelize
		}
	);

	return PrintRequests
}

