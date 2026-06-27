import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Index, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';

import ExpenseType from './expenseType';
import Vehicle from '../database/vehicle';

interface ExpenseLogAttributes {
    id: number;
    price: number;
    mileage: number;
    dateTime: Date;
    comment: string | null;
    typeId: number;
    vehicleId: number;
}

@Table({
    timestamps: true
})
class ExpenseLog extends Model<ExpenseLogAttributes, Optional<ExpenseLogAttributes, 'id' | 'comment'>> {
    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL(10, 2)
    })
    declare price: number;

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL(10, 2)
    })
    declare mileage: number;

    @AllowNull(false)
    @Index({
        name: 'unique-expense-log',
        unique: true
    })
    @Column({
        type: DataType.DATE
    })
    declare dateTime: Date;

    @AllowNull
    @Column({
        type: DataType.TEXT
    })
    declare comment: string | null;

    @AllowNull(false)
    @Index({
        name: 'unique-expense-log',
        unique: true
    })
    @ForeignKey(() => ExpenseType)
    @Column({
        onDelete: 'CASCADE'
    })
    declare typeId: number;

    @BelongsTo(() => ExpenseType)
    type: ExpenseType;

    @AllowNull(false)
    @ForeignKey(() => Vehicle)
    @Column({
        onDelete: 'CASCADE'
    })
    declare vehicleId: number;

    @BelongsTo(() => Vehicle)
    vehicle: Vehicle;
}

export default ExpenseLog;
