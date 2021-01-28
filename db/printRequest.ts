'use strict';
import {Model, DataTypes, Sequelize} from 'sequelize'

export interface PrintRequestsAttributes {
	id:number;
	name:string;
	filepath:string;
	description?:string;
	user_id:number
}

export function PrintRequestInit(sequelize:Sequelize) {
	class PrintRequests extends Model<PrintRequestsAttributes> 
	implements PrintRequestsAttributes{
		public id!:number;
		public name!:string;
		public filepath!:string;
		public description?:string;
		public user_id!:number;
		// timestamps
		public readonly createdAt!: Date;
		public readonly updatedAt!: Date;
	}
	//TODO

	PrintRequests.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull:false
			},
			filepath: {
				type: DataTypes.STRING(255),
				allowNull:false
			},
			description: {
				type: DataTypes.STRING(255),
				allowNull:true
			},
			user_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull:false
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

