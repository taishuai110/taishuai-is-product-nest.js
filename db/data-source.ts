import { DataSource, DataSourceOptions } from "typeorm";
// 使用process.env时要引用config
import { config } from 'dotenv';
config()

// 注意，下载pnpm包的mysql时要下载mysql2，不要下载mysql，mysql无法链接，mysql2可以

export const dataSourceOptions: DataSourceOptions = {
  // 数据库类型  type不能使用process.env，因为mysql会先检查type再解析process环境变量
  type: "mysql",
  //数据库IP地址
  host: process.env.DB_HOST,
  // 端口号
  port: Number(process.env.DB_PORT),
  //用户名
  username: process.env.DB_USERNAME,
  // 密码
  password: process.env.DB_PASSWORD,
  // 数据库名
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  // migrations: ['dist/migrations/**/*{.ts,.js}'],
  // subscribers: ['dist/subscribers/**/*{.ts,.js}'],
  logging: false,
  // 是否同步 这个字段表示如果有设置数据表的文件跟链接数据库类型不一样就会自动对数据库进行跟文件对其
  synchronize: true
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;