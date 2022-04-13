import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
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
    @ForeignKey(() => Vehicle)
    @Column
    vehicleId: number;

    @BelongsTo(() => Vehicle)
    vehicle: Vehicle;
}

export default VehicleFuel;
