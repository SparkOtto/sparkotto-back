-- CreateTable
CREATE TABLE "Agencies" (
    "id_agency" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "postal_code" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "additional_info" TEXT,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Agencies_pkey" PRIMARY KEY ("id_agency")
);

-- CreateTable
CREATE TABLE "Trips" (
    "id_trip" SERIAL NOT NULL,
    "id_used_key" INTEGER NOT NULL,
    "id_vehicle" INTEGER NOT NULL,
    "id_driver" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "departure_agency" INTEGER NOT NULL,
    "arrival_agency" INTEGER NOT NULL,
    "reservation_status" TEXT NOT NULL,
    "carpooling" BOOLEAN NOT NULL,
    "meeting_time" TIMESTAMP(3),
    "meeting_comment" TEXT,

    CONSTRAINT "Trips_pkey" PRIMARY KEY ("id_trip")
);

-- CreateTable
CREATE TABLE "Carpooling" (
    "id_trip" INTEGER NOT NULL,
    "id_passenger" INTEGER NOT NULL,

    CONSTRAINT "Carpooling_pkey" PRIMARY KEY ("id_trip","id_passenger")
);

-- CreateTable
CREATE TABLE "User" (
    "id_user" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "agency_id" INTEGER,
    "license_number" TEXT,
    "failed_attempts" INTEGER,
    "account_locked" BOOLEAN,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id_role" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id_role")
);

-- CreateTable
CREATE TABLE "VehicleStateRecords" (
    "id_state_record" SERIAL NOT NULL,
    "id_vehicle" INTEGER NOT NULL,
    "state_date" TIMESTAMP(3) NOT NULL,
    "state_type" TEXT NOT NULL,
    "internal_cleanliness" INTEGER NOT NULL,
    "external_cleanliness" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "VehicleStateRecords_pkey" PRIMARY KEY ("id_state_record")
);

-- CreateTable
CREATE TABLE "States" (
    "id_state" SERIAL NOT NULL,
    "state_type" TEXT NOT NULL,

    CONSTRAINT "States_pkey" PRIMARY KEY ("id_state")
);

-- CreateTable
CREATE TABLE "VehicleParts" (
    "id_part" SERIAL NOT NULL,
    "part_name" TEXT NOT NULL,

    CONSTRAINT "VehicleParts_pkey" PRIMARY KEY ("id_part")
);

-- CreateTable
CREATE TABLE "Vehicles" (
    "id_vehicle" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "fuelTypeId" INTEGER NOT NULL,
    "license_plate" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL,
    "seat_count" INTEGER NOT NULL,
    "agency_id" INTEGER NOT NULL,
    "available" BOOLEAN NOT NULL,
    "fuel_capacity" INTEGER,
    "transmissionId" INTEGER NOT NULL,

    CONSTRAINT "Vehicles_pkey" PRIMARY KEY ("id_vehicle")
);

-- CreateTable
CREATE TABLE "FuelTypes" (
    "id_fuel" SERIAL NOT NULL,
    "fuel_name" TEXT NOT NULL,

    CONSTRAINT "FuelTypes_pkey" PRIMARY KEY ("id_fuel")
);

-- CreateTable
CREATE TABLE "Transmissions" (
    "id_transmission" SERIAL NOT NULL,
    "transmission_type" TEXT NOT NULL,

    CONSTRAINT "Transmissions_pkey" PRIMARY KEY ("id_transmission")
);

-- CreateTable
CREATE TABLE "MaintenanceRecords" (
    "id_maintenance" SERIAL NOT NULL,
    "id_vehicle" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceRecords_pkey" PRIMARY KEY ("id_maintenance")
);

-- CreateTable
CREATE TABLE "Keys" (
    "id_key" SERIAL NOT NULL,
    "key_name" TEXT NOT NULL,
    "keyLocationId" INTEGER NOT NULL,
    "vehicleKeyId" INTEGER,

    CONSTRAINT "Keys_pkey" PRIMARY KEY ("id_key")
);

-- CreateTable
CREATE TABLE "KeyLocations" (
    "id_key_location" SERIAL NOT NULL,
    "agency_id" INTEGER NOT NULL,
    "office" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "KeyLocations_pkey" PRIMARY KEY ("id_key_location")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_license_plate_key" ON "Vehicles"("license_plate");

-- CreateIndex
CREATE UNIQUE INDEX "Keys_vehicleKeyId_key" ON "Keys"("vehicleKeyId");

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_id_used_key_fkey" FOREIGN KEY ("id_used_key") REFERENCES "Keys"("id_key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_id_vehicle_fkey" FOREIGN KEY ("id_vehicle") REFERENCES "Vehicles"("id_vehicle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_id_driver_fkey" FOREIGN KEY ("id_driver") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carpooling" ADD CONSTRAINT "Carpooling_id_trip_fkey" FOREIGN KEY ("id_trip") REFERENCES "Trips"("id_trip") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carpooling" ADD CONSTRAINT "Carpooling_id_passenger_fkey" FOREIGN KEY ("id_passenger") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id_role") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "Agencies"("id_agency") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleStateRecords" ADD CONSTRAINT "VehicleStateRecords_id_vehicle_fkey" FOREIGN KEY ("id_vehicle") REFERENCES "Vehicles"("id_vehicle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_fuelTypeId_fkey" FOREIGN KEY ("fuelTypeId") REFERENCES "FuelTypes"("id_fuel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "Agencies"("id_agency") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_transmissionId_fkey" FOREIGN KEY ("transmissionId") REFERENCES "Transmissions"("id_transmission") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecords" ADD CONSTRAINT "MaintenanceRecords_id_vehicle_fkey" FOREIGN KEY ("id_vehicle") REFERENCES "Vehicles"("id_vehicle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keys" ADD CONSTRAINT "Keys_keyLocationId_fkey" FOREIGN KEY ("keyLocationId") REFERENCES "KeyLocations"("id_key_location") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keys" ADD CONSTRAINT "Keys_vehicleKeyId_fkey" FOREIGN KEY ("vehicleKeyId") REFERENCES "Vehicles"("id_vehicle") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyLocations" ADD CONSTRAINT "KeyLocations_agency_id_fkey" FOREIGN KEY ("agency_id") REFERENCES "Agencies"("id_agency") ON DELETE RESTRICT ON UPDATE CASCADE;
