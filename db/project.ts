'use strict';
import {Model, DataTypes, Sequelize} from 'sequelize'

export interface ProjectsAttributes {
	user_id:number;
	name:string;
	path?:string;
	description?:string;
}

export function ProjectInit(sequelize:Sequelize) {
	class Projects extends Model<ProjectsAttributes> 
	implements ProjectsAttributes{
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

	Projects.init(
		{
			name: {
				type: DataTypes.STRING(255),
				allowNull:false,
				primaryKey: true
			},
			path: {
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
			}
		},
		{
			tableName:'project',
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			sequelize
		}
	);

	return Projects
}

