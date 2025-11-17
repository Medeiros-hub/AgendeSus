import { PrismaClient, UserType, SchedulingStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // Limpar dados existentes (opcional - comentar se não quiser limpar)
  console.log('🗑️  Limpando dados existentes...');
  await prisma.schedulingLog.deleteMany();
  await prisma.scheduling.deleteMany();
  await prisma.availableTime.deleteMany();
  await prisma.healthProfessional.deleteMany();
  await prisma.service.deleteMany();
  await prisma.uBS.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Dados limpos!\n');

  // Criar UBS
  console.log('🏥 Criando UBS...');
  const ubs1 = await prisma.uBS.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'UBS Central',
      cep: '60000-000',
      address: 'Rua Principal, 123 - Centro',
      phone: '(85) 3456-7890',
    },
  });

  const ubs2 = await prisma.uBS.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'UBS Bairro Novo',
      cep: '60100-000',
      address: 'Av. Secundária, 456 - Bairro Novo',
      phone: '(85) 3456-7891',
    },
  });
  console.log(`✅ ${2} UBS criadas!\n`);

  // Criar Serviços
  console.log('💉 Criando Serviços...');
  const servicoClinicaGeral = await prisma.service.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440010',
      name: 'Clínica Geral',
      description: 'Atendimento médico geral',
      durationMinutes: 30,
    },
  });

  const servicoPediatria = await prisma.service.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440011',
      name: 'Pediatria',
      description: 'Atendimento pediátrico',
      durationMinutes: 30,
    },
  });

  const servicoCardiologia = await prisma.service.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440012',
      name: 'Cardiologia',
      description: 'Atendimento cardiológico',
      durationMinutes: 45,
    },
  });

  const servicoGinecologia = await prisma.service.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440013',
      name: 'Ginecologia',
      description: 'Atendimento ginecológico',
      durationMinutes: 40,
    },
  });
  console.log(`✅ ${4} Serviços criados!\n`);

  // Criar Profissionais de Saúde
  console.log('👨‍⚕️ Criando Profissionais de Saúde...');
  const profissionais = [
    {
      id: 'aeb3e111-e579-422e-96c5-be8adafcc077',
      name: 'Dr. João Silva',
      specialty: 'Clínica Geral',
      crm: 'CRM/CE 12345',
      ubsId: ubs1.id,
      serviceId: servicoClinicaGeral.id,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440021',
      name: 'Dra. Maria Santos',
      specialty: 'Pediatria',
      crm: 'CRM/CE 12346',
      ubsId: ubs1.id,
      serviceId: servicoPediatria.id,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440022',
      name: 'Dr. Carlos Oliveira',
      specialty: 'Cardiologia',
      crm: 'CRM/CE 12347',
      ubsId: ubs2.id,
      serviceId: servicoCardiologia.id,
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440023',
      name: 'Dra. Ana Costa',
      specialty: 'Ginecologia',
      crm: 'CRM/CE 12348',
      ubsId: ubs2.id,
      serviceId: servicoGinecologia.id,
    },
  ];

  for (const prof of profissionais) {
    await prisma.healthProfessional.create({ data: prof });
  }
  console.log(`✅ ${profissionais.length} Profissionais criados!\n`);

  // Criar Usuários
  console.log('👤 Criando Usuários...');
  const hashedPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440030',
      cpf: '111.111.111-11',
      fullName: 'Administrador do Sistema',
      birthDate: new Date('1980-01-01'),
      phone: '(85) 98888-8888',
      email: 'admin@agendesus.com',
      password: hashedPassword,
      type: UserType.ADMIN,
      zipcode: '60000-000',
      address: 'Rua Admin, 1',
    },
  });

  const recepcionista = await prisma.user.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440031',
      cpf: '222.222.222-22',
      fullName: 'Recepcionista Maria',
      birthDate: new Date('1990-05-15'),
      phone: '(85) 98888-8889',
      email: 'recepcionista@agendesus.com',
      password: hashedPassword,
      type: UserType.RECEPTIONIST,
      zipcode: '60000-000',
      address: 'Rua Recepção, 2',
    },
  });

  const cidadao = await prisma.user.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440032',
      cpf: '333.333.333-33',
      fullName: 'José da Silva',
      birthDate: new Date('1985-10-20'),
      phone: '(85) 98888-8890',
      email: 'jose@email.com',
      password: hashedPassword,
      type: UserType.CITIZEN,
      zipcode: '60100-000',
      address: 'Rua Cidadão, 3',
    },
  });
  console.log(`✅ ${3} Usuários criados (senha padrão: 123456)!\n`);

  // Criar Horários Disponíveis
  console.log('📅 Criando Horários Disponíveis...');

  // Função auxiliar para criar slots
  const createSlots = async (
    date: string,
    startHour: number,
    endHour: number,
    intervalMinutes: number,
    healthProfessionalId: string,
    ubsId: string,
    serviceId: string,
  ) => {
    const [year, month, day] = date.split('-').map(Number);
    const baseDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

    const slots = [];
    let currentMinutes = startHour * 60;
    const endMinutes = endHour * 60;

    while (currentMinutes + intervalMinutes <= endMinutes) {
      const startH = Math.floor(currentMinutes / 60);
      const startM = currentMinutes % 60;
      const endH = Math.floor((currentMinutes + intervalMinutes) / 60);
      const endM = (currentMinutes + intervalMinutes) % 60;

      const startTime = new Date(
        Date.UTC(year, month - 1, day, startH, startM, 0, 0),
      );
      const endTime = new Date(
        Date.UTC(year, month - 1, day, endH, endM, 0, 0),
      );

      slots.push({
        date: baseDate,
        startTime,
        endTime,
        available: true,
        healthProfessionalId,
        ubsId,
        serviceId,
      });

      currentMinutes += intervalMinutes;
    }

    return slots;
  };

  // Criar horários para os próximos 7 dias
  const today = new Date();
  let totalSlots = 0;

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    // Dr. João Silva - Manhã (8h-12h)
    const slotsJoao = await createSlots(
      dateStr,
      8,
      12,
      30,
      'aeb3e111-e579-422e-96c5-be8adafcc077',
      ubs1.id,
      servicoClinicaGeral.id,
    );

    // Dra. Maria Santos - Tarde (14h-18h)
    const slotsMaria = await createSlots(
      dateStr,
      14,
      18,
      30,
      '550e8400-e29b-41d4-a716-446655440021',
      ubs1.id,
      servicoPediatria.id,
    );

    // Dr. Carlos Oliveira - Manhã (8h-12h)
    const slotsCarlos = await createSlots(
      dateStr,
      8,
      12,
      45,
      '550e8400-e29b-41d4-a716-446655440022',
      ubs2.id,
      servicoCardiologia.id,
    );

    // Dra. Ana Costa - Tarde (13h-17h)
    const slotsAna = await createSlots(
      dateStr,
      13,
      17,
      40,
      '550e8400-e29b-41d4-a716-446655440023',
      ubs2.id,
      servicoGinecologia.id,
    );

    const allSlots = [...slotsJoao, ...slotsMaria, ...slotsCarlos, ...slotsAna];

    await prisma.availableTime.createMany({
      data: allSlots,
      skipDuplicates: true,
    });

    totalSlots += allSlots.length;
  }

  console.log(
    `✅ ${totalSlots} Horários disponíveis criados para os próximos 7 dias!\n`,
  );

  console.log('✨ Seed concluído com sucesso!\n');
  console.log('📋 Resumo:');
  console.log(`   - ${2} UBS`);
  console.log(`   - ${4} Serviços`);
  console.log(`   - ${4} Profissionais de Saúde`);
  console.log(`   - ${3} Usuários (senha: 123456)`);
  console.log(`   - ${totalSlots} Horários Disponíveis`);
  console.log('\n🔐 Credenciais de acesso:');
  console.log('   Admin:         admin@agendesus.com / 123456');
  console.log('   Recepcionista: recepcionista@agendesus.com / 123456');
  console.log('   Cidadão:       jose@email.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
