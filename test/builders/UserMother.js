import { User } from '../../src/domain/User';

export class UserMother {
    
    // Cria um usuário padrão.
    static usuarioPadrao() {
        return new User(
            1,
            'Usuário Padrão',
            'padrao@email.com',
            'PADRAO'
        );
    }

    // Cria um usuário premium.
    static usuarioPremium() {
        return new User(
            2,
            'Usuário Premium',
            'premium@email.com',
            'PREMIUM'
        );
    }
}