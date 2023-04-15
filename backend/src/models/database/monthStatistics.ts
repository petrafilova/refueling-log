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
    year: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
    })
    month: number;

    @AllowNull(false)
    @Default(0)
    @Column({
        type: DataType.DECIMAL(10, 2),
    })
    priceSummary: number;

    @AllowNull(false)
    @ForeignKey(() => ExpenseType)
    @Column({
        onDelete: 'CASCADE',
    })
    expenseTypeId: number;

    @AllowNull(false)
    @ForeignKey(() => Vehicle)
    @Column({
        onDelete: 'CASCADE',
    })
    vehicleId: number;
}

export default MonthStatistics;
