import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserSignUpDto } from "./dto/user-signup.dto";
import { UserEntity } from "./entities/user.entity";
import { UserSignInDto } from "./dto/user-signin.dto";
import { CurrentUser } from "../utility/decorators/current-user.decorator";
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { RoleEntity } from '../roles/entities/role.entity';
import { Roles } from '../utility/common/user-roles.ennum';
import { AuthorizationGuard } from "../utility/guards/authorization.guard";
import { AuthorizeRoles } from '../utility/decorators/authorize-roles.decorator'

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  // 用户注册接口
  @Post("signup")
  async signup(@Body() userSignUpDto: UserSignUpDto): Promise<{ user: UserEntity }> {
    return {
      user: await this.usersService.signup(userSignUpDto)
    };
  }

  // 用户登录接口
  @Post("signin")
  async signin(@Body() userSignInDto: UserSignInDto): Promise<{
    accessToken: string,
    userInfo: UserEntity
  }> {
    // region
    const userInfo = await this.usersService.signin(userSignInDto);
    // 创建token
    const accessToken = await this.usersService.accessToken(userInfo);

    return {
      accessToken,
      userInfo
    };
    // endregion
  }


  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // return this.usersService.create(createUserDto);
    return "holle world";
  }

  // 查询所有用户数据  第一个用来判断Roles类型，第二个是使用管道判断
  // @AuthorizeRoles(Roles)
  @UseGuards(AuthenticationGuard, AuthorizationGuard([ Roles.admin ]))
  @Get('all')
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  // 根据id查询用户信息
  @Get("single/:id")
  async findOne(@Param("id") id: string): Promise<UserEntity> {
    // 这里+id表示把string类型的id转为number类型
    return await this.usersService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }

  // 日期配置文件
  @UseGuards(AuthenticationGuard)
  @Get('me')
  getProfile(@CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }
}
