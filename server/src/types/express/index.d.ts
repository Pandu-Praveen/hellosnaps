declare namespace Express {
  export interface Request {
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      phone: string;
      username: string;
      role: string;
      last_sign_in: Date;
    };
    null;
    auth: boolean;
  }
}
