const baseUrl = 'http://localhost:8080';
// const loginUrl = 'http://localhost:8080/auth/login';
// const refreshUrl ='http://localhost:8080/auth/refresh';
// // const confirmUrl = '';
// const passwordUrl = 'http://localhost:8080/auth/password';
// const deleteaUrl = 'http://localhost:8080/auth/delete';

// export async function register(regData) {
//     console.log(regData);
//     try {
//         const response = await fetch(`${baseUrl}/auth/register`, {
//             method: 'POST',
//             body: JSON.stringify(regData),
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//         console.log(response);

//         if(response.ok) {
//             return alert('Registrácia prebehla úspešne');
//         } else if (response.status === 409 || response.status === 422 || response.status === 500 || response.status === 503) {
//             const data = await response.json();
//             console.log(data);
//             console.log(data.code);
//             alert(data.code);
//         } else {
//             alert('Nastala chyba pri registrácii.');
//         }
//     } catch (err) {
//         alert('Nastala chyba pri registrácii.');
//     }
// }

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
            alert('Pre dokončenie registrácie zadajte registračný kľúč.');
            return true;
        } else {
            const data = await response.json();
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
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
            return alert('Prihlásenie prebehlo úspešne');
        } else {
            console.log(data);
            console.log(data.code);
            throw new Error(data.code);
        }
    } catch (err) {
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
            alert('Registrácia prebehla úspešne');

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
        alert(`Nastala chyba pri registrácii. ${err.message}`);
    }

};
