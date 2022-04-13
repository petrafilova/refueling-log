import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    DefaultScope,
    ForeignKey,
    HasMany,
    Model,
    Scopes,
    Table,
} from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import User from './user';
import VehicleFuel from './vehicleFuel';

interface VehicleAttributes {
    id: number;
    brand: string;
    model: string;
    licensePlateNo: string;
    dateOfReg: Date;
    color: string;
    vin: string;
    username: string;
}

interface VehicleCreationAttributes
    extends Optional<VehicleAttributes, 'id' | 'dateOfReg' | 'color' | 'vin'> {}

@DefaultScope(() => ({
    attributes: { exclude: ['username'] },
}))
@Scopes(() => ({
    ownershipScope: {
        attributes: ['id', 'username'],
    },
}))
@Table({
    timestamps: true,
})
class Vehicle extends Model<VehicleAttributes, VehicleCreationAttributes> {
    @AllowNull(false)
    @Column({
        type: DataType.STRING(20),
    })
    brand: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(60),
    })
    model: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(10),
    })
    licensePlateNo: string;

    @AllowNull
    @Column({
        type: DataType.DATEONLY,
    })
    dateOfReg: Date;

    @AllowNull
    @Column({
        type: DataType.STRING(20),
    })
    color: string;

    @AllowNull
    @Column({
        type: DataType.STRING(17),
    })
    vin: string;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    username: string;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => VehicleFuel)
    vehicleFuel: VehicleFuel[];
}

export default Vehicle;
