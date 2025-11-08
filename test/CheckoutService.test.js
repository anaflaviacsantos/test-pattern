import { CheckoutService } from '../src/services/CheckoutService.js';
import { CarrinhoBuilder } from './builders/CarrinhoBuilder.js';
import { UserMother } from './builders/UserMother.js';
import { Item } from '../src/domain/Item.js';

describe('CheckoutService', () => {

    // Padrão stub 
    describe('quando o pagamento falha', () => {
        test('deve retornar null', async () => {
            // Arrange 
            const carrinho = new CarrinhoBuilder().build();
            const cartaoCredito = { numero: '1234', cvv: '123' }; 
            const gatewayStub = {
                cobrar: jest.fn().mockResolvedValue({ success: false })
            };
            
            // dummies
            const repositoryDummy = { salvar: jest.fn() };
            const emailServiceDummy = { enviarEmail: jest.fn() };

            const checkoutService = new CheckoutService(gatewayStub, repositoryDummy, emailServiceDummy);

            // Act 
            const pedido = await checkoutService.processarPedido(carrinho, cartaoCredito);

            // Assert 
            expect(pedido).toBeNull();
            expect(repositoryDummy.salvar).not.toHaveBeenCalled();
            expect(emailServiceDummy.enviarEmail).not.toHaveBeenCalled();
        });
    });

    // Padrão mock 
    describe('quando um cliente premium finaliza a compra', () => {
        test('deve aplicar 10% de desconto e enviar e-mail de confirmação', async () => {
            // Arrange 
            const usuarioPremium = UserMother.usuarioPremium();
            const itens = [
                new Item('Item 1', 150.00),
                new Item('Item 2', 50.00) 
            ];
            const carrinho = new CarrinhoBuilder()
                .comUser(usuarioPremium)
                .comItens(itens)
                .build();

            const cartaoCredito = { numero: '5678', cvv: '456' }; 
            
            const pedidoSalvoMock = { 
                id: 123, 
                carrinho: carrinho, 
                total: 180.00, 
                status: 'PROCESSADO' 
            };

            const gatewayStub = {
                cobrar: jest.fn().mockResolvedValue({ success: true })
            };
            const repositoryStub = {
                salvar: jest.fn().mockResolvedValue(pedidoSalvoMock)
            };

            const emailMock = {
                enviarEmail: jest.fn() 
            };

            const checkoutService = new CheckoutService(gatewayStub, repositoryStub, emailMock);

            // Act 
            await checkoutService.processarPedido(carrinho, cartaoCredito);

            // Assert 
            expect(gatewayStub.cobrar).toHaveBeenCalledTimes(1);
            expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, cartaoCredito); // 280 é com o desconto aplicado

            
            expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
            expect(emailMock.enviarEmail).toHaveBeenCalledWith(
                'premium@email.com',
                'Seu Pedido foi Aprovado!',
                `Pedido ${pedidoSalvoMock.id} no valor de R$180` 
            );
        });
    });
});