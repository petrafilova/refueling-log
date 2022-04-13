import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Index,
    Model,
    Table,
} from 'sequelize-typescript';
import { Optional } from 'sequelize/types';

import ExpenseType from './expenseType';
import Vehicle from '../database/vehicle';

interface ExpenseLogAttributes {
    id: number;
    price: number;
    mileage: number;
    dateTime: Date;
    comment: string;
    typeId: number;
    vehicleId: number;
}

interface ExpenseLogCreationAttributes
    extends Optional<ExpenseLogAttributes, 'id' | 'comment'> {}

@Table({
    timestamps: true,
})
class ExpenseLog extends Model<
    ExpenseLogAttributes,
    ExpenseLogCreationAttributes
> {
    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL(10, 2),
    })
    price: number;

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL(10, 2),
    })
    mileage: number;

    @AllowNull(false)
    @Index({
        name: 'unique-expense-log',
        unique: true,
    })
    @Column({
        type: DataType.DATE,
    })
    dateTime: Date;

    @AllowNull
    @Column({
        type: DataType.TEXT,
    })
    comment: string | null;

    @AllowNull(false)
    @Index({
        name: 'unique-expense-log',
        unique: true,
    })
    @ForeignKey(() => ExpenseType)
    @Column
    typeId: number;

    @BelongsTo(() => ExpenseType)
    type: ExpenseType;

    @AllowNull(false)
    @ForeignKey(() => Vehicle)
    @Column
    vehicleId: number;

    @BelongsTo(() => Vehicle)
    vehicle: Vehicle;
}

export default ExpenseLog;
