import 'dotenv/config';

import { app } from './app';
import User from './models/database/user';
import sequelize from './util/database';

const port = process.env.PORT || 3000;

(async () => {
    await sequelize.sync();

    await User.findOrCreate({
        where: {
            username: 'test',
        },
        defaults: {
            username: 'test',
            password: 'Test1234',
            email: 'test@test.com',
            confirmed: true
        }
    })

    app.listen(port, () => console.info(`Server running on port ${port}`));
})();
