const baseUrl = 'http://localhost:8080';

export const register = async (regData) => {
    console.log(regData);
    try {
        const response = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            body: JSON.stringify(regData),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response);
        if (response.ok) {
            console.log('register -  zadajte registračný kľúč.');
            return true;
        } else {
            const data = await response.json();
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri registrácii. ${err.message}`);
        alert(`Nastala chyba pri registrácii. ${err.message}`);
    }
    return false;
};

export const login = async (loginData) => {
    console.log(loginData);
    try {
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('Prihlásenie prebehlo úspešne');
            return {
                token: data.token,
                refreshToken: data.refreshToken,
                username: data.username,
            };
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri prihlásení. ${err.message}`);
        alert(`Nastala chyba pri prihlásení. ${err.message}`);
    }
};

export const confirm = async (registrationKey) => {
    console.log(registrationKey);
    try {
        const response = await fetch(`${baseUrl}/auth/confirm/${registrationKey}`, {
            method: 'POST',
        });
        console.log(response);
        const data = await response.json();
        
        if (response.ok) {
            console.log('Registrácia prebehla úspešne');

            const confirmedData = {
                token: data.token,
                refreshToken: data.refreshToken,
                username: data.username,
            };

            console.log(confirmedData);
            return confirmedData;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri registrácii. ${err.message}`);
        alert(`Nastala chyba pri registrácii. ${err.message}`);
    }

};

export const password = async (newPassword, token) => {
    console.log(newPassword);
    console.log(token);
    try {
        const response = await fetch(`${baseUrl}/auth/password`, {
            method: 'PUT',
            body: JSON.stringify(newPassword),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        if (response.ok) {
            alert('Zmena hesla prebehla úspešne.');
            return true;
        } else {
            const data = await response.json();
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri zmene hesla. ${err.message}`);
        alert(`Nastala chyba pri zmene hesla. ${err.message}`);
    }
    return false;
};

export const deleteUserAccount = async (userInfo, token) => {
    console.log(userInfo);
    console.log(token);
    try {
        const response = await fetch(`${baseUrl}/auth/delete`, {
            method: 'POST',
            body: JSON.stringify(userInfo),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        if (response.ok) {
            alert('Zmazanie účtu prebehlo úspešne.');
            return true;
        } else {
            const data = await response.json();
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri zmazaní účtu. ${err.message}`);
        alert(`Nastala chyba pri zmazaní účtu. ${err.message}`);
    }
    return false;
};

export const createVehicle = async (createdVehicle, token) => {
    console.log(createdVehicle);
    console.log(token);
    try {
        const response = await fetch(`${baseUrl}/vehicle`, {
            method: 'POST',
            body: JSON.stringify(createdVehicle),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('Pridanie vozidla prebehlo úspešne');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri vytvorení vozidla. ${err.message}`);
        alert(`Nastala chyba pri vytvorení vozidla. ${err.message}`);
    }
    return false;
};

export const getVehicles = async (token) => {
    try {
        const response = await fetch(`${baseUrl}/vehicle`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('Zoznam vozidiel');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri zobrazení vozidiel. ${err.message}`);
        alert(`Nastala chyba pri zobrazení vozidiel. ${err.message}`);
    }
    return false;
};

export const deleteVehicleById = async (vehicleId, token) => {
    console.log(vehicleId);
    console.log(token);
    try {
        const response = await fetch(`${baseUrl}/vehicle/${vehicleId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        if (response.ok) {
            console.log('Zmazanie vozidla prebehlo úspešne.');
            return true;
        } else {
            const data = await response.json();
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri zmazaní vozidla. ${err.message}`);
        alert(`Nastala chyba pri zmazaní vozidla. ${err.message}`);
    }
    return false;
};

export const getVehicleById = async (vehicleId, token) => {
    try {
        const response = await fetch(`${baseUrl}/vehicle/${vehicleId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();
        if (response.ok) {
            console.log('getVehicle');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri zobrazení vozidiel. ${err.message}`);
        alert(`Nastala chyba pri zobrazení vozidiel. ${err.message}`);
    }
    return false;
};

export const updateVehicleById = async (vehicleId, editedVehicle, token) => {
    try {
        const response = await fetch(`${baseUrl}/vehicle/${vehicleId}`, {
            method: 'PUT',
            body: JSON.stringify(editedVehicle),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('updateVehicle');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri zobrazení vozidiel. ${err.message}`);
        alert(`Nastala chyba pri zobrazení vozidiel. ${err.message}`);
    }
    return false;
};

export const createVehicleFuel = async (vehicleFuel, token) => {
    try {
        const response = await fetch(`${baseUrl}/vehicleFuel`, {
            method: 'POST',
            body: JSON.stringify(vehicleFuel),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('createVehicleFuel');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri vytvorení paliva. ${err.message}`);
        alert(`Nastala chyba pri vytvorení paliva. ${err.message}`);
    }
    return false;
};

export const listOfVehicleFuels = async (vehicleId, token) => {
    try {
        const response = await fetch(`${baseUrl}/vehicleFuel/byVehicle/${vehicleId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('listOfVehicleFuels');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri zobrazení zoznamu palív pre dané vozidlo. ${err.message}`);
        alert(`Nastala chyba pri zobrazení zoznamu palív pre dané vozidlo. ${err.message}`);
    }
    return false;
};

export const singleVehicleFuel = async (vehicleFuelId, token) => {
    try {
        const response = await fetch(`${baseUrl}/vehicleFuel/${vehicleFuelId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('singleVehicleFuel');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri zobrazení paliva pre dané vozidlo. ${err.message}`);
        alert(`Nastala chyba pri zobrazení paliva pre dané vozidlo. ${err.message}`);
    }
    return false;
};

export const updateVehicleFuel = async (vehicleFuelId, updateFuel, token) => {
    try {
        const response = await fetch(`${baseUrl}/vehicleFuel/${vehicleFuelId}`, {
            method: 'PUT',
            body: JSON.stringify(updateFuel),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('updateVehicleFuel');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri úprave paliva. ${err.message}`);
        alert(`Nastala chyba pri úprave paliva. ${err.message}`);
    }
    return false;
};

export const deleteVehicleFuel = async (vehicleFuelId, token) => {
    try {
        const response = await fetch(`${baseUrl}/vehicleFuel/${vehicleFuelId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        
        if (response.ok) {
            console.log('deleteVehicleFuel');
            return true;
        } else {
            console.log(data);
            const data = await response.json();
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri zvymazaní paliva. ${err.message}`);
        alert(`Nastala chyba pri vymazaní paliva. ${err.message}`);
    }
    return false;
};

// refueling log

export const listOfFuelLogs = async (vehicleFuelId, token, display) => {
    console.log(vehicleFuelId, token, display);
    try {
        const response = await fetch(`${baseUrl}/fuelLog/byVehicleFuel/${vehicleFuelId}`, {
            method: 'POST',
            body: JSON.stringify(display),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('listOfFuelLogs');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri zobrazení záznamov tankovania. ${err.message}`);
        alert(`Nastala chyba pri zobrazení záznamov tankovania. ${err.message}`);
    }
    return false;
};

export const createFuelLog = async (fuelLog, token) => {
    console.log(fuelLog, token);
    try {
        const response = await fetch(`${baseUrl}/fuelLog`, {
            method: 'POST',
            body: JSON.stringify(fuelLog),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('createdFuelLog');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri vytvorení záznamu tankovania. ${err.message}`);
        alert(`Nastala chyba pri vytvorení záznamu tankovania. ${err.message}`);
    }
    return false;
};

export const getSingleFuelLog = async (fuelLogId, token) => {
    try {
        const response = await fetch(`${baseUrl}/fuelLog/${fuelLogId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('gettedSingleFuelLog');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri zobrazení záznamu pre dané palivo. ${err.message}`);
        alert(`Nastala chyba pri zobrazení záznamu pre dané palivo. ${err.message}`);
    }
    return false;
};

export const updateFuelLog = async (fuelLogId, updatedData, token) => {
    try {
        const response = await fetch(`${baseUrl}/fuelLog/${fuelLogId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('updatedFuelLog');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri úprave záznamu tankovania. ${err.message}`);
        alert(`Nastala chyba pri úprave záznamu tankovania. ${err.message}`);
    }
    return false;
};

export const deleteFuelLog = async (fuelLogId, token) => {
    try {
        const response = await fetch(`${baseUrl}/fuelLog/${fuelLogId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        
        if (response.ok) {
            console.log('deletedFuelLog');
            return true;
        } else {
            const data = await response.json();
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri vymazaní záznamu tankovania. ${err.message}`);
        alert(`Nastala chyba pri vymazaní záznamu tankovania. ${err.message}`);
    }
    return false;
};

// expense type

export const listOfExpensesTypes = async (token) => {
    try {
        const response = await fetch(`${baseUrl}/expenseType`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('listOfExpensesTypes');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri zobrazení druhov výdavkov. ${err.message}`);
        alert(`Nastala chyba pri zobrazení druhov výdavkov. ${err.message}`);
    }
    return false;
};

export const createExpensesType = async (nameOfExpenseType, token) => {
    console.log(nameOfExpenseType, token);
    try {
        const response = await fetch(`${baseUrl}/expenseType`, {
            method: 'POST',
            body: JSON.stringify(nameOfExpenseType),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('createdExpensesType');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri vytvorení druhu výdavku. ${err.message}`);
        alert(`Nastala chyba pri vytvorení druhu výdavku. ${err.message}`);
    }
    return false;
};

export const updateExpenseType = async (expenseTypeId, updatedData, token) => {
    try {
        const response = await fetch(`${baseUrl}/expenseType/${expenseTypeId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('updatedExpenseType');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri úprave druhu výdavku. ${err.message}`);
        alert(`Nastala chyba pri úprave druhu výdavku. ${err.message}`);
    }
    return false;
};

export const deleteExpenseType = async (expenseTypeId, token) => {
    try {
        const response = await fetch(`${baseUrl}/ExpenseType/${expenseTypeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        
        if (response.ok) {
            console.log('deletedExpenseType');
            return true;
        } else {
            const data = await response.json();
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri vymazaní druhu výdavku. ${err.message}`);
        alert(`Nastala chyba pri vymazaní druhu výdavku. ${err.message}`);
    }
    return false;
};

// expense-log

export const listOfExpenseLogs = async (vehicleId, token, display) => {
    console.log(vehicleId, token, display);
    try {
        const response = await fetch(`${baseUrl}/expenseLog/byVehicle/${vehicleId}`, {
            method: 'POST',
            body: JSON.stringify(display),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('listOfExpenseLogs');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri zobrazení záznamov výdavkov. ${err.message}`);
        alert(`Nastala chyba pri zobrazení záznamov výdavkov. ${err.message}`);
    }
    return false;
};

export const createExpenseLog = async (expenseLog, token) => {
    console.log(expenseLog, token);
    try {
        const response = await fetch(`${baseUrl}/expenseLog`, {
            method: 'POST',
            body: JSON.stringify(expenseLog),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('createdExpenseLog');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri vytvorení výdavku. ${err.message}`);
        alert(`Nastala chyba pri vytvorení výdavku. ${err.message}`);
    }
    return false;
};

export const getSingleExpenseLog = async (expensesLogId, token) => {
    try {
        const response = await fetch(`${baseUrl}/expenseLog/${expensesLogId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('gettedSingExpenseLog');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri zobrazení záznamu pre daný výdavok. ${err.message}`);
        alert(`Nastala chyba pri zobrazení záznamu pre daný výdavok. ${err.message}`);
    }
    return false;
};

export const updateExpenseLog = async (expensesLogId, updatedData, token) => {
    try {
        const response = await fetch(`${baseUrl}/expenseLog/${expensesLogId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        const data = await response.json();

        if (response.ok) {
            console.log('updatedExpenseLog');
            return data;
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri úprave výdavku. ${err.message}`);
        alert(`Nastala chyba pri úprave výdavku. ${err.message}`);
    }
    return false;
};

export const deleteExpenseLog = async (expensesLogId, token) => {
    try {
        const response = await fetch(`${baseUrl}/expenseLog/${expensesLogId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response);
        
        if (response.ok) {
            console.log('deletedExpenseLog');
            return true;
        } else {
            const data = await response.json();
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
        console.log(`Nastala chyba pri vymazaní výdavku. ${err.message}`);
        alert(`Nastala chyba pri vymazaní výdavku. ${err.message}`);
    }
    return false;
};

// stats