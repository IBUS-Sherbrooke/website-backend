//TODO
import Joi from 'joi'

export var printRequestCreate = Joi.object({
	name: Joi.string().required(),
	created_at: Joi.string(),
    updated_at: Joi.string(),
})

