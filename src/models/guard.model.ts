import { model } from "mongoose"
import guardSchema, { Guard } from "../schemas/guard.schema"

export default model<Guard>("guard-details", guardSchema)