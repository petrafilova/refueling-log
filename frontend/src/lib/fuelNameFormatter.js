export const FuelTypes = ['GASOLINE', 'DIESEL', 'LPG', 'CNG', 'HYDROGEN', 'ELECTRICITY'];

export const formatFuelName = (fuelType) => {
    let fuel;
    switch (fuelType) {
        case 'GASOLINE':
            fuel = 'benzín';
            break;
        case 'DIESEL':
            fuel = 'nafta';
            break;
        case 'HYDROGEN':
            fuel = 'vodík';
            break;
        case 'ELECTRICITY':
            fuel = 'elektrika';
            break;
        default:
            fuel = fuelType;
    }
    return fuel;
};
