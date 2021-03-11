//TODO
import Joi from 'joi'

export var printRequestGetQuery = Joi.object({
	user_id: Joi.number().integer().min(1).required(),
	project_name: Joi.string(),
	name: Joi.string(),
})

export var printRequestCreate = Joi.object({
	name: Joi.string().required(),
	filepath: Joi.string(),
	description: Joi.string(),
	created_at: Joi.string(),
	updated_at: Joi.string(),
	user_id: Joi.number().integer().min(1).required(),
	project_name: Joi.string().required()
})

export var printRequestUpdateQuery = Joi.object({
	user_id: Joi.number().integer().min(1).required(),
	project_name: Joi.string().required(),
	name: Joi.string().required(),
})

export var printRequestUpdateBody = Joi.object({
	name: Joi.string(),
	filepath: Joi.string(),
	description: Joi.string(),
	created_at: Joi.string(),
	updated_at: Joi.string(),
})

