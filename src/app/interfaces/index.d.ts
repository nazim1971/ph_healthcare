import { JwtPayload } from 'jsonwebtoken';

export interface CustomPayload extends JwtPayload {
  email: string;
  role: string;
}