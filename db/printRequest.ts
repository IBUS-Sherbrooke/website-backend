'use strict';
import {Model, DataTypes, Sequelize} from 'sequelize'

export interface PrintRequestsAttributes {
	id:number;
	name:string;
}

export function PrintRequestInit(sequelize:Sequelize) {
	class PrintRequests extends Model<PrintRequestsAttributes> 
	implements PrintRequestsAttributes{
		public id!:number;
		public name!:string;
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
			}
		},
		{
			tableName:'printRequests',
			schema: 'data',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			sequelize
		}
	);

	return PrintRequests
}

//module.exports = (sequelize: Sequelize) =>{

//}
