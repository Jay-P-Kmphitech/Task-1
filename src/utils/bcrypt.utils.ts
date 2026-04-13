import bcrypt from "bcrypt";
import env from "../config/env";

class BcryptUtils {
  secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async generateHash(value: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(value + this.secretKey, saltRounds);
  }

  async compareValue(value: string, hash: string): Promise<boolean> {
    console.log(value + this.secretKey, "compare with", hash);

    return await bcrypt.compare(value + this.secretKey, hash);
  }
}

export const passwordHashUtils = new BcryptUtils(env.jwtSecrete);
