import TeacherRole from "enums/TeacherRole";
import UserType from "enums/UserType";

interface UserCookieBody {
  id: number;
  type: UserType
}

export default UserCookieBody