import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserSignUpDto } from "./dto/user-signup.dto";
import { hash } from "bcrypt";

@Injectable()
export class UsersService {
  // @InjectRepository()这个装饰器是typeorm自带的 @Inject()这个是nest.js带的
  // 这里userRepository用来调用数据库增删改查的方法的
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  // 创建用户
  async signup(userSignUpDto: UserSignUpDto):Promise<UserEntity> {
    // 查询数据库中是否存在这个邮箱
    const userExists = await this.findUserByEmail(userSignUpDto.email);
    // 数据库存在这个邮箱就会返回一个错误信息
    if(userExists) throw new BadRequestException('邮箱已存在');

    // 对密码进行哈希加密
    userSignUpDto.password = await hash(userSignUpDto.password, 10);

    // 创建用户
    const user = this.usersRepository.create(userSignUpDto);
    // 把创建的用户保存到数据库
    const getUser = await this.usersRepository.save(user);
    // 不把密码返回给前端
    delete getUser.password;
    return getUser;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // 根据邮箱地址查询用户
  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }
}
