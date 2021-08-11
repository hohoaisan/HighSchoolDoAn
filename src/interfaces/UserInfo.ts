import TeacherRole from "enums/TeacherRole";
import UserType from "enums/UserType";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  type: UserType
  roles?: TeacherRole[]
}
export default UserInfo