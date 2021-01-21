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

