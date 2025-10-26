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

    await prisma.domaines.createMany({
            data: [
                { id_domaine: 1, domaine_name: 'campus-eni.fr' },
                { id_domaine: 2, domaine_name: 'gmail.com' },
            ]
    });

    await prisma.user.createMany({
        data: [
            {
                id_user: 1,
                email: 'axel.mainguy2022@campus-eni.fr',
                first_name: 'Axel',
                last_name: 'Mainguy',
                password: '$2b$08$C6UzMDM.H6dfI/f/IKcZeuG7r8T5C3J0de5pY/1fVPeu1o8a8kOa.', // "password123"
                phone_number: '0601020304',
                roleId: 1,
                agency_id: 1,
                license_number: 'AB123CD',
                failed_attempts: 0,
                account_locked: false,
                active: true,
                deactivation_date: null
            },
            {
                id_user: 2,
                email: 'mathieu.lepetitcorps2022@campus-eni.fr',
                first_name: 'Mathieu',
                last_name: 'Lepetitcorps',
                password: '$2b$08$C6UzMDM.H6dfI/f/IKcZeuG7r8T5C3J0de5pY/1fVPeu1o8a8kOa.', // "password123"
                phone_number: '0605060708',
                roleId: 1,
                agency_id: 2,
                license_number: 'EF456GH',
                failed_attempts: 0,
                account_locked: false,
                active: true,
                deactivation_date: null
            },
            {
                id_user: 3,
                email: 'claire.martin2019@campus-eni.fr',
                first_name: 'Claire',
                last_name: 'Martin',
                password: '$2b$08$C6UzMDM.H6dfI/f/IKcZeuG7r8T5C3J0de5pY/1fVPeu1o8a8kOa.', // "password123"
                phone_number: '0608091011',
                roleId: 1,
                agency_id: 1,
                license_number: 'IJ789KL',
                failed_attempts: 0,
                account_locked: false,
                active: true,
                deactivation_date: null
            },
            {
                id_user: 4,
                email: 'mathieu.peran2023@campus-eni.fr',
                first_name: 'Mathieu',
                last_name: 'Peran',
                password: '$2b$08$C6UzMDM.H6dfI/f/IKcZeuG7r8T5C3J0de5pY/1fVPeu1o8a8kOa.', // "password123"
                phone_number: '0611121314',
                roleId: 1,
                agency_id: 2,
                license_number: 'MN012OP',
                failed_attempts: 0,
                account_locked: false,
                active: true,
                deactivation_date: null
            },
            {
                id_user: 5,
                email: 'sparkotto2@gmail.com',
                first_name: 'sparkotto',
                last_name: 'test',
                password: '$2b$08$C6UzMDM.H6dfI/f/IKcZeuG7r8T5C3J0de5pY/1fVPeu1o8a8kOa.', // "password123"
                phone_number: '0615161718',
                roleId: 2,
                agency_id: 1,
                license_number: 'QR345ST',
                failed_attempts: 0,
                account_locked: false,
                active: true,
                deactivation_date: null
            }
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
