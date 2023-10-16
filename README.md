# Nestjs Auto Crud 
Extend `BaseCrudController` [here](https://github.com/A-Maged/nestjs-auto-crud/blob/main/src/BaseCrudController.ts), to get all CRUD methods for an entity with the option of supplying validators to run before each method.


```ts
/* DTO to use for validation */
export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}

@Controller('/users')
export class UsersController extends BaseCrudController<User> {
  constructor(dataSource: DataSource) {
    const validators = {
      /* method name: dto */
      create: CreateUserDTO,
    };

    super(User, dataSource, validators);
  }
}
```

## Todo

- Specify excluded operations
- Handle common DB constraints errors
