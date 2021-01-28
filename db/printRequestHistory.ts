'use strict';
import {Model, DataTypes, Sequelize} from 'sequelize'


export function PrintRequestHistoryInit(sequelize:Sequelize) {
	class PrintRequestsHistory extends Model {}
	PrintRequestsHistory.init(
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
				allowNull:true
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

