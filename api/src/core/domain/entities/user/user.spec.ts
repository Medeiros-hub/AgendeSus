import { User, UserType } from './user';

describe('User Entity', () => {
  const makeProps = () => ({
    cpf: '12345678900',
    fullName: 'John Doe',
    birthDate: new Date('1990-01-01'),
    phone: '11999999999',
    email: 'john.doe@example.com',
    password: 'hashed-password',
    type: UserType.CITIZEN,
    zipcode: '01001000',
    address: 'Rua Exemplo, 123',
  });

  it('deve criar usuário com id gerado automaticamente', () => {
    const user = User.create(makeProps());
    expect(user.id).toBeDefined();
    expect(user.props.fullName).toBe('John Doe');
  });

  it('deve manter id informado externamente', () => {
    const customId = 'fixed-id-123';
    const user = User.create(makeProps(), customId);
    expect(user.id).toBe(customId);
  });

  it('deve converter usuário para JSON corretamente', () => {
    const user = User.create(makeProps(), 'fixed-id-123');
    const json = user.toJSON(user);
    expect(json).toEqual({
      id: 'fixed-id-123',
      ...makeProps(),
    });
  });
});
