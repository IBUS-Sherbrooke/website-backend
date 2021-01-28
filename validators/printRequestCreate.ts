//TODO
import Joi from 'joi'

export var printRequestCreate = Joi.object({
	name: Joi.string().required(),
	filepath: Joi.string().required(),
	description: Joi.string(),
	created_at: Joi.string(),
	updated_at: Joi.string(),
	user_id: Joi.string().required()
})

