import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CreateShippingDto } from "./create-shipping.dto";
import { OrderedProductsDto } from "./ordered-products.dto";

export class CreateOrderDto {
    // validateNested用于校验引用的DTO类型，Type则负责引用校验
    @Type(() => CreateShippingDto)
    @ValidateNested()
    shippingAddress: CreateShippingDto;

    @Type(() => OrderedProductsDto)
    @ValidateNested()
    orderedProducts: OrderedProductsDto[];
}
