import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { OrderStatus } from "../enums/order-status.enum";

export class UpdateOrderStatusDto {
    @IsNotEmpty()
    @IsString()
    // @IsIn()用于校验的字段是否存在数组中的元素，这里只校验是否是交付或发货，其他状态都无法通过校验
    @IsIn([OrderStatus.SHIPPED, OrderStatus.DELIVERED])
    status: OrderStatus
}