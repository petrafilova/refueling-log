const baseUrl = window.env.baseApiUrl;

export const register = async (regData) => {
    try {
        const response = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            body: JSON.stringify(regData),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            return true;
        } else {
            const data = await response.json();
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri registrácii. ${err.message}`);
    }
    return false;
};

export const login = async (loginData) => {
    try {
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (response.ok) {
            return {
                token: data.token,
                refreshToken: data.refreshToken,
                username: data.username,
            };
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri prihlásení. ${err.message}`);
    }
};

export const confirm = async (registrationKey) => {
    try {
        const response = await fetch(`${baseUrl}/auth/confirm/${registrationKey}`, {
            method: 'POST',
        });
        const data = await response.json();
        if (response.ok) {
            const confirmedData = {
                token: data.token,
                refreshToken: data.refreshToken,
                username: data.username,
            };
            return confirmedData;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri registrácii. ${err.message}`);
    }

};

export const refreshToken = async (refreshToken) => {
    try {
        const response = await fetch(`${baseUrl}/auth/refresh`, {
            method: 'POST',
            body: JSON.stringify(refreshToken),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (response.ok) {
            return {
                token: data.token,
                refreshToken: data.refreshToken,
                username: data.username,
            };
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zaslaní tokenu a refreshTokenu. ${err.message}`);
    }
};

export const password = async (newPassword) => {
    try {
        const response = await fetch(`${baseUrl}/auth/password`, {
            method: 'PUT',
            body: JSON.stringify(newPassword),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            alert('Zmena hesla prebehla úspešne.');
            return true;
        } else {
            const data = await response.json();
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zmene hesla. ${err.message}`);
    }
    return false;
};

export const deleteUserAccount = async (userInfo) => {
    try {
        const response = await fetch(`${baseUrl}/auth/delete`, {
            method: 'POST',
            body: JSON.stringify(userInfo),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            alert('Zmazanie účtu prebehlo úspešne.');
            return true;
        } else {
            const data = await response.json();
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zmazaní účtu. ${err.message}`);
    }
    return false;
};

export const createVehicle = async (createdVehicle) => {
    try {
        const response = await fetch(`${baseUrl}/vehicle`, {
            method: 'POST',
            body: JSON.stringify(createdVehicle),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri vytvorení vozidla. ${err.message}`);
    }
    return false;
};

export const getVehicles = async () => {
    try {
        const response = await fetch(`${baseUrl}/vehicle`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zobrazení vozidiel. ${err.message}`);
    }
    return false;
};

export const deleteVehicleById = async (vehicleId) => {
    try {
        const response = await fetch(`${baseUrl}/vehicle/${vehicleId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            return true;
        } else {
            const data = await response.json();
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zmazaní vozidla. ${err.message}`);
    }
    return false;
};

export const getVehicleById = async (vehicleId) => {
    try {
        const response = await fetch(`${baseUrl}/vehicle/${vehicleId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zobrazení vozidiel. ${err.message}`);
    }
    return false;
};

export const updateVehicleById = async (vehicleId, editedVehicle) => {
    try {
        const response = await fetch(`${baseUrl}/vehicle/${vehicleId}`, {
            method: 'PUT',
            body: JSON.stringify(editedVehicle),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zobrazení vozidiel. ${err.message}`);
    }
    return false;
};

export const createVehicleFuel = async (vehicleFuel) => {
    try {
        const response = await fetch(`${baseUrl}/vehicleFuel`, {
            method: 'POST',
            body: JSON.stringify(vehicleFuel),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri vytvorení paliva. ${err.message}`);
    }
    return false;
};

export const listOfVehicleFuels = async (vehicleId) => {
    try {
        const response = await fetch(`${baseUrl}/vehicleFuel/byVehicle/${vehicleId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zobrazení zoznamu palív pre dané vozidlo. ${err.message}`);
    }
    return false;
};

export const singleVehicleFuel = async (vehicleFuelId) => {
    try {
        const response = await fetch(`${baseUrl}/vehicleFuel/${vehicleFuelId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zobrazení paliva pre dané vozidlo. ${err.message}`);
    }
    return false;
};

export const updateVehicleFuel = async (vehicleFuelId, updateFuel) => {
    try {
        const response = await fetch(`${baseUrl}/vehicleFuel/${vehicleFuelId}`, {
            method: 'PUT',
            body: JSON.stringify(updateFuel),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri úprave paliva. ${err.message}`);
    }
    return false;
};

export const deleteVehicleFuel = async (vehicleFuelId) => {
    try {
        const response = await fetch(`${baseUrl}/vehicleFuel/${vehicleFuelId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            return true;
        } else {
            const data = await response.json();
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri vymazaní paliva. ${err.message}`);
    }
    return false;
};

// refueling log

export const listOfFuelLogs = async (vehicleFuelId, display) => {
    try {
        const response = await fetch(`${baseUrl}/fuelLog/byVehicleFuel/${vehicleFuelId}`, {
            method: 'POST',
            body: JSON.stringify(display),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zobrazení záznamov tankovania. ${err.message}`);
    }
    return false;
};

export const createFuelLog = async (fuelLog) => {
    try {
        const response = await fetch(`${baseUrl}/fuelLog`, {
            method: 'POST',
            body: JSON.stringify(fuelLog),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri vytvorení záznamu tankovania. ${err.message}`);
    }
    return false;
};

export const getSingleFuelLog = async (fuelLogId) => {
    try {
        const response = await fetch(`${baseUrl}/fuelLog/${fuelLogId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zobrazení záznamu pre dané palivo. ${err.message}`);
    }
    return false;
};

export const updateFuelLog = async (fuelLogId, updatedData) => {
    try {
        const response = await fetch(`${baseUrl}/fuelLog/${fuelLogId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri úprave záznamu tankovania. ${err.message}`);
    }
    return false;
};

export const deleteFuelLog = async (fuelLogId) => {
    try {
        const response = await fetch(`${baseUrl}/fuelLog/${fuelLogId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            return true;
        } else {
            const data = await response.json();
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri vymazaní záznamu tankovania. ${err.message}`);
    }
    return false;
};

// expense type

export const listOfExpensesTypes = async () => {
    try {
        const response = await fetch(`${baseUrl}/expenseType`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zobrazení druhov výdavkov. ${err.message}`);
    }
    return false;
};

export const createExpensesType = async (nameOfExpenseType) => {
    try {
        const response = await fetch(`${baseUrl}/expenseType`, {
            method: 'POST',
            body: JSON.stringify(nameOfExpenseType),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri vytvorení druhu výdavku. ${err.message}`);
    }
    return false;
};

export const updateExpenseType = async (expenseTypeId, updatedData) => {
    try {
        const response = await fetch(`${baseUrl}/expenseType/${expenseTypeId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri úprave druhu výdavku. ${err.message}`);
    }
    return false;
};

export const deleteExpenseType = async (expenseTypeId) => {
    try {
        const response = await fetch(`${baseUrl}/ExpenseType/${expenseTypeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            return true;
        } else {
            const data = await response.json();
            throw new Error(data.code);
        }
    } catch (err) {
        if (err.message === 'CONSTRAINT_FAILED') {
            alert('Nastala chyba pri vymazaní druhu výdavku. Pre daný druh výdavku existuje záznam v zozname výdavkov.');
        } else {
            alert(`Nastala chyba pri vymazaní druhu výdavku. ${err.message}`);
        }
    }
    return false;
};

// expense log

export const listOfExpenseLogs = async (vehicleId, display) => {
    try {
        const response = await fetch(`${baseUrl}/expenseLog/byVehicle/${vehicleId}`, {
            method: 'POST',
            body: JSON.stringify(display),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zobrazení záznamov výdavkov. ${err.message}`);
    }
    return false;
};

export const createExpenseLog = async (expenseLog) => {
    try {
        const response = await fetch(`${baseUrl}/expenseLog`, {
            method: 'POST',
            body: JSON.stringify(expenseLog),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri vytvorení výdavku. ${err.message}`);
    }
    return false;
};

export const getSingleExpenseLog = async (expensesLogId) => {
    try {
        const response = await fetch(`${baseUrl}/expenseLog/${expensesLogId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zobrazení záznamu pre daný výdavok. ${err.message}`);
    }
    return false;
};

export const updateExpenseLog = async (expensesLogId, updatedData) => {
    try {
        const response = await fetch(`${baseUrl}/expenseLog/${expensesLogId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri úprave výdavku. ${err.message}`);
    }
    return false;
};

export const deleteExpenseLog = async (expensesLogId) => {
    try {
        const response = await fetch(`${baseUrl}/expenseLog/${expensesLogId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            return true;
        } else {
            const data = await response.json();
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri vymazaní výdavku. ${err.message}`);
    }
    return false;
};

// stats

export const vehicleStatisticsSummary = async (vehicleId) => {
    try {
        const response = await fetch(`${baseUrl}/stats/${vehicleId}/total`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zobrazení štatistiky pre dané vozidlo. ${err.message}`);
    }
    return false;
};

export const vehicleExpensesStatistic = async (vehicleId, date) => {
    try {
        const response = await fetch(`${baseUrl}/stats/${vehicleId}/expenses`, {
            method: 'POST',
            body: JSON.stringify(date),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zobrazení štatistiky výdavkov pre dané vozidlo. ${err.message}`);
    }
    return false;
};

export const vehicleFuelCostsStatistic = async (vehicleId, display) => {
    try {
        const response = await fetch(`${baseUrl}/stats/${vehicleId}/fuel`, {
            method: 'POST',
            body: JSON.stringify(display),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zobrazení štatistiky výdavkov za tankovanie pre dané vozidlo. ${err.message}`);
    }
    return false;
};

export const vehicleFuelConsumptionStatistic = async (vehicleId, display) => {
    try {
        const response = await fetch(`${baseUrl}/stats/${vehicleId}/consumption`, {
            method: 'POST',
            body: JSON.stringify(display),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.code);
        }
    } catch (err) {
        alert(`Nastala chyba pri zobrazení štatistiky spotreby paliva pre dané vozidlo. ${err.message}`);
    }
    return false;
};