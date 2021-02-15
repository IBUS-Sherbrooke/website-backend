//TODO
import Joi from 'joi'

export var projectCreate = Joi.object({
	name: Joi.string().required(),
	path: Joi.string(),
	description: Joi.string(),
	created_at: Joi.string(),
	updated_at: Joi.string(),
	user_id: Joi.number().integer().min(1).required(),
})

export var projectUpdateQuery = Joi.object({
	user_id: Joi.number().integer().min(1).required(),
	name: Joi.string().required(),
})

export var projectUpdateBody = Joi.object({
	name: Joi.string(),
	path: Joi.string(),
	description: Joi.string(),
	created_at: Joi.string(),
	updated_at: Joi.string(),
})

