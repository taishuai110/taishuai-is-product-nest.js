// 校验规则
import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator";

export class UserSignUpDto {
  @IsNotEmpty({message: '名称不能为空'})
  @IsString({message: '名称要为字符串'})
  name: string;

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱要符合格式' })
  email: string;

  @IsNotEmpty({message: '密码不能为空'})
  @MinLength(5, {message: '密码长度不能小于5'})
  password: string;
}