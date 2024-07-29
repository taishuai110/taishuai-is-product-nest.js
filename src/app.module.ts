import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "../db/data-source";
import { UsersModule } from './users/users.module';

@Module({
  // 这里把数据库对应配置导入到TypeOrm中
    imports: [TypeOrmModule.forRoot(dataSourceOptions), UsersModule],
    controllers: [],
    providers: []
})
export class AppModule {}
