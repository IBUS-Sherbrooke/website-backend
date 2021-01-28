//TODO
import Joi from 'joi'

export var printRequestUpdate = Joi.object({
	name: Joi.string(),
	filepath: Joi.string(),
	description: Joi.string(),
	created_at: Joi.string(),
    updated_at: Joi.string(),
})