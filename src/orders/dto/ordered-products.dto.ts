import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class OrderedProductsDto {
    @IsNotEmpty({ message: "商品id不能为空" })
    id: number;

    @IsNumber({ maxDecimalPlaces: 2 }, { message: "价格应该要为number且最大小数点为2" })
    @IsPositive({ message: "价格一定不能为负数" })
    product_unit_price: number;

    @IsNumber({}, { message: "数量应该为number" })
    @IsPositive({ message: "数量一定不能为负数" })
    product_quantity: number;
}