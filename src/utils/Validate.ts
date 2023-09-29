// Validator for final form

import Joi from "joi";
import {entryValidations} from "../state/ducks/front/entry";

export const validator = (values, schema: Joi.ObjectSchema) => {
    const validation = schema.validate(values, {abortEarly: false});
    const validationObject = [];
    validation.error?.details.forEach((errors) => {
        validationObject[errors.context?.label] = errors.message;
    });
    return validationObject;
}
