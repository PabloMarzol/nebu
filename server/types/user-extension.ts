// User type extension for authentication middleware
import { User as BaseUser } from '@shared/schema';

declare global {
  namespace Express {
    interface User extends BaseUser {
      id: string;
      claims?: {
        sub: string;
        email?: string;
        first_name?: string;
        last_name?: string;
        profile_image_url?: string;
        exp?: number;
      };
    }
  }
}

export {};