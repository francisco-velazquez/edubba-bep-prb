import { JwtPayload } from "../types/jwt-payload.type";

export interface ITokenServicePort {
    generateToken(payload: JwtPayload): Promise<string>;
    validateToken(token: string): Promise<JwtPayload>;
}