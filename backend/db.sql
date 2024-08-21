SET timezone = 'Asia/Ho_Chi_Minh';

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(100),
    phone VARCHAR(15),
    birth DATE,
    gender VARCHAR(10),
    mail VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'user',
    isDelete BOOLEAN DEFAULT FALSE,
    createdtime TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    modifiedtime TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL,
    ticketids INTEGER[] NOT NULL,
    mail VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    isDelete BOOLEAN DEFAULT FALSE,
    createdtime TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    modifiedtime TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickettypes (
    id SERIAL PRIMARY KEY,
    eventid INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total INTEGER NOT NULL,
    minbuy INTEGER NOT NULL,
    maxbuy INTEGER NOT NULL,
    starttime TIMESTAMP NOT NULL,
    endtime TIMESTAMP NOT NULL,
    description TEXT,
    img BYTEA,
    isDelete BOOLEAN DEFAULT FALSE,
    createdtime TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    modifiedtime TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    logo BYTEA,
    coverimg BYTEA,
    name VARCHAR(255) NOT NULL,
    venuename VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100),
    street VARCHAR(255),
    category VARCHAR(100),
    description TEXT,
    starttime TIMESTAMP NOT NULL,
    endtime TIMESTAMP NOT NULL,
    accowner VARCHAR(255),
    accnumber VARCHAR(50),
    bank VARCHAR(100),
    branch VARCHAR(100),
    isDelete BOOLEAN DEFAULT FALSE,
    createdtime TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    modifiedtime TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    typeid INTEGER NOT NULL,
    eventid INTEGER NOT NULL,
    isDelete BOOLEAN DEFAULT FALSE,
    createdtime TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    modifiedtime TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modifiedtime = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_modified_time
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_modified_time_bookings
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_modified_time_tickettypes
BEFORE UPDATE ON tickettypes
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_modified_time_events
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_modified_time_tickets
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
