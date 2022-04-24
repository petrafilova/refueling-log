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
import { ALL_FUEL_TYPES, FUEL_TYPE } from '../fuelTypeEnum';

import Vehicle from './vehicle';

interface VehicleFuelAttributes {
    id: number;
    fuel: FUEL_TYPE;
    vehicleId: number;
}

interface VehicleFuelCreationAttributes
    extends Optional<VehicleFuelAttributes, 'id'> {}

@Table({
    timestamps: true,
})
class VehicleFuel extends Model<
    VehicleFuelAttributes,
    VehicleFuelCreationAttributes
> {
    @AllowNull(false)
    @Index({
        name: 'unique-vehicle-fuel',
        unique: true,
    })
    @Column({
        type: DataType.ENUM(...ALL_FUEL_TYPES),
    })
    fuel: FUEL_TYPE;

    @AllowNull(false)
    @Index({
        name: 'unique-vehicle-fuel',
        unique: true,
    })
    @ForeignKey(() => Vehicle)
    @Column
    vehicleId: number;

    @BelongsTo(() => Vehicle)
    vehicle: Vehicle;
}

export default VehicleFuel;
