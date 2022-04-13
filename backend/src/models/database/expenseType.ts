import { AllowNull, Column, DataType, ForeignKey, Index, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import User from './user';

interface ExpenseTypeAttributes {
    id: number;
    name: string;
    username: string;
}

interface ExpenseTypeCreationAttributes
    extends Optional<ExpenseTypeAttributes, 'id'> {}

@Table({
    timestamps: false,
})
class ExpenseType extends Model<
    ExpenseTypeAttributes,
    ExpenseTypeCreationAttributes
> {
    @AllowNull(false)
    @Index({
        name: 'unique-expense-type',
        unique: true,
    })
    @Column({
        type: DataType.STRING(30),
    })
    name: string;

    @AllowNull(false)
    @Index({
        name: 'unique-expense-type',
        unique: true,
    })
    @ForeignKey(() => User)
    @Column
    username: string;
}

export default ExpenseType;
