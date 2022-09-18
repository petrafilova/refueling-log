-- ENUMS

CREATE TYPE "enum_VehicleFuels_fuel" AS ENUM (
    'GASOLINE',
    'DIESEL',
    'LPG',
    'CNG',
    'HYDROGEN',
    'ELECTRICITY'
);

-- TABLES

CREATE TABLE "ExpenseLogs" (
    id integer NOT NULL,
    price numeric(10,2) NOT NULL,
    mileage numeric(10,2) NOT NULL,
    "dateTime" timestamp with time zone NOT NULL,
    comment text,
    "typeId" integer NOT NULL,
    "vehicleId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "ExpenseTypes" (
    id integer NOT NULL,
    name character varying(30) NOT NULL,
    username character varying(255) NOT NULL
);

CREATE TABLE "FuelLogs" (
    id integer NOT NULL,
    quantity numeric(10,2) NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    "totalPrice" numeric(10,2) NOT NULL,
    mileage numeric(10,2) NOT NULL,
    "dateTime" timestamp with time zone NOT NULL,
    "full" boolean NOT NULL,
    "previousMissing" boolean NOT NULL,
    consumption numeric(10,2),
    "vehicleFuelId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "MonthStatistics" (
    id integer NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    "priceSummary" numeric(10,2) DEFAULT 0 NOT NULL,
    "expenseTypeId" integer NOT NULL,
    "vehicleId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "Users" (
    username character varying(50) NOT NULL,
    password character varying(60) NOT NULL,
    email character varying(320) NOT NULL,
    uuid character varying(36),
    confirmed boolean NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "VehicleFuels" (
    id integer NOT NULL,
    fuel "enum_VehicleFuels_fuel" NOT NULL,
    "vehicleId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "Vehicles" (
    id integer NOT NULL,
    brand character varying(20) NOT NULL,
    model character varying(60) NOT NULL,
    "licensePlateNo" character varying(10) NOT NULL,
    "dateOfReg" date,
    color character varying(20),
    vin character varying(17),
    username character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

-- SEQUENCES

CREATE SEQUENCE "ExpenseLogs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "ExpenseLogs_id_seq" OWNED BY "ExpenseLogs".id;

CREATE SEQUENCE "ExpenseTypes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "ExpenseTypes_id_seq" OWNED BY "ExpenseTypes".id;

CREATE SEQUENCE "FuelLogs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "FuelLogs_id_seq" OWNED BY "FuelLogs".id;

CREATE SEQUENCE "MonthStatistics_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "MonthStatistics_id_seq" OWNED BY "MonthStatistics".id;

CREATE SEQUENCE "VehicleFuels_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "VehicleFuels_id_seq" OWNED BY "VehicleFuels".id;


CREATE SEQUENCE "Vehicles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "Vehicles_id_seq" OWNED BY "Vehicles".id;

ALTER TABLE ONLY "ExpenseLogs" ALTER COLUMN id SET DEFAULT nextval('"ExpenseLogs_id_seq"'::regclass);

ALTER TABLE ONLY "ExpenseTypes" ALTER COLUMN id SET DEFAULT nextval('"ExpenseTypes_id_seq"'::regclass);

ALTER TABLE ONLY "FuelLogs" ALTER COLUMN id SET DEFAULT nextval('"FuelLogs_id_seq"'::regclass);

ALTER TABLE ONLY "MonthStatistics" ALTER COLUMN id SET DEFAULT nextval('"MonthStatistics_id_seq"'::regclass);

ALTER TABLE ONLY "VehicleFuels" ALTER COLUMN id SET DEFAULT nextval('"VehicleFuels_id_seq"'::regclass);

ALTER TABLE ONLY "Vehicles" ALTER COLUMN id SET DEFAULT nextval('"Vehicles_id_seq"'::regclass);

-- CONSTRAINTS

ALTER TABLE ONLY "ExpenseLogs"
    ADD CONSTRAINT "ExpenseLogs_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY "ExpenseTypes"
    ADD CONSTRAINT "ExpenseTypes_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY "FuelLogs"
    ADD CONSTRAINT "FuelLogs_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY "MonthStatistics"
    ADD CONSTRAINT "MonthStatistics_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY "Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);

ALTER TABLE ONLY "Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (username);

ALTER TABLE ONLY "VehicleFuels"
    ADD CONSTRAINT "VehicleFuels_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY "Vehicles"
    ADD CONSTRAINT "Vehicles_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY "ExpenseLogs"
    ADD CONSTRAINT "ExpenseLogs_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ExpenseTypes"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "ExpenseLogs"
    ADD CONSTRAINT "ExpenseLogs_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "ExpenseTypes"
    ADD CONSTRAINT "ExpenseTypes_username_fkey" FOREIGN KEY (username) REFERENCES "Users"(username) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "FuelLogs"
    ADD CONSTRAINT "FuelLogs_vehicleFuelId_fkey" FOREIGN KEY ("vehicleFuelId") REFERENCES "VehicleFuels"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "MonthStatistics"
    ADD CONSTRAINT "MonthStatistics_expenseTypeId_fkey" FOREIGN KEY ("expenseTypeId") REFERENCES "ExpenseTypes"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "MonthStatistics"
    ADD CONSTRAINT "MonthStatistics_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "VehicleFuels"
    ADD CONSTRAINT "VehicleFuels_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "Vehicles"
    ADD CONSTRAINT "Vehicles_username_fkey" FOREIGN KEY (username) REFERENCES "Users"(username) ON UPDATE CASCADE ON DELETE CASCADE;

-- INDEXES

CREATE UNIQUE INDEX "unique-expense-log" ON "ExpenseLogs" USING btree ("dateTime", "typeId");

CREATE UNIQUE INDEX "unique-expense-type" ON "ExpenseTypes" USING btree (name, username);

CREATE UNIQUE INDEX "unique-fuel-log" ON "FuelLogs" USING btree ("dateTime", "vehicleFuelId");

CREATE UNIQUE INDEX "unique-vehicle" ON "Vehicles" USING btree ("licensePlateNo", vin, username);

CREATE UNIQUE INDEX "unique-vehicle-fuel" ON "VehicleFuels" USING btree (fuel, "vehicleId");