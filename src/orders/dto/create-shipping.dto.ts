import { IsNotEmpty, IsString } from "class-validator";

export class CreateShippingDto {
    @IsNotEmpty({ message: "手机号码不能为空" })
    @IsString({ message: "手机类型要为string" })
    phone: string;

    @IsNotEmpty({ message: "名称不能为空" })
    @IsString({ message: "名称要为string" })
    name: string;

    @IsNotEmpty({ message: "详细地址不能为空" })
    @IsString({ message: "详细地址要为string" })
    address: string;

    @IsNotEmpty({ message: "城市不能为空" })
    @IsString({ message: "城市要为string" })
    city: string;

    @IsNotEmpty({ message: "邮箱号码不能为空" })
    @IsString({ message: "邮箱号码要为string" })
    postCode: string;

    @IsNotEmpty({ message: "省或州不能为空" })
    @IsString({ message: "省或州要为string" })
    state: string

    @IsNotEmpty({ message: "国家地址不能为空" })
    @IsString({ message: "国家地址要为string" })
    country: string;
}