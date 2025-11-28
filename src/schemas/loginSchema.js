import * as zod from "zod";

const loginSchema = zod.object({
    email: zod.email(),
    password: zod.string().min(8).max(20),
});

export default loginSchema;
