import bcrypt from 'bcryptjs';

const password = 'testing';
const hashedPassword = await bcrypt.hash(password, 10);
console.log(hashedPassword);