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

import Vehicle from './vehicle';

interface VehicleFuelAttributes {
    id: number;
    fuel: 'GASOLINE' | 'DIESEL' | 'LPG' | 'CNG' | 'HYDROGEN' | 'ELECTRICITY';
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
        type: DataType.ENUM(
            'GASOLINE',
            'DIESEL',
            'LPG',
            'CNG',
            'HYDROGEN',
            'ELECTRICITY'
        ),
    })
    fuel: 'GASOLINE' | 'DIESEL' | 'LPG' | 'CNG' | 'HYDROGEN' | 'ELECTRICITY';

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
