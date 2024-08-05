
// 订单状态
export enum OrderStatus {
    // 正在处理订单
    PROCESSING = 'processing',
    // 正在发货
    SHIPPED = 'shipped',
    // 支付成功
    DELIVERED = 'delivered',
    // 订单被取消时
    CENCELLED = 'cancelled'
}