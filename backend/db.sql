SET
    timezone = 'Asia/Ho_Chi_Minh';

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(100),
    phone VARCHAR(15),
    birth DATE,
    gender VARCHAR(10),
    mail VARCHAR(255) NOT NULL UNIQUE,
    "roleId" INTEGER NOT NULL,
    "isDelete" BOOLEAN DEFAULT FALSE,
    "createdTime" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "modifiedTime" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "emailVerificationToken" VARCHAR(255),
    "isEmailVerified" BOOLEAN DEFAULT FALSE
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "ticketIds" INTEGER [] NOT NULL,
    mail VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    "isDelete" BOOLEAN DEFAULT FALSE,
    "createdTime" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "modifiedTime" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ticketTypes" (
    id SERIAL PRIMARY KEY,
    "eventId" INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total INTEGER NOT NULL,
    "minBuy" INTEGER NOT NULL,
    "maxBuy" INTEGER NOT NULL,
    "startTime" TIMESTAMP NOT NULL,
    "endTime" TIMESTAMP NOT NULL,
    description TEXT,
    img BYTEA,
    "isDelete" BOOLEAN DEFAULT FALSE,
    "createdTime" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "modifiedTime" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    logo BYTEA,
    "coverImg" BYTEA,
    name VARCHAR(255) NOT NULL,
    "venueName" VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100),
    street VARCHAR(255),
    category VARCHAR(100),
    description TEXT,
    "startTime" TIMESTAMP NOT NULL,
    "endTime" TIMESTAMP NOT NULL,
    "accOwner" VARCHAR(255),
    "accNumber" VARCHAR(50),
    bank VARCHAR(100),
    branch VARCHAR(100),
    "isFree" BOOLEAN DEFAULT FALSE,
    "isDelete" BOOLEAN DEFAULT FALSE,
    "createdTime" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "modifiedTime" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    "typeId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "isDelete" BOOLEAN DEFAULT FALSE,
    "createdTime" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "modifiedTime" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);


CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."modifiedTime" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_modified_time BEFORE
UPDATE
    ON users FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_modified_time_bookings BEFORE
UPDATE
    ON bookings FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_modified_time_tickettypes BEFORE
UPDATE
    ON "ticketTypes" FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_modified_time_events BEFORE
UPDATE
    ON events FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_modified_time_tickets BEFORE
UPDATE
    ON tickets FOR EACH ROW EXECUTE FUNCTION update_modified_column();