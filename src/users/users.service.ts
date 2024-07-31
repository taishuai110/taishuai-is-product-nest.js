import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserSignUpDto } from "./dto/user-signup.dto";
import { UserSignInDto } from "./dto/user-signin.dto";
import { hash, compare } from "bcrypt";
import * as process from "process";
import { sign } from "jsonwebtoken";;

@Injectable()
export class UsersService {
  // @InjectRepository()这个装饰器是typeorm自带的 @Inject()这个是nest.js带的
  // 这里userRepository用来调用数据库增删改查的方法的
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
  ) {
  }

  // 创建用户的方法
  async signup(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    // 查询数据库中是否存在这个邮箱
    const userExists = await this.findUserByEmail(userSignUpDto.email);
    // 数据库存在这个邮箱就会返回一个错误信息
    if (userExists) throw new BadRequestException("邮箱已存在");

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

  // 用户登录的方法
  async signin(userSignInDto: UserSignInDto): Promise<UserEntity> {
    const userExists = await this.usersRepository.createQueryBuilder("users")
      .addSelect("users.password")
      .leftJoinAndSelect("users.roles", 'roles')
      .where("users.email=:email", { email: userSignInDto.email })
      .getOne();
    // 判断是否存在该用户
    if (!userExists) throw new BadRequestException("邮箱不正确");
    // 校验密码
    const matchPassword = await compare(userSignInDto.password, userExists.password);
    // 判断密码是否正确
    if (!matchPassword) throw new BadRequestException("密码不正确");
    // 不发送密码给前端
    delete userExists.password;
    return userExists;
  }

  create(createUserDto: CreateUserDto) {
    return "This action adds a new user";
  }

  // 对用户数据表进行查询全部
  async findAll(): Promise<UserEntity[]> {
    const userInfo: UserEntity[] = await this.usersRepository.find({
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
      relations: ['roles']
    })
    if(!userInfo.length) throw new NotFoundException('目前没有用户数据');
    return userInfo;
  }

  // 根据id针对用户查询
  async findOne(id: number) {
    const userInfo = await this.usersRepository.findOne({
      select: ["id", "name", "email", "createdAt", "updatedAt"],
      relations: [ "roles" ],
      where: { id }
    });
    if(!userInfo) throw new NotFoundException('没有该用户数据');
    return userInfo;
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

  // 创建token
  async accessToken(user: UserEntity): Promise<string> {
    return sign({
        id: user.id,
        email: user.email
      }, process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME });
  }
}
