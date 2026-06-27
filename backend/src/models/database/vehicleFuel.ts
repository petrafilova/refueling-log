import { AllowNull, BelongsTo, Column, DataType, ForeignKey, HasMany, Index, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { FUEL_TYPE } from '../fuelTypeEnum';
import FuelLog from './fuelLog';

import Vehicle from './vehicle';

interface VehicleFuelAttributes {
    id: number;
    fuel: FUEL_TYPE;
    vehicleId: number;
}

@Table({
    timestamps: true
})
class VehicleFuel extends Model<VehicleFuelAttributes, Optional<VehicleFuelAttributes, 'id'>> {
    @AllowNull(false)
    @Index({
        name: 'unique-vehicle-fuel',
        unique: true
    })
    @Column({
        type: DataType.ENUM(...Object.keys(FUEL_TYPE))
    })
    declare fuel: FUEL_TYPE;

    @AllowNull(false)
    @Index({
        name: 'unique-vehicle-fuel',
        unique: true
    })
    @ForeignKey(() => Vehicle)
    @Column({
        onDelete: 'CASCADE'
    })
    declare vehicleId: number;

    @BelongsTo(() => Vehicle)
    vehicle: Vehicle;

    @HasMany(() => FuelLog)
    fuelLog: FuelLog[];
}

export default VehicleFuel;
