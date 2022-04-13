import 'dotenv/config';

import { app } from './app';
import sequelize from './util/database';

const port = process.env.PORT || 3000;

(async () => {
    await sequelize.sync({force: true});

    app.listen(port, () => console.info(`Server running on port ${port}`));
})();
