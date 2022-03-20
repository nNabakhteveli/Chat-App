import bcrypt from 'bcrypt'

const saltRounds = 10;

export async function hashPassword(password: string) {
   try {
      const encryptedPass = await bcrypt.hash(String(password), saltRounds);
      return encryptedPass;
   } catch(err) {
      console.log(err);
   }
}

export async function compareToHashedPassword(plainPassword: string, hashedPassword: string) {
   try {
      const match = await bcrypt.compare(String(plainPassword), String(hashedPassword));
      return match;
   } catch (error) {
      throw error;
   }
}