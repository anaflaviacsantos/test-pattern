import { Carrinho } from '../../src/domain/Carrinho.js';
import { Item } from '../../src/domain/Item.js';
import { UserMother } from './UserMother.js';

export class CarrinhoBuilder {
    
    constructor() {
        // Carrinho válido com um usuário padrão e um item genérico.
        this.user = UserMother.usuarioPadrao();
        this.itens = [
            new Item('Item Padrão 1', 100.00)
        ];
    }

    // Define o usuário do carrinho.
    comUser(user) {
        this.user = user;
        return this; 
    }

    // Define uma lista específica de itens para o carrinho.
    comItens(itens) {
        this.itens = itens;
        return this;
    }

    // Carrinho vazio.
    vazio() {
        this.itens = [];
        return this;
    }

    // Constrói o objeto Carrinho 
    build() {
        return new Carrinho(this.user, this.itens);
    }
}