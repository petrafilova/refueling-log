import bcrypt from 'bcryptjs';
import {
    AllowNull,
    Column,
    DataType,
    DefaultScope,
    HasMany,
    Model,
    PrimaryKey,
    Scopes,
    Table,
    Unique,
} from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import ExpenseType from './expenseType';
import Vehicle from './vehicle';

interface UserAttributes {
    username: string;
    password: string;
    email: string;
    uuid: string | null;
    confirmed: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'uuid'> {}

@DefaultScope(() => ({
    attributes: { exclude: ['password', 'uuid'] },
}))
@Scopes(() => ({
    authScope: {
        attributes: ['username', 'password'],
    },
    confirmScope: {
        attributes: ['username', 'password', 'uuid'],
    },
}))
@Table({
    timestamps: true,
})
class User extends Model<UserAttributes, UserCreationAttributes> {
    @PrimaryKey
    @Column({
        type: DataType.STRING(50),
    })
    username: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(60), // bcryptjs has has 60 characters
    })
    get password(): string {
        return this.getDataValue('password');
    }

    set password(value: string) {
        this.setDataValue('password', bcrypt.hashSync(value, 12));
    }

    @AllowNull(false)
    @Unique
    @Column({
        type: DataType.STRING(320),
    })
    email: string;

    @AllowNull
    @Column({
        type: DataType.STRING(36),
    })
    uuid: string | null;

    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
    })
    confirmed: boolean;

    @HasMany(() => Vehicle)
    vehicle: Vehicle[];

    @HasMany(() => ExpenseType)
    expenseType: ExpenseType[];
}

export default User;
