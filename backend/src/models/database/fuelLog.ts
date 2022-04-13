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
import VehicleFuel from './vehicleFuel';

interface FuelLogAttributes {
    id: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    mileage: number;
    dateTime: Date;
    full: boolean;
    previousMissing: boolean;
    consumption: number | null;
    vehicleFuelId: number;
}

interface FuelLogCreationAttributes
    extends Optional<FuelLogAttributes, 'id' | 'consumption'> {}

@Table({
    timestamps: true,
})
class FuelLog extends Model<FuelLogAttributes, FuelLogCreationAttributes> {
    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL(10, 2),
    })
    quantity: number;

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL(10, 2),
    })
    unitPrice: number;

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL(10, 2),
    })
    totalPrice: number;

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL(10, 2),
    })
    mileage: number;

    @AllowNull(false)
    @Index({
        name: 'unique-fuel-log',
        unique: true,
    })
    @Column({
        type: DataType.DATE,
    })
    dateTime: Date;

    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
    })
    full: boolean;

    @AllowNull(false)
    @Column({
        type: DataType.BOOLEAN,
    })
    previousMissing: boolean;

    @AllowNull
    @Column({
        type: DataType.DECIMAL(10, 2),
    })
    consumption: number | null; // automaticaly calculated

    @AllowNull(false)
    @Index({
        name: 'unique-fuel-log',
        unique: true,
    })
    @ForeignKey(() => VehicleFuel)
    @Column
    vehicleFuelId: number;

    @BelongsTo(() => VehicleFuel)
    vehicleFuel: VehicleFuel;
}

export default FuelLog;
