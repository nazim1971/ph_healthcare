import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: path.join(process.cwd(), '.env')});

class Config{
    constructor(){
        if(!process.env.PORT){
            throw new Error('PORT is required in .env file');
        }
        if(!process.env.NODE_ENV){
            throw new Error('NODE_ENV is required in .env file');
        }
        if(!process.env.JWT_SECRET){
            throw new Error('JWT_SECRET is required in .env file');
        }
        if(!process.env.JWT_EXPIRES_IN){
            throw new Error('JWT_EXPIRES_IN is required in .env file');
        }
        if(!process.env.REFRESH_TOKEN_SECRET){
            throw new Error('REFRESH_TOKEN_SECRET is required in .env file');
        }
        if(!process.env.REFRESH_TOKEN_EXPIRES_IN){
            throw new Error('REFRESH_TOKEN_EXPIRES_IN is required in .env file');
        }
    }

    // Getters for environment variables
 public get port(): string {
    return String(process.env.PORT);
  }
  public get nodeEnv(): string {
    return String(process.env.NODE_ENV);
  }
  public get jwtS(): string {
    return String(process.env.JWT_SECRET);
  }
  public get jwtExp(): string {
    return String(process.env.JWT_EXPIRES_IN);
  }
  public get refreshS(): string {
    return String(process.env.REFRESH_TOKEN_SECRET);
  }
  public get refreshExp(): string {
    return String(process.env.REFRESH_TOKEN_EXPIRES_IN);
  }
}

 export default new Config();