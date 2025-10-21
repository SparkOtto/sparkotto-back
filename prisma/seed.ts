import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Référentiels
    await prisma.fuelTypes.createMany({
        data: [
          { id_fuel: 1, fuel_name: 'Essence' },
          { id_fuel: 2, fuel_name: 'Diesel' },
          { id_fuel: 3, fuel_name: 'Électrique' },
        ],
        skipDuplicates: true,
    });

    await prisma.roles.createMany({
        data: [
            { id_role: 1, role_name: 'admin' },
            { id_role: 2, role_name: 'user' },
        ],
        skipDuplicates: true,
    });

  await prisma.transmissions.createMany({
    data: [
      { id_transmission: 1, transmission_type: 'Manuelle' },
      { id_transmission: 2, transmission_type: 'Automatique' },
    ],
    skipDuplicates: true,
  });

  await prisma.agencies.createMany({
    data: [
        {
        id_agency: 1,
        city: 'Paris',
        postal_code: 75001,
        street: '10 Rue de Rivoli',
        additional_info: 'Bureau principal',
        phone: '0102030405',
        head_office: true
        },
        {
        id_agency: 2,
        city: 'Lyon',
        postal_code: 69001,
        street: '25 Rue de la République',
        additional_info: null,
        phone: '0607080910',
        head_office: false
        }
    ],
        skipDuplicates: true,
    });


  // Véhicules
  await prisma.vehicles.createMany({
    data: [
      {
        brand: 'Renault',
        model: 'Clio',
        fuelTypeId: 1,
        license_plate: 'AB-123-CD',
        mileage: 50000,
        seat_count: 5,
        agency_id: 1,
        available: true,
        fuel_capacity: 45,
        transmissionId: 1,
      },
      {
        brand: 'Peugeot',
        model: '308',
        fuelTypeId: 2,
        license_plate: 'BC-456-EF',
        mileage: 30000,
        seat_count: 5,
        agency_id: 2,
        available: false,
        fuel_capacity: 50,
        transmissionId: 2,
      },
      {
        brand: 'Tesla',
        model: 'Model 3',
        fuelTypeId: 3,
        license_plate: 'EV-789-ZZ',
        mileage: 15000,
        seat_count: 5,
        agency_id: 1,
        available: true,
        fuel_capacity: 75,
        transmissionId: 2,
      },
      {
        brand: 'Toyota',
        model: 'Yaris',
        fuelTypeId: 1,
        license_plate: 'GH-111-IJ',
        mileage: 80000,
        seat_count: 4,
        agency_id: 2,
        available: true,
        fuel_capacity: 42,
        transmissionId: 1,
      },
    ],
    skipDuplicates: true,
  });

  // Keys
    await prisma.keys.createMany({
        data: [
            { id_key: 1, key_name: 'Clé Renault Clio', agency_id: 1, vehicleKeyId: 1 },
            { id_key: 2, key_name: 'Clé Peugeot 308', agency_id: 2, vehicleKeyId: 2 },
            { id_key: 3, key_name: 'Clé Tesla Model 3', agency_id: 1, vehicleKeyId: 3 },
            { id_key: 4, key_name: 'Clé Toyota Yaris', agency_id: 2, vehicleKeyId: 4 },
            { id_key: 5, key_name: 'Clé de secours Renault Clio', agency_id: 1, vehicleKeyId: 1 },
            { id_key: 6, key_name: 'Clé de secours Peugeot 308', agency_id: 2, vehicleKeyId: 2 },
            { id_key: 7, key_name: 'Clé de secours Tesla Model 3', agency_id: 1, vehicleKeyId: 3 },
            { id_key: 8, key_name: 'Clé de secours Toyota Yaris', agency_id: 2, vehicleKeyId: 4 },
        ],
        skipDuplicates: true,
    });

  console.log('Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
