// 用户登录的校验规则
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UserSignInDto {
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱要符合格式' })
  email: string;

  @IsNotEmpty({message: '密码不能为空'})
  @MinLength(5, {message: '密码长度不能小于5'})
  password: string;
}