// 用户注册的校验规则
import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator";
import { UserSignInDto } from "./user-signin.dto";

export class UserSignUpDto extends UserSignInDto {
  @IsNotEmpty({message: '名称不能为空'})
  @IsString({message: '名称要为字符串'})
  name: string;
}