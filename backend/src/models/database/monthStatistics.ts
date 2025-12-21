import {
    AllowNull,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';

import ExpenseType from './expenseType';
import Vehicle from './vehicle';

interface MonthStatisticsAttributes {
    id: number;
    year: number;
    month: number;
    priceSummary: number;
    expenseTypeId: number;
    vehicleId: number;
}

interface MonthStatisticsCreationAttributes
    extends Optional<MonthStatisticsAttributes, 'id'> {}

@Table({
    timestamps: true,
})
class MonthStatistics extends Model<
    MonthStatisticsAttributes,
    MonthStatisticsCreationAttributes
> {
    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
    })
    declare year: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
    })
    declare month: number;

    @AllowNull(false)
    @Default(0)
    @Column({
        type: DataType.DECIMAL(10, 2),
    })
    declare priceSummary: number;

    @AllowNull(false)
    @ForeignKey(() => ExpenseType)
    @Column({
        onDelete: 'CASCADE',
    })
    declare expenseTypeId: number;

    @AllowNull(false)
    @ForeignKey(() => Vehicle)
    @Column({
        onDelete: 'CASCADE',
    })
    declare vehicleId: number;
}

export default MonthStatistics;
