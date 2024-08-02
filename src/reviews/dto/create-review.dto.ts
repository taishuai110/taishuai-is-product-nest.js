// 设置形参

import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {
    @IsNotEmpty({ message: "商品id不能为空" })
    @IsNumber({}, { message: "商品id为number" })
    productId: number;
    
    @IsNotEmpty({ message: "评论等级不能为空" })
    @IsNumber({}, {message: "评论等级要为number"})
    ratings: number;

    @IsNotEmpty({ message: "评论内容不能为空" })
    @IsString()
    comment: string;
}
