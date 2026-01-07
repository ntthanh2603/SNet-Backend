import { RoleType } from 'src/helper/role.enum';

export interface IPayload {
  id: string;
  deviceSecssionId: string;
  role: RoleType;
  sub?: number;
  iat?: number;
  exp?: number;
}
